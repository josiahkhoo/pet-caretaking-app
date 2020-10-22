-- This trigger checks if pet owner specified has is_pet_owner attribute set to True
CREATE OR REPLACE FUNCTION owned_pets_owner_must_be_pet_owner() RETURNS TRIGGER AS $$
DECLARE count INTEGER;
BEGIN
SELECT COUNT(*) INTO count
FROM Users U
WHERE NEW.pet_owner_user_id = U.user_id
    AND U.is_pet_owner = TRUE;
IF count <= 0 THEN RAISE EXCEPTION '% is not a pet owner',
(
    SELECT username
    FROM Users
    WHERE NEW.pet_owner_user_id = Users.user_id
);
END IF;
RETURN NEW;
END;
$$ LANGUAGE PLPGSQL;
DROP TRIGGER IF EXISTS owned_pets_trigger on OwnedPets CASCADE;
CREATE TRIGGER owned_pets_trigger BEFORE
INSERT
    OR
UPDATE ON OwnedPets FOR EACH ROW EXECUTE FUNCTION owned_pets_owner_must_be_pet_owner();
-- This trigger checks if care taker in the bid can take care of the category that the chosen pet is from
CREATE OR REPLACE FUNCTION bid_care_taker_can_take_care_of_pet() RETURNS TRIGGER AS $$
DECLARE count INTEGER;
BEGIN
SELECT COUNT(*) INTO count
FROM CanTakeCare ctc,
    OwnedPets pet
WHERE NEW.care_taker_user_id = ctc.care_taker_user_id
    AND NEW.pet_owner_user_id = pet.pet_owner_user_id
    AND NEW.pet_name = pet.pet_name
    AND pet.category_name = ctc.category_name;
IF count <= 0 THEN RAISE EXCEPTION '% cannot take care of %',
(
    SELECT username
    FROM Users
    WHERE NEW.care_taker_user_id = Users.user_id
),
(
    SELECT category_name
    FROM OwnedPets
    WHERE OwnedPets.pet_owner_user_id = NEW.pet_owner_user_id
        AND OwnedPets.pet_name = NEW.pet_name
);
END IF;
RETURN NEW;
END;
$$ LANGUAGE PLPGSQL;
DROP TRIGGER IF EXISTS bid_care_taker_can_take_care_of_pet_trigger on Bid CASCADE;
CREATE TRIGGER bid_care_taker_can_take_of_pet_trigger BEFORE
INSERT
    OR
UPDATE ON Bid FOR EACH ROW EXECUTE FUNCTION bid_care_taker_can_take_care_of_pet();
-- This trigger checks if the care taker in the bid can take care of pet between start day to end day before insert
CREATE OR REPLACE FUNCTION bid_care_taker_is_available_to_insert() RETURNS TRIGGER AS $$
DECLARE available_days INTEGER;
DECLARE total_days INTEGER;
BEGIN
SELECT COUNT(*),
    NEW.end_date - NEW.start_date + 1 INTO available_days,
    total_days
FROM IsAvailableOnWithPetCareCount a,
    CareTakersWithPetLimitAndRating c
WHERE NEW.care_taker_user_id = a.care_taker_user_id
    AND NEW.care_taker_user_id = c.user_id
    AND a.available_date >= NEW.start_date
    AND a.available_date <= NEW.end_date
    AND a.pet_care_count < c.pet_limit;
IF available_days <> total_days THEN RAISE EXCEPTION '% cannot take care of the pet between % and %',
(
    SELECT username
    FROM Users
    WHERE NEW.care_taker_user_id = Users.user_id
),
NEW.start_date,
NEW.end_date;
END IF;
RETURN NEW;
END;
$$ LANGUAGE PLPGSQL;
DROP TRIGGER IF EXISTS bid_care_taker_is_available_to_insert_trigger on Bid CASCADE;
CREATE TRIGGER bid_care_taker_is_available_to_insert_trigger BEFORE
INSERT ON Bid FOR EACH ROW EXECUTE FUNCTION bid_care_taker_is_available_to_insert();
-- This trigger checks if the care taker in the bid can take care of pet between start day to end day before update
CREATE OR REPLACE FUNCTION bid_care_taker_is_available_to_update() RETURNS TRIGGER AS $$
DECLARE available_days INTEGER;
DECLARE total_days INTEGER;
BEGIN
SELECT COUNT(*),
    NEW.end_date - NEW.start_date + 1 INTO available_days,
    total_days
