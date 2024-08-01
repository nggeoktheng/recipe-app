import express from "express";
import ViteExpress from "vite-express";
import dotenv from 'dotenv';

import userRouter from "./routes/user.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.get("/hello", (req, res) => {
  res.send("Hello Vite + React!");
});

app.use(express.json());
app.use("/user", userRouter);

ViteExpress.config({
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development'
});

ViteExpress.listen(app, 3000, () =>
  console.log(`Server is listening on port ${port}`),
);
