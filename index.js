// server.js
const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
const port = 3000;

app.use(express.json());

// 🔑 Clave secreta (en producción debería estar en una variable de entorno)
const SECRET_KEY = "secreta_ucp_12345";

// Simulación de usuarios registrados
const users = [
  { id: 1, username: "admin", password: "1234" },
  { id: 2, username: "user", password: "abcd" }
];

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

// Login → devuelve un token
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).json({ message: "Credenciales inválidas" });
  }

  const token = jwt.sign(
    { id: user.id, username: user.username },
    SECRET_KEY,
    { expiresIn: '1h' } // El token expira en 1 hora
  );
  console.log(token);
  res.json({ token });
});

// ------- CRUD protegido -------

// Base de datos en memoria
let items = [
  { id: 1, name: "Item 1", description: "Primer item" },
  { id: 2, name: "Item 2", description: "Segundo item" }
];

// Obtener todos los items (requiere token)
app.get('/items', authenticateToken, (req, res) => {
  res.json(items);
});

// Obtener un item
app.get('/items/:id', authenticateToken, (req, res) => {
  const id = parseInt(req.params.id);
  const item = items.find(i => i.id === id);
  item ? res.json(item) : res.status(404).json({ message: "Item no encontrado" });
});

// Crear item
app.post('/items', authenticateToken, (req, res) => {
  const { name, description } = req.body;
  const newItem = {
    id: items.length > 0 ? items[items.length - 1].id + 1 : 1,
    name,
    description
  };
  items.push(newItem);
  res.status(201).json(newItem);
});

// Actualizar item
app.put('/items/:id', authenticateToken, (req, res) => {
  const id = parseInt(req.params.id);
  const { name, description } = req.body;
  const index = items.findIndex(i => i.id === id);

  if (index !== -1) {
    items[index] = { id, name, description };
    res.json(items[index]);
  } else {
    res.status(404).json({ message: "Item no encontrado" });
  }
});

// Eliminar item
app.delete('/items/:id', authenticateToken, (req, res) => {
  const id = parseInt(req.params.id);
  const index = items.findIndex(i => i.id === id);

  if (index !== -1) {
    const deletedItem = items.splice(index, 1);
    res.json(deletedItem[0]);
  } else {
    res.status(404).json({ message: "Item no encontrado" });
  }
});

// Levantar servidor
app.listen(port, () => {
  console.log(`Servidor seguro en http://localhost:${port}`);
});
