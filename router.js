import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();
const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";

// Jikan API base URL
const JIKAN_API = "https://api.jikan.moe/v4";

// Middleware para verificar token
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Token requerido" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Token inválido" });
    req.user = user;
    next();
  });
}

router.post("/auth/register", async (req, res) => {
  const { email, password, username } = req.body;
  const db = req.app.locals.db;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const stmt = db.prepare(
      "INSERT INTO users (email, password, username) VALUES (?, ?, ?)"
    );
    const result = await stmt.run(
      email,
      hashedPassword,
      username || email.split("@")[0]
    );

    const token = jwt.sign({ id: result.lastInsertRowid, email }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({
      message: "Usuario creado exitosamente",
      token,
      user: {
        id: result.lastInsertRowid,
        email,
        username: username || email.split("@")[0],
      },
    });
  } catch (error) {
    if (error.message.includes("UNIQUE")) {
      return res.status(400).json({ error: "El email ya está registrado" });
    }
    res.status(500).json({ error: "Error al crear usuario" });
  }
});

// Login
router.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;
  const db = req.app.locals.db;

  try {
    const stmt = db.prepare("SELECT * FROM users WHERE email = ?");
    const user = await stmt.get(email);

    if (!user) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      token,
      user: { id: user.id, email: user.email, username: user.username },
    });
  } catch (error) {
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
});

// ============ LISTA DE USUARIO ============

// Obtener la lista de animes del usuario
router.get("/user/anime", authenticateToken, async (req, res) => {
  const db = req.app.locals.db;
  const { status } = req.query;

  try {
    let query = `
            SELECT ua.*, a.title, a.cover_image, a.total_episodes, a.genres, a.rating as anime_rating
            FROM user_anime ua
            JOIN anime a ON ua.anime_id = a.id
            WHERE ua.user_id = ?
        `;
    const params = [req.user.id];

    if (status) {
      query += " AND ua.status = ?";
      params.push(status);
    }

    query += " ORDER BY ua.updated_at DESC";

    const stmt = db.prepare(query);
    const userAnimes = await stmt.all(...params);

    res.json(userAnimes);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener lista de animes" });
  }
});

// Agregar anime a la lista del usuario
router.post("/user/anime", authenticateToken, async (req, res) => {
  const db = req.app.locals.db;
  const { anime_id, status, current_episode, rating, notes } = req.body;

  try {
    const stmt = db.prepare(
      "INSERT INTO user_anime (user_id, anime_id, status, current_episode, rating, notes) VALUES (?, ?, ?, ?, ?, ?)"
    );
    const result = await stmt.run(
      req.user.id,
      anime_id,
      status || "plan_to_watch",
      current_episode || 0,
      rating,
      notes
    );

    res.status(201).json({
      message: "Anime agregado a tu lista",
      id: result.lastInsertRowid,
    });
  } catch (error) {
    if (error.message.includes("UNIQUE")) {
      return res.status(400).json({ error: "Este anime ya está en tu lista" });
    }
    res.status(500).json({ error: "Error al agregar anime" });
  }
});

// Actualizar anime en la lista del usuario
router.put("/user/anime/:id", authenticateToken, async (req, res) => {
  const db = req.app.locals.db;
  const { id } = req.params;
  const { status, current_episode, rating, notes } = req.body;

  try {
    const stmt = db.prepare(
      "UPDATE user_anime SET status = ?, current_episode = ?, rating = ?, notes = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?"
    );
    const result = await stmt.run(
      status,
      current_episode,
      rating,
      notes,
      id,
      req.user.id
    );

    if (result.changes === 0) {
      return res.status(404).json({ error: "Anime no encontrado en tu lista" });
    }

    res.json({ message: "Anime actualizado exitosamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar anime" });
  }
});

// Eliminar anime de la lista del usuario
router.delete("/user/anime/:id", authenticateToken, async (req, res) => {
  const db = req.app.locals.db;
  const { id } = req.params;

  try {
    const stmt = db.prepare(
      "DELETE FROM user_anime WHERE id = ? AND user_id = ?"
    );
    const result = await stmt.run(id, req.user.id);

    if (result.changes === 0) {
      return res.status(404).json({ error: "Anime no encontrado en tu lista" });
    }

    res.json({ message: "Anime eliminado de tu lista" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar anime" });
  }
});

// ============ JIKAN API (MyAnimeList) ============

// Buscar animes en Jikan API
router.get("/jikan/search", async (req, res) => {
  const { q, page = 1, limit = 25 } = req.query;

  try {
    const response = await fetch(
      `${JIKAN_API}/anime?q=${
        q || ""
      }&page=${page}&limit=${limit}&order_by=popularity&sort=asc`
    );
    const data = await response.json();

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Error al buscar animes en Jikan API" });
  }
});

// Obtener anime completo por ID de Jikan
router.get("/jikan/anime/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const response = await fetch(`${JIKAN_API}/anime/${id}/full`);
    const data = await response.json();

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener anime de Jikan API" });
  }
});

// Obtener animes populares/top
router.get("/jikan/top", async (req, res) => {
  const { page = 1, limit = 25 } = req.query;

  try {
    const response = await fetch(
      `${JIKAN_API}/top/anime?page=${page}&limit=${limit}`
    );
    const data = await response.json();

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener top animes de Jikan API" });
  }
});

// Obtener animes de la temporada actual
router.get("/jikan/season/now", async (req, res) => {
  const { page = 1 } = req.query;

  try {
    const response = await fetch(`${JIKAN_API}/seasons/now?page=${page}`);
    const data = await response.json();

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener animes de la temporada" });
  }
});

// Agregar anime de Jikan a la base de datos local
router.post("/jikan/import/:id", async (req, res) => {
  const { id } = req.params;
  const db = req.app.locals.db;

  try {
    // Obtener datos de Jikan
    const response = await fetch(`${JIKAN_API}/anime/${id}/full`);
    const jikanData = await response.json();

    if (!jikanData.data) {
      return res.status(404).json({ error: "Anime no encontrado en Jikan" });
    }

    const anime = jikanData.data;

    // Verificar si ya existe en la BD local
    const existingStmt = db.prepare("SELECT * FROM anime WHERE title = ?");
    const existing = await existingStmt.get(anime.title);

    if (existing) {
      return res.json({
        message: "Anime ya existe en la base de datos",
        id: existing.id,
        anime: existing,
      });
    }

    // Insertar en BD local
    const stmt = db.prepare(
      "INSERT INTO anime (title, description, cover_image, total_episodes, genres, rating) VALUES (?, ?, ?, ?, ?, ?)"
    );

    const genres = anime.genres?.map((g) => g.name).join(", ") || "";
    const result = await stmt.run(
      anime.title,
      anime.synopsis || "",
      anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url || "",
      anime.episodes || 0,
      genres,
      anime.score || 0
    );

    res.status(201).json({
      message: "Anime importado exitosamente",
      id: result.lastInsertRowid,
      jikan_id: anime.mal_id,
    });
  } catch (error) {
    console.error("Error importing anime:", error);
    res.status(500).json({ error: "Error al importar anime" });
  }
});

export default router;
