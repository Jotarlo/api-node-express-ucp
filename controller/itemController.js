const ItemModel = require('../model/itemModel');

const ItemController = {
  getAll: async (req, res) => {
    try {
      const [rows] = await ItemModel.getAll();
      res.json(rows);
    } catch (err) {
      res.status(500).json({ message: "Error al obtener items" });
    }
  },

  getById: async (req, res) => {
    try {
      const [rows] = await ItemModel.getById(req.params.id);
      if (rows.length === 0) return res.status(404).json({ message: "Item no encontrado" });
      res.json(rows[0]);
    } catch (err) {
      res.status(500).json({ message: "Error al obtener item" });
    }
  },

  create: async (req, res) => {
    const { name, description } = req.body;
    try {
      const [result] = await ItemModel.create(name, description);
      res.status(201).json({ id: result.insertId, name, description });
    } catch (err) {
      res.status(500).json({ message: "Error al crear item" });
    }
  },

  update: async (req, res) => {
    const { name, description } = req.body;
    const { id } = req.params;
    try {
      const [result] = await ItemModel.update(id, name, description);
      if (result.affectedRows === 0) return res.status(404).json({ message: "Item no encontrado" });
      res.json({ id, name, description });
    } catch (err) {
      res.status(500).json({ message: "Error al actualizar item" });
    }
  },

  delete: async (req, res) => {
    const { id } = req.params;
    try {
      const [result] = await ItemModel.delete(id);
      if (result.affectedRows === 0) return res.status(404).json({ message: "Item no encontrado" });
      res.json({ message: "Item eliminado correctamente" });
    } catch (err) {
      res.status(500).json({ message: "Error al eliminar item" });
    }
  }
};

module.exports = ItemController;
