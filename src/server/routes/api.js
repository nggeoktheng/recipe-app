import express from "express";
import { searchCountdownNZ } from "../services/groceryScraper.js";

const router = express.Router();

router.post("/ingredient-info", async (req, res) => {
    try {
        const { ingredient } = req.body;
        const results = await searchCountdownNZ([ingredient]);
        res.json(results[0]);
    } catch (error) {
        console.error("Error fetching ingredient info: ", error);
    }
});

export default router;