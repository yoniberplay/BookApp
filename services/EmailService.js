const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  secure: false,
  port: 587,
  auth: {
    user: "yoniber.encarnacion@gmail.com",
    pass: "fcguazasbsxxmwtm",
  },
  tls:{
    rejectUnauthorized: false,
  }
});

module.exports = transporter;