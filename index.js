"use strict";
const express = require("express");
require("dotenv").config();
const ejs = require("ejs");
const initDB = require("./config/db");
const session = require("express-session");
const { verifySession } = require("./middleware/verificationSession");

const PORT = process.env.PORT || 3000;
const app = express();

/*
 * ***********
 * *Settings**
 * ***********
 */

// Configurar EJS como motor de plantillas
app.set("view engine", "ejs");
app.set("views", __dirname + "/views"); // Directorio donde se encuentran tus plantillas
app.use("/public", express.static("public")); // Dejar fija la ruta de la carpeta

// Correr express en un puerto
app.listen(PORT);
console.log("Server running on port", PORT);
initDB();
app.use(express.json());

// Configura express-session

// Si resave es false, se ahorra un poco de rendimiento al no guardar la sesión en cada solicitud, a menos que se modifique explícitamente.
// Si saveUninitialized es true, se crearán sesiones para todos los visitantes, incluso si aún no han interactuado con la aplicación.
app.use(
  session({
    secret: "A2b7R9sC1dP5eF3gdskAqQ45L97", // Cambia esto por una cadena segura y secreta
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false, // Cambia a true si estás utilizando HTTPS
      // maxAge: 24 * 60 * 60 * 1000, // Tiempo de vida de la cookie en milisegundos (1 día en este ejemplo)
      maxAge: 2147483647,
    },
  })
);

/*
 * **************
 * *Middlewares**
 * **************
 */

// Middleware para permitir CORS
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  //res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

//Esta linea me sirve para enviar datos del form en el body
app.use(express.urlencoded({ extended: true }));

/*
 * ***********
 * *Routes**
 * ***********
 */
// app.use(users);
// app.use(auth);

// app.get("/hola", (req, res) => {
//   res.send("Hola mundo, estoy viviooo");
// });

app.get("/closeSession", (req, res) => {
  req.session.destroy((err) => {
    res.redirect("/"); // will always fire after session is destroyed
  });
});

const changePassword = require("./controller/changePassword");
app.get("/changePassword", verifySession, changePassword);
app.post("/changePassword", verifySession, changePassword);

const codeEmail = require("./controller/codeEmail");
app.get("/codeEmail", verifySession, codeEmail);
app.post("/codeEmail", verifySession, codeEmail);

const contact = require("./controller/contact");
app.get("/contact", verifySession, contact);
app.post("/contact", verifySession, contact);

const createAccount = require("./controller/createAccount");
app.get("/createAccount", verifySession, createAccount);
app.post("/createAccount", verifySession, createAccount);

const dataUpdate = require("./controller/dataUpdate");
app.get("/dataUpdate", verifySession, dataUpdate);
app.post("/dataUpdate", verifySession, dataUpdate);

const debts = require("./controller/debts");
app.get("/debts", verifySession, debts);
app.post("/debts", verifySession, debts);

const deleteAccount = require("./controller/deleteAccount");
app.get("/deleteAccount", verifySession, deleteAccount);
app.post("/deleteAccount", verifySession, deleteAccount);

const home = require("./controller/home");
app.get("/home", verifySession, home);

const login = require("./controller/login");
app.get("/login", verifySession, login);
app.post("/login", verifySession, login);
app.get("/", verifySession, login);
app.post("/", verifySession, login);

const movements = require("./controller/movements");
app.get("/movements", verifySession, movements);
app.post("/movements", verifySession, movements);

const recoveryPassword = require("./controller/recoveryPassword");
app.get("/recoveryPassword", verifySession, recoveryPassword);
app.post("/recoveryPassword", verifySession, recoveryPassword);

// app.get("/", (req, res) => {
//   const data = {
//     title: "finacompanion",
//     message: "¡Hola Mundo!",
//   };
//   res.render("login", data); // Renderiza la plantilla 'index.ejs' con los datos proporcionados
// });

app.get("/email", (req, res) => {
  const sgMail = require("@sendgrid/mail");
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: "jonnyalejandro.ca0910@gmail.com", // Quien lo recibe?
    from: "jonnyalejandro.ca0910@gmail.com", // Quien lo envia?
    subject: "Este es un correo de saludo", //Asunto
    //text: "este es el text",
    html: "<strong>Esto es un correo desde la app</strong>",
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
      res.send("Correo enviado");
    })
    .catch((error) => {
      console.error(error);
      res.send("No se pudo enviar el correo");
    });
});

app.use((req, res) => {
  // res.status(404).json({
  //   message: "endpoint not found",
  // });
  res.render("404");
});