FROM IsAvailableOnWithPetCareCount a,
    CareTakersWithPetLimitAndRating c
WHERE NEW.care_taker_user_id = a.care_taker_user_id
    AND NEW.care_taker_user_id = c.user_id
    AND a.available_date >= NEW.start_date
    AND a.available_date <= NEW.end_date
    AND a.pet_care_count <= c.pet_limit;
IF available_days <> total_days THEN RAISE EXCEPTION '% cannot take care of the pet between % and %',
(
    SELECT username
    FROM Users
    WHERE NEW.care_taker_user_id = Users.user_id
),
NEW.start_date,
NEW.end_date;
END IF;
RETURN NEW;
END;
$$ LANGUAGE PLPGSQL;
DROP TRIGGER IF EXISTS bid_care_taker_is_available_to_update_trigger on Bid CASCADE;
CREATE TRIGGER bid_care_taker_is_available_to_update_trigger AFTER
UPDATE ON Bid FOR EACH ROW EXECUTE FUNCTION bid_care_taker_is_available_to_update();
-- This trigger injects the pets default daily price if caretaker is a full time caretaker
CREATE OR REPLACE FUNCTION can_take_care_full_time_care_taker_daily_price() RETURNS TRIGGER AS $$
DECLARE daily_price INTEGER;
DECLARE is_full_time BOOLEAN;
BEGIN
SELECT cat.full_time_daily_price,
    caretaker.is_full_time INTO daily_price,
    is_full_time
FROM CareTakers caretaker,
    Categories cat
WHERE caretaker.user_id = NEW.care_taker_user_id
    AND cat.name = NEW.category_name
LIMIT 1;
IF is_full_time THEN NEW.daily_price = daily_price;
END IF;
RETURN NEW;
END;
$$ LANGUAGE PLPGSQL;
DROP TRIGGER IF EXISTS can_take_care_full_time_care_taker_daily_price_trigger ON CanTakeCare CASCADE;
CREATE TRIGGER can_take_care_full_time_care_taker_daily_price_trigger BEFORE
INSERT ON CanTakeCare FOR EACH ROW EXECUTE FUNCTION can_take_care_full_time_care_taker_daily_price();
-- This trigger checks if the care taker in the bid is a full time caretaker, if it is, set it to true automatically and inserts the price
CREATE OR REPLACE FUNCTION bid_full_time_care_taker_auto_confirm () RETURNS TRIGGER AS $$
DECLARE is_full_time BOOLEAN;
DECLARE base_price INTEGER;
DECLARE rating FLOAT;
DECLARE multiplier FLOAT;
BEGIN
SELECT c.is_full_time,
    ctc.daily_price,
    c.rating,
    a.good_review_full_time_total_price_multiplier INTO is_full_time,
    base_price,
    rating,
    multiplier
FROM CareTakersWithPetLimitAndRating c,
    CanTakeCare ctc,
    OwnedPets p,
    Admin a
WHERE c.user_id = NEW.care_taker_user_id
    AND p.pet_owner_user_id = NEW.pet_owner_user_id
    AND p.pet_name = NEW.pet_name
    AND p.category_name = ctc.category_name
    AND ctc.care_taker_user_id = NEW.care_taker_user_id;
IF is_full_time = TRUE THEN IF rating >= 4 THEN
UPDATE bid
SET total_price = base_price * multiplier,
    is_success = TRUE
WHERE bid.care_taker_user_id = NEW.care_taker_user_id
    AND bid.start_date = NEW.start_date
    AND bid.end_date = NEW.end_date
    AND bid.pet_owner_user_id = NEW.pet_owner_user_id
    AND bid.pet_name = NEW.pet_name;
ELSE
UPDATE bid
SET total_price = base_price,
    is_success = TRUE
WHERE bid.care_taker_user_id = NEW.care_taker_user_id
    AND bid.start_date = NEW.start_date
    AND bid.end_date = NEW.end_date
    AND bid.pet_owner_user_id = NEW.pet_owner_user_id
    AND bid.pet_name = NEW.pet_name;
END IF;
END IF;
RETURN NEW;
END;
$$ LANGUAGE PLPGSQL;
DROP TRIGGER IF EXISTS bid_full_time_care_taker_auto_confirm_trigger ON Bid CASCADE;
CREATE TRIGGER bid_full_time_care_taker_auto_confirm_trigger
AFTER
INSERT ON Bid FOR EACH ROW EXECUTE FUNCTION bid_full_time_care_taker_auto_confirm();