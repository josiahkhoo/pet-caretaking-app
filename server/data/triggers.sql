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
DROP TRIGGER IF EXISTS bid_trigger on Bid CASCADE;
CREATE TRIGGER big_trigger BEFORE
INSERT
    OR
UPDATE ON Bid FOR EACH ROW EXECUTE FUNCTION bid_care_taker_can_take_care_of_pet();