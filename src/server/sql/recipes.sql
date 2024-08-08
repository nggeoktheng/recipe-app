CREATE TABLE "recipes" (
    "id" integer NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    "user_id" integer,
    "title" varchar,
    "ingredients" jsonb,
    "steps" text,
    "cooking_time" text,
    "image_url" varchar,
    "created_date" timestamp DEFAULT CURRENT_TIMESTAMP,
    "last_updated" timestamp DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE "recipes" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");