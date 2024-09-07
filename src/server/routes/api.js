import express from "express";
import { searchCountdownNZ } from "../services/groceryScraper.js";
import crypto from 'node:crypto';
import { executeQuery, setCache, getFromCache } from '../sqlite.js';

const router = express.Router();

function generateCacheKey(ingredient) {
    return crypto.createHash('md5').update(ingredient.toLowerCase()).digest('hex');
}

router.post("/ingredient-info", async (req, res) => {
    try {
        const { ingredient } = req.body;
        console.log("Received ingredient: ", ingredient);

        const cacheKey = generateCacheKey(ingredient);
        console.log("Generated cache key: ", cacheKey);

        // Check if the ingredient is in the cache
        let cachedData = await getFromCache(cacheKey);
        console.log("Cache lookup result: ", cachedData);

        if (!cachedData) {
            // If not in cache, fetch from CountdownNZ
            console.log("Fetching data from CountdownNZ for ingredient: ", ingredient);
            const results = await searchCountdownNZ([ingredient]);
            cachedData = results[0];
            console.log("Fetched data: ", cachedData);
      
            // Store in cache
            await setCache(cacheKey, cachedData);
            console.log("Stored data in cache");
        }
    
        res.json(cachedData);        
    } catch (error) {
        console.error("Error fetching ingredient info: ", error);
        res.status(500).json({ error: "Failed to fetch ingredient info" });
    }
});

export default router;