CREATE TABLE "starred" (
    "id" integer NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    "user_id" integer,
    "recipe_id" integer,
    "created_at" timestamp DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE "starred" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "starred" ADD FOREIGN KEY ("recipe_id") REFERENCES "recipes" ("id");

ALTER TABLE "starred" ADD CONSTRAINT "unique_user_recipe" UNIQUE ("user_id", "recipe_id");