CREATE TABLE Users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL,
    contact_number VARCHAR(8) NOT NULL,
    name VARCHAR(100) NOT NULL,
    is_pcs_admin BOOLEAN NOT NULL,
    is_pet_owner BOOLEAN NOT NULL,
    unique(username)
);
CREATE TABLE CareTakers (
    user_id INTEGER PRIMARY KEY,
    bonus_percent NUMERIC(4, 3),
    base_salary INTEGER,
    minimum_base_quota INTEGER,
    commission_rate NUMERIC(3, 3),
    is_full_time BOOLEAN NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    CONSTRAINT bonus_percent_positive CHECK (
        bonus_percent >= 0
        OR bonus_percent IS NULL
    ),
    CONSTRAINT bonus_percent_upper_limit CHECK (
        bonus_percent <= 1
        OR bonus_percent IS NULL
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
            bonus_percent IS NOT NULL
            AND base_salary IS NOT NULL
            AND minimum_base_quota IS NOT NULL
            AND commission_rate IS NULL
        )
    ),
    CONSTRAINT is_not_full_time_contain_commission CHECK (
        is_full_time
        OR (
            COALESCE(bonus_percent, base_salary, minimum_base_quota) IS NULL
            AND commission_rate IS NOT NULL
        )
    )
);
CREATE TABLE Categories (name VARCHAR(100) PRIMARY KEY);
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
-- TODO: Add trigger to check if owner is a pet owner
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
    available_date DATE,
    pet_owner_user_id INTEGER,
    pet_name VARCHAR(100),
    is_success BOOLEAN NOT NULL,
    payment_type VARCHAR(100) NOT NULL,
    transfer_type VARCHAR(100) NOT NULL,
    total_price INTEGER,
    review VARCHAR(1000),
    rating INTEGER,
    datetime_created TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (
        care_taker_user_id,
        available_date,
        pet_owner_user_id,
        pet_name
    ),
    FOREIGN KEY (care_taker_user_id, available_date) REFERENCES IsAvailableOn(care_taker_user_id, available_date),
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
-- TODO: Add trigger to check if care taker can tke care of the pet