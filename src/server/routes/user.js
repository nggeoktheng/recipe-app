import express from "express";
import { createUser, loginUser } from "../models/user.js";

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        await createUser(req.body);
        res.json({success: true});
    } catch (error) {
        res.json({error: error.message});
    }
});

// Login user
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await loginUser(email, password);

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