CREATE OR REPLACE VIEW IsAvailableOnWithPetCareCount AS (
        SELECT c.care_taker_user_id AS care_taker_user_id,
            c.available_date AS available_date,
            COUNT(
                CASE
                    WHEN b.is_success THEN 1
                END
            ) AS pet_care_count
        FROM IsAvailableOn c
            LEFT JOIN Bid b ON c.care_taker_user_id = b.care_taker_user_id
            AND c.available_date >= b.start_date
            AND c.available_date <= b.end_date
        GROUP BY c.care_taker_user_id,
            c.available_date
    );
CREATE OR REPLACE VIEW CareTakersWithPetLimitAndRating AS (
        SELECT c.user_id AS user_id,
            c.bonus_rate AS bonus_rate,
            c.base_salary AS base_salary,
            c.minimum_base_quota AS minimum_base_quota,
            c.commission_rate AS commission_rate,
            c.is_full_time AS is_full_time,
            AVG(b.rating) AS rating,
            (
                CASE
                    WHEN (
                        c.is_full_time
                        OR AVG(b.rating) >= 4
                    ) THEN a.pet_limit
                    ELSE a.poor_review_pet_limit
                END
            ) AS pet_limit
        FROM CareTakers c
            LEFT JOIN Bid b ON c.user_id = b.care_taker_user_id,
            Admin a
        GROUP BY c.user_id,
            a.pet_limit,
            a.poor_review_pet_limit
    );
CREATE OR REPLACE VIEW OwnedPetsWithTakenCareDate AS (
        SELECT pet_owner_user_id,
            pet_name,
            available_date AS taken_care_date
        FROM isavailableon iao,
            bid b
        WHERE iao.available_date >= b.start_date
            AND iao.available_date <= b.end_date
            AND iao.care_taker_user_id = b.care_taker_user_id
            AND b.is_success = TRUE
    );