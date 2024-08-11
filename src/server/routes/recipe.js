import path from "path";
import express from "express";
import { isAuthenticated } from "../middleware/auth.js";
import multer from "multer";
import { addRecipe, getRecipes } from "../models/recipe.js";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(import.meta.dirname, '../uploads'))
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileExt = file.originalname.substring(file.originalname.lastIndexOf('.') + 1);
        cb(null, "recipe-" + file.fieldname + "-" + uniqueSuffix + '.' + fileExt);
    }
});

const router = express.Router();
const upload = multer({ storage });

router.get("/", async (req, res) => {
    try {
        const recipes = await getRecipes();

        res.json({ recipes });
    } catch (error) {
        res.json({ error: error.message });
    }
});

router.post("/", isAuthenticated, upload.single("image"), async (req, res) => {
    const imagePath = `/uploads/${req.file.filename}`;
    try {
        const savedImage = await addRecipe({
            user_id: req.session.user.id,
            title: req.body.title,
            ingredients: req.body.ingredients,
            steps: req.body.steps,
            cooking_time: req.body.cooking_time,
            image_url: imagePath
        });
        res.json({ success: savedImage });
    } catch (error) {
        res.json({ error: error.message });
    }
});

export default router;