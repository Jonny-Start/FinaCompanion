const User = require("../models/user");
const bcrypt = require("bcrypt");
const { newMessage, clearMessage } = require("./../middleware/utils");

module.exports = async (req, res) => {
  // Si se ha enviado un error de otra vista mediante el req

  let validationErrors = [];
  let validationSuccess = [];
  req.session.message &&
    (req.session.message.error &&
      (validationErrors = [...req.session.message.error]),
    req.session.message.success &&
      (validationSuccess = [...req.session.message.success]),
    clearMessage(req));

  const TypeRequest = req.method.toUpperCase();

  switch (TypeRequest) {
    case "GET":
      if (req.path == "/login" || req.path == "/") {
        res.render("login", {
          validationErrors,
          validationSuccess,
        });

        // req.session.idUser
      }
      break;

    case "POST":
      if (req.path == "/login") {
        let { email, password } = req.body;

        User.findOne({ email: email }).then((user) => {
          if (user) {
            if (!user.password) {
              newMessage(
                "error",
                "El campo contraseña tiene que estar lleno",
                req
              );
              return res.redirect("/login");
            }

            bcrypt.compare(password, user.password, (error, same) => {
              if (error) {
                Object.keys(error.errors).map((key) => {
                  newMessage("error", error.errors[key].message, req);
                });

                return res.redirect("/login");
              } else if (same) {
                // if passwords match
                // store user session, will talk about it later
                req.session.userId = user._id;
                console.log(req.session);

                return res.redirect("/Home");
              } else {
                newMessage("error", "Credenciales incorrectas", req);
                return res.redirect("/login");
              }
            });
          } else {
            newMessage("error", "Credenciales incorrectas", req);
            return res.redirect("/login");
          }
        });
      }
      break;

    default:
      res.redirect("/login");
      break;
  }
};
