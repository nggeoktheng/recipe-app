-- Fully reset the database

-- Drop existing tables if they exist
DROP TABLE IF EXISTS starred;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS recipes;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS app_metadata;

-- Recreate tables

-- Users table
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

-- Recipes table
CREATE TABLE "recipes" (
  "id" integer NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  "user_id" integer,
  "title" varchar,
  "ingredients" jsonb,
  "steps" text,
  "cooking_time" text,
  "image_url" varchar,
  "created_date" timestamp DEFAULT CURRENT_TIMESTAMP,
  "last_updated" timestamp DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("user_id") REFERENCES "users" ("id")
);

-- Comments table
CREATE TABLE "comments" (
  "id" integer NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  "user_id" integer,
  "recipe_id" integer,
  "comment" text,
  "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("user_id") REFERENCES "users" ("id"),
  FOREIGN KEY ("recipe_id") REFERENCES "recipes" ("id")
);

-- Starred table
CREATE TABLE "starred" (
  "id" integer NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  "user_id" integer,
  "recipe_id" integer,
  "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("user_id") REFERENCES "users" ("id"),
  FOREIGN KEY ("recipe_id") REFERENCES "recipes" ("id"),
  CONSTRAINT "unique_user_recipe" UNIQUE ("user_id", "recipe_id")
);