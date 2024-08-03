import express from "express";
import ViteExpress from "vite-express";
import session from "express-session";
import dotenv from 'dotenv';

import userRouter from "./routes/user.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.get("/hello", (req, res) => {
  res.send("Hello Vite + React!");
});

// To parse the body as json
app.use(express.json());
// For sessions
app.use(session({
  name: "GT_RECIPE_APP",
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    // Set to secure for production
    secure: process.env.NODE_ENV === "production" ? true : false,
    maxAge: 60000 // 1 min (60,000 milliseconds)
  }
}));

// Routes
app.use("/user", userRouter);

ViteExpress.config({
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development'
});

ViteExpress.listen(app, 3000, () =>
  console.log(`Server is listening on port ${port}`),
);
