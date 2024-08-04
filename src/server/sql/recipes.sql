CREATE TABLE IF NOT EXISTS recipes(
    id int NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id int NOT NULL,
    name VARCHAR(100) NOT NULL,
    image_url TEXT,
    ingredients JSONB,
    instructions TEXT,
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);