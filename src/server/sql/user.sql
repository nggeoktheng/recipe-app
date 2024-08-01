CREATE TABLE users(
    id int NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(100),
    password VARCHAR(255),
    email VARCHAR(255),
    create_time DATE
);