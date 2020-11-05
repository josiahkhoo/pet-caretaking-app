INSERT INTO CareTakers (
        user_id,
        bonus_rate,
        base_salary,
        minimum_base_quota,
        is_full_time,
        commission_rate
    )
VALUES (1, 0.5, 1000, 2, True, NULL);
INSERT INTO CareTakers (
        user_id,
        bonus_percent,
        base_rate,
        minimum_base_quota,
        is_full_time,
        commission_rate
    )
VALUES (2, NULL, NULL, NULL, False, 0.5);