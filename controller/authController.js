const jwt = require('jsonwebtoken');
const UserModel = require('../model/userModel');
require('dotenv').config();

const SECRET_KEY = process.env.SECRET_KEY;

const AuthController = {
  login: async (req, res) => {
    const { username, password } = req.body;

    try {
      const [rows] = await UserModel.findByCredentials(username, password);
      if (rows.length === 0) return res.status(401).json({ message: "Credenciales inválidas" });

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
  }
};

module.exports = AuthController;
