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
CREATE TRIGGER bid_care_taker_is_available_to_update_trigger
AFTER
UPDATE ON Bid FOR EACH ROW EXECUTE FUNCTION bid_care_taker_is_available_to_update();
-- This trigger checks if the pet is currently being taken care of before confirmation
CREATE OR REPLACE FUNCTION bid_pet_not_already_taken_care_of() RETURNS TRIGGER AS $$
DECLARE days_taken_care_during_bid_period INTEGER;
BEGIN
SELECT COUNT(*) INTO days_taken_care_during_bid_period
FROM OwnedPetsWithTakenCareDate ownedpets
WHERE ownedpets.pet_owner_user_id = NEW.pet_owner_user_id
    AND ownedpets.pet_name = NEW.pet_name
    AND taken_care_date >= NEW.start_date
    AND taken_care_date <= NEW.end_date;
IF days_taken_care_during_bid_period > 0 THEN RAISE EXCEPTION '% is already being taken care of between % and %',
NEW.pet_name,
NEW.start_date,
NEW.end_date;
END IF;
RETURN NEW;
END;
$$ LANGUAGE PLPGSQL;
DROP TRIGGER IF EXISTS bid_pet_not_already_taken_care_of_trigger ON Bid CASCADE;
CREATE TRIGGER bid_pet_not_already_taken_care_of_trigger BEFORE
INSERT
    OR
UPDATE ON Bid FOR EACH ROW EXECUTE FUNCTION bid_pet_not_already_taken_care_of();
-- This trigger injects the pets default daily price if caretaker is a full time caretaker
CREATE OR REPLACE FUNCTION can_take_care_full_time_care_taker_daily_price() RETURNS TRIGGER AS $$
DECLARE daily_price INTEGER;
DECLARE is_full_time BOOLEAN;
BEGIN
SELECT cat.full_time_daily_price,
    caretaker.is_full_time INTO daily_price,
    is_full_time
FROM CareTakers caretaker,
    Categories cat,
    Admin a
WHERE caretaker.user_id = NEW.care_taker_user_id
    AND cat.name = NEW.category_name
LIMIT 1;
IF (
    is_full_time
    AND caretaker.rating >= 4
) THEN NEW.daily_price = daily_price * a.good_review_full_time_total_price_multiplier;
END IF;
IF (
    is_full_time
    AND caretaker.rating < 4
) THEN NEW.daily_price = daily_price;
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
DECLARE number_days INTEGER;
BEGIN
SELECT c.is_full_time,
    ctc.daily_price,
    c.rating,
    a.good_review_full_time_total_price_multiplier,
    (NEW.end_date - NEW.start_date + 1) INTO is_full_time,
    base_price,
    rating,
    multiplier,
    number_days
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
SET total_price = base_price * multiplier * number_days,
    is_success = TRUE
WHERE bid.care_taker_user_id = NEW.care_taker_user_id
    AND bid.start_date = NEW.start_date
    AND bid.end_date = NEW.end_date
    AND bid.pet_owner_user_id = NEW.pet_owner_user_id
    AND bid.pet_name = NEW.pet_name;
ELSE
UPDATE bid
SET total_price = base_price * number_days,
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
-- This trigger populates the is available on table when are caretaker is inserted until 2021
CREATE OR REPLACE FUNCTION full_time_care_taker_populate_is_available_on () RETURNS TRIGGER AS $$
DECLARE counter INTEGER := 0;
BEGIN IF NEW.is_full_time = TRUE THEN WHILE counter <= (DATE('01-01-2022') - DATE(NOW())) LOOP
INSERT INTO IsAvailableOn(
        care_taker_user_id,
        available_date
    )
