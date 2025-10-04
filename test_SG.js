require('dotenv').config();
const sgMail = require('@sendgrid/mail');

console.log("API KEY inicio:", process.env.SENDGRID_API_KEY?.substring(0,10));

sgMail.setApiKey(process.env.SENDGRID_API_KEY.trim());

const msg = {
  to: "destinatario@ejemplo.com",
  from: process.env.SENDGRID_FROM,
  subject: "Prueba SendGrid desde Node",
  text: "Hola mundo con SendGrid",
  html: "<strong>Hola mundo con SendGrid</strong>",
  mailSettings: {
    sandboxMode: {
      enable: true   // 👈 activa sandbox
    }
  }
};

sgMail
  .send(msg)
  .then(() => console.log("✅ Correo enviado (o simulado en sandbox)."))
  .catch((error) => {
    console.error("❌ Error en envío:", error.response ? error.response.body : error);
  });
