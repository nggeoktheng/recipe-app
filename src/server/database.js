import dotenv from "dotenv";

dotenv.config();

import postgres from "postgres";

const sql = postgres({ /* opstions */ }); // will use psql environment variables

const createTables = async () => {
    const createUsers = await sql`
        CREATE TABLE IF NOT EXISTS users(
            id int NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
            name VARCHAR(100) NOT NULL,
            password VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL UNIQUE,
            create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `
    const createRecipes = await sql`
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
    `

    console.log("Created tables: ", {
        createUsers,
        createRecipes
    });
}

createTables();

export default sql;