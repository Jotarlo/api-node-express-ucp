const pool = require('./dbConnection/db');

const ItemModel = {
  getAll: () => pool.query("SELECT * FROM items"),
  getById: (id) => pool.query("SELECT * FROM items WHERE id = ?", [id]),
  create: (name, description) =>
    pool.query("INSERT INTO items (name, description) VALUES (?, ?)", [name, description]),
  update: (id, name, description) =>
    pool.query("UPDATE items SET name = ?, description = ? WHERE id = ?", [name, description, id]),
  delete: (id) => pool.query("DELETE FROM items WHERE id = ?", [id])
};

module.exports = ItemModel;
