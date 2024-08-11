import dotenv from "dotenv";

dotenv.config();

import postgres from "postgres";

const sql = postgres({ /* options */ }); // will use psql environment variables

const createTables = async () => {
    // Create tables/add data here
}

createTables();

export default sql;