CREATE TABLE Admin (
    good_review_full_time_total_price_multiplier FLOAT NOT NULL DEFAULT 1.2,
    full_time_base_salary INT NOT NULL DEFAULT 3000,
    poor_review_pet_limit INT NOT NULL DEFAULT 2,
    pet_limit INT NOT NULL DEFAULT 5,
    minimum_work_days_in_block INT NOT NULL DEFAULT 150,
    minimum_work_blocks INT NOT NULL DEFAULT 2,
    full_time_bonus_pet_day_threshold INT NOT NULL DEFAULT 60,
    part_time_commission_rate NUMERIC(3, 3) NOT NULL DEFAULT 0.75,
    full_time_bonus_rate NUMERIC(3, 3) NOT NULL DEFAULT 0.80,
    PRIMARY KEY (
        good_review_full_time_total_price_multiplier,
        full_time_base_salary,
        poor_review_pet_limit,
        pet_limit,
        minimum_work_days_in_block,
        minimum_work_blocks,
        full_time_bonus_pet_day_threshold,
        part_time_commission_rate,
        full_time_bonus_rate
    ),
    CONSTRAINT full_time_base_salary_positive CHECK (full_time_base_salary >= 0),
    CONSTRAINT good_review_full_time_total_price_multiplier_positive CHECK (
        good_review_full_time_total_price_multiplier >= 0
    ),
    CONSTRAINT poor_review_pet_limit_positive CHECK (poor_review_pet_limit >= 0),
    CONSTRAINT positive_pet_limit_positive CHECK (pet_limit >= 0),
    CONSTRAINT minimum_work_days_in_block_positive CHECK (minimum_work_days_in_block >= 0),
    CONSTRAINT minimum_work_blocks_positive CHECK (minimum_work_blocks >= 0),
    CONSTRAINT full_time_bonus_pet_day_threshold_positive CHECK (
        full_time_bonus_pet_day_threshold >= 0
    ),
    CONSTRAINT part_time_commission_rate_positive CHECK (part_time_commission_rate >= 0),
    CONSTRAINT full_time_bonus_rate_positive CHECK (full_time_bonus_rate >= 0)
);
CREATE TABLE Users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL,
    contact_number VARCHAR(20) NOT NULL,
    name VARCHAR(100) NOT NULL,
    address VARCHAR(100) NOT NULL,
    is_pcs_admin BOOLEAN NOT NULL,
    is_pet_owner BOOLEAN NOT NULL,
    image_url VARCHAR(255),
    unique(username)
);
CREATE TABLE CareTakers (
    user_id INTEGER PRIMARY KEY,
    bonus_rate NUMERIC(3, 3),
    base_salary INTEGER,
    minimum_base_quota INTEGER,
    commission_rate NUMERIC(3, 3),
    is_full_time BOOLEAN NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    CONSTRAINT bonus_rate_positive CHECK (
        bonus_rate >= 0
        OR bonus_rate IS NULL
    ),
    CONSTRAINT bonus_rate_upper_limit CHECK (
        bonus_rate <= 1
        OR bonus_rate IS NULL
    ),
    CONSTRAINT base_salary_postive CHECK (
        base_salary >= 0
        OR base_salary IS NULL
    ),
    CONSTRAINT minimum_base_quota CHECK (
        minimum_base_quota >= 0
        OR minimum_base_quota IS NULL
    ),
    CONSTRAINT is_full_time_contain_bonus_and_salary_and_quota CHECK (
        NOT is_full_time
        OR (
            bonus_rate IS NOT NULL
            AND base_salary IS NOT NULL
            AND minimum_base_quota IS NOT NULL
            AND commission_rate IS NULL
        )
    ),
    CONSTRAINT is_not_full_time_contain_commission CHECK (
        is_full_time
        OR (
            COALESCE(bonus_rate, base_salary, minimum_base_quota) IS NULL
            AND commission_rate IS NOT NULL
        )
    )
);
CREATE TABLE Categories (
    name VARCHAR(100) PRIMARY KEY,
    full_time_daily_price INTEGER NOT NULL,
    CONSTRAINT full_time_daily_price_positive CHECK (full_time_daily_price >= 0)
);
CREATE TABLE OwnedPets (
    pet_owner_user_id INTEGER,
    category_name VARCHAR(100),
    pet_name VARCHAR(100),
    special_requirements VARCHAR(100),
    image_url VARCHAR(255),
    PRIMARY KEY (pet_owner_user_id, pet_name),
    FOREIGN KEY (pet_owner_user_id) REFERENCES Users(user_id),
    FOREIGN KEY (category_name) REFERENCES Categories(name)
);
CREATE TABLE CanTakeCare (
    care_taker_user_id INTEGER,
    category_name VARCHAR(100),
    daily_price INTEGER NOT NULL,
    PRIMARY KEY (care_taker_user_id, category_name),
    FOREIGN KEY (care_taker_user_id) REFERENCES CareTakers(user_id),
    FOREIGN KEY (category_name) REFERENCES Categories(name),
    CONSTRAINT daily_price_positive CHECK (daily_price >= 0)
);
CREATE TABLE IsAvailableOn (
    care_taker_user_id INTEGER,
    available_date DATE,
    PRIMARY KEY (care_taker_user_id, available_date),
    FOREIGN KEY (care_taker_user_id) REFERENCES CareTakers(user_id)
);
CREATE TABLE Bid (
    care_taker_user_id INTEGER,
    pet_owner_user_id INTEGER,
    pet_name VARCHAR(100),
    is_success BOOLEAN NOT NULL DEFAULT FALSE,
    payment_type VARCHAR(100) NOT NULL,
    transfer_type VARCHAR(100) NOT NULL,
    total_price INTEGER,
    review VARCHAR(1000),
    rating INTEGER,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    datetime_created TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (
        care_taker_user_id,
        start_date,
        end_date,
        pet_owner_user_id,
        pet_name
    ),
    FOREIGN KEY (care_taker_user_id) REFERENCES CareTakers(user_id),
    FOREIGN KEY (pet_owner_user_id, pet_name) REFERENCES OwnedPets(pet_owner_user_id, pet_name),
    CONSTRAINT bid_success CHECK (
        CASE
            WHEN is_success THEN (total_price IS NOT NULL)
            ELSE total_price IS NULL
        END
    ),
    CONSTRAINT total_price_positive CHECK (
        total_price >= 0
        OR total_price IS NULL
    ),
    CONSTRAINT review_rating_exists_together CHECK (
        (
            review IS NULL
            AND rating IS NULL
        )
        OR (
            review IS NOT NULL
            AND rating IS NOT NULL
        )
    )
);