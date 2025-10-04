const express = require('express');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const itemRoutes = require('./routes/itemRoutes');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Rutas
app.use('/auth', authRoutes);
app.use('/items', itemRoutes);

app.listen(port, () => {
  console.log(`Servidor seguro en http://localhost:${port}`);
});
