# Recipe App

## Technologies used

- React
- Express
- PostgreSQL
- Vite

## Local setup for Postgres on MacBook

1. Setup Postgres locally via Homebrew
   1. Install postgresql
      ```
      brew install postgresql
      ```
   2. Create a user for postgres
      ```
      createuser -s postgres
      ```
   3. Start postgresql (this needs to be re-run whenever the computer is restarted)
      ```
      brew services run postgresql
      ```
2. Install pgAdmin to see the local Postgres easily
   1. Search `postgresql pgAdmin` and download the latest version
3. Connect to your local postgres database with pgAdmin
   1. Open pgAdmin
   2. In the menu bar, click `Object`
   3. Then click `Register > Server`, this will open a window
   4. Give the name `Local` so you know it's your local database
   5. In the `Connection` tab, in the `Host name/address` field, enter `localhost`
   6. Click `Save` and you should see the Local database in the left navigation
4. Create a database to use for the recipe app
   1. In the left navigation, under `Servers > Local > Databases`, right click `Databases` it might say `Databases (1)`
   2. Select `Create > Database...`
   3. Give the database a name, such as `recipe-app-db`
   4. Click `Save`

### Steps

1. Setup basic app using `create-vite-express`

- This creates a basic project with React and Express, using Vite for the tooling and config

2. Setup basic Single Page App (SPA) routing, using react-router through `react-router-dom`

- Then setup the routes in `App.jsx`

3. Setup PostgreSQL DB locally
4. Setup API routes
