import express from "express";
import { createUser, loginUser } from "../models/user.js";

const router = express.Router();

router.post("/", async (req, res) => {
    const { name, email, password } = req.body;

    try {
        await createUser(name, email, password);
        res.json({success: true});
    } catch (error) {
        res.json({error: error.message});
    }
});

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

export default router;