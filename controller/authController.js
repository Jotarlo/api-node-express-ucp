const jwt = require('jsonwebtoken');
const sgMail = require('@sendgrid/mail');
const UserModel = require('../model/userModel');
require('dotenv').config();

const SECRET_KEY = process.env.SECRET_KEY;

const AuthController = {
  // 🔑 Login
  login: async (req, res) => {
    const { username, password } = req.body;

    try {
      const user = await UserModel.findByCredentials(username, password);

      if (!user) {
        return res.status(401).json({ message: "Credenciales inválidas" });
      }

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
  },

  // 📩 Recuperar contraseña
  recoverPassword: async (req, res) => {
    let sgApiKey = process.env.SENDGRID_API_KEY;
    sgMail.setApiKey(sgApiKey);
    console.log(sgApiKey);
    const { username } = req.body;
    console.log(username);
    try {
      const user = await UserModel.findByUsername(username);

      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      const resetToken = jwt.sign(
        { id: user.id, username: user.username },
        SECRET_KEY,
        { expiresIn: '15m' }
      );

      const resetLink = `${process.env.FRONTEND_URL}?token=${resetToken}`;

      const msg = {
        to: username, // asumimos que el username es email
        from: process.env.SENDGRID_FROM,
        subject: "Recuperación de contraseña",
        html: `
          <h3>Hola ${user.username},</h3>
          <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
          <a href="${resetLink}">${resetLink}</a>
          <p>Este enlace expira en 15 minutos.</p>
        `,
        mailSettings: {
            sandboxMode: {
            enable: process.env.SENDGRID_SANDBOX === "true" // activamos según .env
            }
        }
      };

      await sgMail.send(msg);

      res.json({ message: "Correo de recuperación enviado" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error al enviar correo de recuperación" });
    }
  },

  // 🔄 Resetear contraseña con token
  resetPassword: async (req, res) => {
    const { token, newPassword } = req.body;

    try {
      const decoded = jwt.verify(token, SECRET_KEY);
      const success = await UserModel.updatePassword(decoded.id, newPassword);

      if (!success) {
        return res.status(400).json({ message: "No se pudo actualizar la contraseña" });
      }

      res.json({ message: "Contraseña actualizada con éxito" });
    } catch (err) {
      console.error(err);
      res.status(403).json({ message: "Token inválido o expirado" });
    }
  }
};

module.exports = AuthController;
