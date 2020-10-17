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
SELECT COUNT(*), NEW.end_date - NEW.start_date + 1 INTO available_days, total_days
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
CREATE TRIGGER bid_care_taker_is_available_to_insert_trigger
	BEFORE INSERT ON Bid
	FOR EACH ROW
	EXECUTE FUNCTION bid_care_taker_is_available_to_insert();
-- This trigger checks if the care taker in the bid can take care of pet between start day to end day before update
CREATE OR REPLACE FUNCTION bid_care_taker_is_available_to_update() RETURNS TRIGGER AS $$
DECLARE available_days INTEGER;
DECLARE total_days INTEGER;
BEGIN
SELECT COUNT(*), NEW.end_date - NEW.start_date + 1 INTO available_days, total_days
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
CREATE TRIGGER bid_care_taker_is_available_to_update_trigger
	BEFORE UPDATE ON Bid
	FOR EACH ROW
	EXECUTE FUNCTION bid_care_taker_is_available_to_update();