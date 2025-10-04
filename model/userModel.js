const pool = require('./dbConnection/db');

const UserModel = {
  findByCredentials: (username, password) =>
    pool.query("SELECT id, username, password FROM users WHERE username = ? AND password = ?", [username, password])
};

module.exports = UserModel;
