import path from "path";
import express from "express";
import { createUser, getUserProfile, loginUser, setUserAvatar, updateUserProfile } from "../models/user.js";
import { isAuthenticated } from "../middleware/auth.js";
import multer from "multer";

const router = express.Router();
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const pathToUploads = process.env.NODE_ENV === "production" ? "/var/data/uploads" : path.join(import.meta.dirname, "../uploads");
        cb(null, pathToUploads);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
        const fileExt = file.originalname.substring(file.originalname.lastIndexOf(".") + 1);
        cb(null, file.fieldname + "-" + uniqueSuffix + "." + fileExt);
    }
});

const upload = multer({ storage });

// Create user
router.post("/", async (req, res) => {
    try {
        await createUser(req.body);
        res.json({success: true});
    } catch (error) {
        res.json({error: error.message});
    }
});

// Get user profile data
router.get("/profile", isAuthenticated, async (req, res) => {
    try {
        const userProfile = await getUserProfile(req.session.user.id);
        res.json({userProfile});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put("/profile", isAuthenticated, async (req, res) => {
    try {
        const updatedProfile = await updateUserProfile(req.session.user.id, req.body);
        res.json(updatedProfile);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post("/avatar", isAuthenticated, upload.single("avatar"), async (req, res) => {
    try {
        const avatarUrl = `/uploads/${req.file.filename}`;
        const updatedUser = await setUserAvatar(avatarUrl, req.session.user.id);
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Login user
router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await loginUser(username, password);

        if (user) {
            req.session.user = user;
            res.json({success: true});
        }
    } catch (error) {
        res.json({error: error.message});
    }
});

router.post("/logout", async (req, res) => {
    req.session.destroy();
    res.json({ success: true });
})

export default router;