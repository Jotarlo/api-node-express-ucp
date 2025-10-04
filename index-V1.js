// server.js
const express = require('express');
const app = express();
const port = 3000;

// Middleware para parsear JSON en el body
app.use(express.json());

let items = [];

// listado de 20 items
for (let i = 1; i <= 20; i++) {
  items.push({ id: i, name: `Item ${i}`, description: `Descripción del item ${i}` });
}

// add main root route
app.get('/', (req, res) => {
  res.send('Bienvenido a la API de Items');
});

// Rutas CRUD

// Obtener todos los items (Read)
app.get('/items', (req, res) => {
  res.json(items);
});

// Obtener un item por id (Read)
app.get('/items/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const item = items.find(i => i.id === id);
  if (item) {
    res.json(item);
  } else {
    res.status(404).json({ message: "Item no encontrado" });
  }
});

// Crear un nuevo item (Create)
app.post('/items', (req, res) => {
  const { name, description } = req.body;
  const newItem = {
    id: items.length > 0 ? items[items.length - 1].id + 1 : 1,
    name,
    description
  };
  items.push(newItem);
  res.status(201).json(newItem);
});

// Actualizar un item por id (Update)
app.put('/items/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { name, description } = req.body;
  const itemIndex = items.findIndex(i => i.id === id);

  if (itemIndex !== -1) {
    items[itemIndex] = { id, name, description };
    res.json(items[itemIndex]);
  } else {
    res.status(404).json({ message: "Item no encontrado" });
  }
});

// Eliminar un item por id (Delete)
app.delete('/items/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const itemIndex = items.findIndex(i => i.id === id);

  if (itemIndex !== -1) {
    const deletedItem = items.splice(itemIndex, 1);
    res.json(deletedItem[0]);
  } else {
    res.status(404).json({ message: "Item no encontrado" });
  }
});

// Add patch method to update part of an item
app.patch('/items/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { name, description } = req.body;
  const item = items.find(i => i.id === id);

  if (item) {
    item.name = name !== undefined ? name : item.name;
    item.description = description !== undefined ? description : item.description;
    res.json(item);
  } else {
    res.status(404).json({ message: "Item no encontrado" });
  }
});

// Levantar servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
