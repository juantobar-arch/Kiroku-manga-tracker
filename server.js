import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./db.js";
import router from "./router.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// Connect to sqlite
const db = connectDB();
app.locals.db = db;

// Routes
app.use("/api", router);

// Servir las vistas HTML
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "anime_search_&_browse.html"));
});

app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "user_authentication.html"));
});

app.get("/watchlist", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "watchlist_dashboard.html"));
});

app.get("/anime/:id", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "anime_detail_screen.html"));
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});

