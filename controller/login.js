const User = require("../models/user");

module.exports = async (req, res) => {
  let validacionErrors = [];
  let validacionSuccess = [];

  const TypeRequest = req.method.toUpperCase();

  switch (TypeRequest) {
    case "GET":
      if (req.path == "/login" || req.path == "/") {
        res.render("login", {
          title: "finacompanion",
          message: "¡Hola Angel!",
        }); // Renderiza la plantilla 'index.ejs' con los datos proporcionados
      }
      break;

    default:
      break;
  }
};
