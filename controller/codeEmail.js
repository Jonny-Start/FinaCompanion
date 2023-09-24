const User = require("../models/user");

module.exports = async (req, res) => {
  let validacionErrors = [];
  let validacionSuccess = [];

  const TypeRequest = req.method.toUpperCase();

  switch (TypeRequest) {
    case "GET":
      if (req.path == "/codeEmail") {
        res.render("codeEmail");
      }
      break;

    default:
      break;
  }
};
