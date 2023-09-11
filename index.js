"use strict";
const express = require("express");
require("dotenv").config();
const ejs = require("ejs");
const initDB = require("./config/db");

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

app.listen(PORT);
console.log("Server running on port", PORT);
initDB();
app.use(express.json());

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

app.get("/", (req, res) => {
  const data = {
    title: "finacompanion",
    message: "¡Hola Mundo!",
  };
  res.render("login", data); // Renderiza la plantilla 'index.ejs' con los datos proporcionados
});

app.use((req, res) => {
  res.status(404).json({
    message: "endpoint not found",
  });
});
