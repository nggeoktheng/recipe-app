import express from "express";
import ViteExpress from "vite-express";
import session from "express-session";
import dotenv from 'dotenv';

import userRouter from "./routes/user.js";
import recipeRouter from "./routes/recipe.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.get("/hello", (req, res) => {
  res.send("Hello Vite + React!");
});

// To parse the body as json
app.use(express.json());
// For sessions
app.set("trust proxy", true);
app.use(session({
  name: "GT_RECIPE_APP",
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    // Set to secure for production
    secure: process.env.NODE_ENV === "production" ? true : false,
    maxAge: 60000 * 24 // 1 min (60,000 milliseconds)
  }
}));

// Serve the uploaded files as static files
app.use("/uploads", express.static(import.meta.dirname + "/uploads"));

// Routes
app.use("/user", userRouter);
app.use("/recipe", recipeRouter);

// Check if a user is logged in
// to check logged in state
app.get("/check", async (req, res) => {
  if (req.session.user) {
    res.json({ isAuthed: true });
    return;
  }
  res.json({ isAuthed: false });
})

ViteExpress.config({
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development'
});

ViteExpress.listen(app, 3000, () =>
  console.log(`Server is listening on port ${port}`),
);
