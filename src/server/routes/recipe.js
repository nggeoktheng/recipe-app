import path from "path";
import express from "express";
import { isAuthenticated } from "../middleware/auth.js";
import multer from "multer";
import { addRecipe, getRecipeById, getRecipes, addComment, getComments, addStar, removeStar, isStarred, deleteRecipe, updateRecipe } from "../models/recipe.js";
import { searchCountdownNZ } from "../services/groceryScraper.js";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const pathToUploads = process.env.NODE_ENV === "production" ? "/var/data/uploads" : path.join(import.meta.dirname, "..", "uploads");
        cb(null, pathToUploads);
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
        const searchTerm = req.query.search || "";
        const recipes = await getRecipes(searchTerm);

        res.json({ recipes });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/:recipeId", async (req, res) => {
    try {
        const recipe = await getRecipeById(req.params.recipeId);
        return res.json({ recipe });
    } catch (error) {
        return res.json({ error: error.message });
    }
});

router.post("/:recipeId", isAuthenticated, async (req, res) => {
    try {
        const recipe = await updateRecipe(req.params.recipeId, {
            title: req.body.title,
            ingredients: req.body.ingredients.split("\n"),
            steps: req.body.steps,
            cooking_time: req.body.cooking_time
        });
        return res.json({ success: true, recipeId: recipe });
    } catch (error) {
        return res.json({ error: error.message });
    }
});

router.delete("/:recipeId", isAuthenticated, async (req, res) => {
    try {
        const recipe = await deleteRecipe(req.params.recipeId, req.session.user.id);
        return res.json({ recipe });
    } catch (error) {
        return res.json({ error: error.message });
    }
});

router.post("/", isAuthenticated, upload.single("image"), async (req, res) => {
    const imagePath = `/uploads/${req.file.filename}`;
    try {
        const ingredients = req.body.ingredients.split("\n");
        console.log("Ingredients: ", ingredients);

        const savedRecipe = await addRecipe({
            user_id: req.session.user.id,
            title: req.body.title,
            ingredients,
            steps: req.body.steps,
            cooking_time: req.body.cooking_time,
            image_url: imagePath
        });
        
        if (savedRecipe) {
            return res.json({ success: true, recipeId: savedRecipe });
        }

        return res.json({ error: "Unable to save recipe"});
    } catch (error) {
        res.json({ error: error.message });
    }
});

router.post('/:recipeId/comments', isAuthenticated, async (req, res) => {
    try {
        const { recipeId } = req.params;
        const { comment } = req.body;
        const userId = req.session.user.id;
        const newComment = await addComment(userId, recipeId, comment);
        res.json({ success: true, comment: newComment });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:recipeId/comments', async (req, res) => {
    try {
        const { recipeId } = req.params;
        const comments = await getComments(recipeId);
        res.json({ success: true, comments });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/:recipeId/star', isAuthenticated, async (req, res) => {
    try {
        const { recipeId } = req.params;
        const userId = req.session.user.id;
        await addStar(userId, recipeId);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:recipeId/star', isAuthenticated, async (req, res) => {
    try {
        const { recipeId } = req.params;
        const userId = req.session.user.id;
        await removeStar(userId, recipeId);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:recipeId/star', isAuthenticated, async (req, res) => {
    try {
        const { recipeId } = req.params;
        const userId = req.session.user.id;
        const isStarredResult = await isStarred(userId, recipeId);
        res.json({ isStarred: isStarredResult });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;