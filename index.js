// server.js
const express = require('express');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise'); // driver de MySQL con promesas
const app = express();
const port = 3000;

app.use(express.json());

// 🔑 Clave secreta (en producción debería estar en una variable de entorno)
const SECRET_KEY = "secreta_ucp_12345";

// 📦 Conexión a la BD MySQL
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Admin12345', 
  database: 'itemsnodebd', 
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Middleware para verificar el token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']; // formato: "Bearer <token>"
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: "Acceso denegado. Token requerido." });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Token inválido o expirado." });
    }
    req.user = user;
    next();
  });
}

// ---------- LOGIN ----------
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const [rows] = await pool.query(
      "SELECT id, username, password FROM users WHERE username = ? AND password = ?",
      [username, password]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const user = rows[0];

    const token = jwt.sign(
      { id: user.id, username: user.username },
      SECRET_KEY,
      { expiresIn: '1h' }
    );

    res.json({ token });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

// ---------- CRUD ITEMS (PROTEGIDO) ----------

// Obtener todos los items
app.get('/items', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM items");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener items" });
  }
});

// Obtener un item
app.get('/items/:id', authenticateToken, async (req, res) => {
  const id = req.params.id;
  try {
    const [rows] = await pool.query("SELECT * FROM items WHERE id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Item no encontrado" });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener item" });
  }
});

// Crear item
app.post('/items', authenticateToken, async (req, res) => {
  const { name, description } = req.body;
  try {
    const [result] = await pool.query(
      "INSERT INTO items (name, description) VALUES (?, ?)",
      [name, description]
    );
    res.status(201).json({ id: result.insertId, name, description });
  } catch (err) {
    res.status(500).json({ message: "Error al crear item" });
  }
});

// Actualizar item
app.put('/items/:id', authenticateToken, async (req, res) => {
  const id = req.params.id;
  const { name, description } = req.body;

  try {
    const [result] = await pool.query(
      "UPDATE items SET name = ?, description = ? WHERE id = ?",
      [name, description, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Item no encontrado" });
    }

    res.json({ id, name, description });
  } catch (err) {
    res.status(500).json({ message: "Error al actualizar item" });
  }
});

// Eliminar item
app.delete('/items/:id', authenticateToken, async (req, res) => {
  const id = req.params.id;

  try {
    const [result] = await pool.query("DELETE FROM items WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Item no encontrado" });
    }
    res.json({ message: "Item eliminado correctamente" });
  } catch (err) {
    res.status(500).json({ message: "Error al eliminar item" });
  }
});

// ---------- LEVANTAR SERVIDOR ----------
app.listen(port, () => {
  console.log(`Servidor seguro en http://localhost:${port}`);
});
