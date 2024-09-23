import express from "express";
import { getStarredRecipes } from "../models/starred.js";

const router = express.Router();

router.get("/starred", async (req, res) => {
    try {
        const user = req.session.user;
        const userId = user.id;
        const recipes = await getStarredRecipes(userId);
        res.status(200).json(recipes);
    } catch (error) {
        console.log("Error getting starred recipes: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;