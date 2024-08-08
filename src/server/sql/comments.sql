CREATE TABLE "comments" (
    "id" integer NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    "user_id" integer,
    "recipe_id" integer,
    "comment" text,
    "created_at" timestamp DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE "comments" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "comments" ADD FOREIGN KEY ("recipe_id") REFERENCES "recipes" ("id");