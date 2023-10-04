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

        if (!email || !password) {
          newMessage("error", "Ningún campo puede estar vacío.", req);
          return res.redirect("/login");
        }

        User.findOne({ email: email }).then((user) => {
          if (user) {
            bcrypt.compare(password, user.password, (error, same) => {
              if (error) {
                Object.keys(error.errors).map((key) => {
                  newMessage("error", error.errors[key].message, req);
                });

                return res.redirect("/login");
              } else if (same) {
                // if passwords match
                // store user session, will talk about it later
                req.session.userID = user.id;

                if (user.validationEmail) {
                  req.session.validationEmail = user.validationEmail;
                }

                console.log(req.session);

                return res.redirect("/home");
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
