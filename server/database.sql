CREATE DATABASE db;

CREATE TABLE users(
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(50) NOT NULL,
    password VARCHAR(50) NOT NULL,
    display_name VARCHAR(50)
);