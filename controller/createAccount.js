const User = require("../models/user");
const bcrypt = require("bcrypt");
const { newMessage, clearMessage } = require("./../middleware/utils");
const {
  newMessage,
  clearMessage,
  existUser,
  getNumbers,
} = require("./../middleware/utils");

module.exports = async (req, res) => {
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
      if (req.path == "/createAccount") {
        res.render("createAccount", {
          validationErrors,
          validationSuccess,
        });
      }
      break;
    case "POST":
      if (req.path == "/createAccount") {
        let { fullName, phoneNumber, email, password, active = 1 } = req.body;
        // validationEmail = false;
        // resetPassword = false;

        if (existUser()) {
          newMessage("error", "El correo electrónico ya está en uso.", req);
          res.redirect("/login");
        }

        if (!fullName || !phoneNumber || !email || !password) {
          newMessage("error", "Ningún campo puede estar vacío.", req);
          res.redirect("/login");
        }
        const saltRounds = 10;
        bcrypt.hash(password, saltRounds, function (err, hash) {
          if (err) {
            Object.keys(err.errors).map((key) => {
              newMessage("error", err.errors[key].message, req);
            });

            newMessage("error", err.message, req);
            res.redirect("/login");
          }

          var new_user = new User({
            fullName: fullName,
            phoneNumber: phoneNumber,
            email: email,
            validationEmail: getNumbers(5),
            resetPassword: false,
            password: hash,
            active: true,
          });

          new_user
            .save()
            .then((result) => {
              newMessage("success", "¡Cuenta creada!", req);
              res.redirect("/login");
            })
            .catch((error) => {
              Object.keys(err.errors).map((key) => {
                newMessage("error", err.errors[key].message, req);
              });
              newMessage(
                "error",
                "No se pudo crear la cuenta, verifica tus datos o contactate con servicio técnico",
                req
              );
              res.redirect("/login");
            });
        });
      }
      break;

    default:
      break;
  }
};