VALUES (NEW.user_id, DATE(NOW()) + counter);
counter := counter + 1;
END LOOP;
END IF;
RETURN NEW;
END;
$$ LANGUAGE PLPGSQL;
DROP TRIGGER IF EXISTS full_time_care_taker_populate_is_available_on_trigger ON CareTakers;
CREATE TRIGGER full_time_care_taker_populate_is_available_on_trigger
AFTER
INSERT ON CareTakers FOR EACH ROW EXECUTE FUNCTION full_time_care_taker_populate_is_available_on();
-- This trigger checks if minimum 2 x 150 consecutive days requirement is fulfilled
CREATE OR REPLACE FUNCTION full_time_care_taker_block_leave () RETURNS TRIGGER AS $$
DECLARE current_leave_length INTEGER;
DECLARE first_period_length INTEGER;
DECLARE first_period_end_date DATE;
DECLARE second_period_length INTEGER;
DECLARE second_period_start_date DATE;
BEGIN
SELECT (365 - COUNT(*)) INTO current_leave_length
FROM IsAvailableOn iao
WHERE iao.care_taker_user_id = OLD.care_taker_user_id
    AND EXTRACT(
        YEAR
        FROM iao.available_date
    ) = EXTRACT(
        YEAR
        FROM OLD.available_date
    );
SELECT iao.available_date INTO first_period_end_date
FROM IsAvailableOn iao
WHERE iao.care_taker_user_id = OLD.care_taker_user_id
    AND EXTRACT(
        YEAR
        FROM iao.available_date
    ) = EXTRACT(
        YEAR
        FROM OLD.available_date
    )
    AND NOT EXISTS (
        SELECT *
        FROM IsAvailableOn inner_iao
        WHERE inner_iao.care_taker_user_id = iao.care_taker_user_id
            AND inner_iao.available_date = iao.available_date + 1
    );
SELECT iao.available_date INTO second_period_start_date
FROM IsAvailableOn iao
WHERE iao.care_taker_user_id = OLD.care_taker_user_id
    AND EXTRACT(
        YEAR
        FROM iao.available_date
    ) = EXTRACT(
        YEAR
        FROM OLD.available_date
    )
    AND NOT EXISTS (
        SELECT *
        FROM IsAvailableOn inner_iao
        WHERE inner_iao.care_taker_user_id = iao.care_taker_user_id
            AND inner_iao.available_date = iao.available_date - 1
    );
SELECT first_period_end_date - make_date(
        CAST(
            EXTRACT(
                YEAR
                FROM OLD.available_date
            ) AS INTEGER
        ),
        1,
        1
    ) + 1 INTO first_period_length;
SELECT make_date(
        CAST(
            EXTRACT(
                YEAR
                FROM OLD.available_date
            ) AS INTEGER
        ),
        12,
        31
    ) - second_period_start_date + 1 INTO second_period_length;
IF first_period_length < (
    SELECT minimum_work_days_in_block
    FROM Admin
    LIMIT 1
)
OR second_period_length < (
    SELECT minimum_work_days_in_block
    FROM Admin
    LIMIT 1
) THEN RAISE EXCEPTION '% cannot take leave on % because it violates the minimum work days in a block',
(
    SELECT username
    FROM Users
    WHERE OLD.care_taker_user_id = Users.user_id
),
OLD.available_date;
END IF;
IF current_leave_length > (
    SELECT 365 - (
            SELECT minimum_work_days_in_block
            FROM Admin
            LIMIT 1
        ) * (
            SELECT minimum_work_blocks
            FROM Admin
            LIMIT 1
        )
) THEN RAISE EXCEPTION '%s cannot take leave on % because he has already taken % leave day(s)',
(
    SELECT username
    FROM Users
    WHERE OLD.care_taker_user_id = Users.user_id
),
OLD.available_date,
current_leave_length;
END IF;
RETURN OLD;
END;
$$ LANGUAGE PLPGSQL;
DROP TRIGGER IF EXISTS full_time_care_taker_block_leave_trigger ON IsAvailableOn CASCADE;
CREATE TRIGGER full_time_care_taker_block_leave_trigger
AFTER DELETE ON IsAvailableOn FOR EACH ROW EXECUTE FUNCTION full_time_care_taker_block_leave();