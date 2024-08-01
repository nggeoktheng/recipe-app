import express from "express";

const router = express.Router();

router.post("/", (req, res) => {
    console.log("Received a post with ", {
        body: req.body
    });
    res.json({"some": "stuff"});
})

export default router;