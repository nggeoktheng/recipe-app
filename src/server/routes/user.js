import path from "path";
import express from "express";
import { createUser, getUserProfile, loginUser, setUserAvatar } from "../models/user.js";
import { isAuthenticated } from "../middleware/auth.js";
import multer from "multer";

const router = express.Router();
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(import.meta.dirname, "../uploads"))
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
router.get("/", isAuthenticated, async (req, res) => {
    const user = await getUserProfile(req.session.user.id);

    res.json({user})
});

router.post("/avatar", isAuthenticated, upload.single("avatar"), async (req, res) => {
    console.log("I have ", {
        file: req.file
    });
    const filename = req.file.filename;
    try {
        const uploaded = await setUserAvatar(filename, req.session.user.id);
        return res.json({ success: uploaded });
    } catch (error) {
        return res.json({ error: error.message });
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