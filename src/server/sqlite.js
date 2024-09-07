import sqlite3 from "sqlite3";

const db = new sqlite3.Database("ingredient_cache.db"); // Physical file for persistent storage

db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS ingredient_cache (ingredient_key TEXT PRIMARY KEY, data TEXT)");
  
    console.log("SQLite database initialized");
  
});
  
const executeQuery = (query, params) => new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
        if (err) {
            console.error("Database query error: ", err);
            reject(err);
        } else {
            console.log("Query executed successfully:", { query, params });
            resolve(rows);
        }
    });
});
  
const setCache = (key, data) => {
    const stmt = db.prepare("INSERT OR REPLACE INTO ingredient_cache (ingredient_key, data) VALUES (?, ?)");
    stmt.run(key, JSON.stringify(data));
    stmt.finalize();
};

const getFromCache = async (key) => {
    const rows = await executeQuery("SELECT * FROM ingredient_cache WHERE ingredient_key = ?", [key]);
    return rows.length > 0 ? JSON.parse(rows[0].data) : null;
};

export { executeQuery, setCache, getFromCache };