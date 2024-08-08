CREATE TABLE "users" (
    "id" integer NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    "profile_img" varchar,
    "first_name" varchar,
    "last_name" varchar,
    "username" varchar,
    "bio" text,
    "dob" date,
    "email" varchar,
    "password" varchar,
    "created_at" timestamp DEFAULT CURRENT_TIMESTAMP
);