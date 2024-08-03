import dotenv from "dotenv";

dotenv.config();

import postgres from "postgres";

const sql = postgres({ /* opstions */ }); // will use psql environment variables

export default sql;