const pool = require('./dbConnection/db');

const UserModel = {
  // 🔑 Login
  findByCredentials: async (username, password) => {
    const [rows] = await pool.query(
      "SELECT id, username, password FROM users WHERE username = ? AND password = ?",
      [username, password]
    );
    return rows.length > 0 ? rows[0] : null;
  },

  // 🔍 Buscar por username (para recuperación)
  findByUsername: async (username) => {
    const [rows] = await pool.query(
      "SELECT id, username FROM users WHERE username = ?",
      [username]
    );
    return rows.length > 0 ? rows[0] : null;
  },

  // 🔄 Cambiar contraseña
  updatePassword: async (userId, newPassword) => {
    const [result] = await pool.query(
      "UPDATE users SET password = ? WHERE id = ?",
      [newPassword, userId]
    );
    return result.affectedRows > 0;
  }
};

module.exports = UserModel;
