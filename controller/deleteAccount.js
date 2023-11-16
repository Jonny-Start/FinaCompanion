const User = require("../models/user");
const { newMessage, clearMessage } = require("./../middleware/utils");
const bcrypt = require("bcrypt");

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
      if (req.path == "/deleteAccount") {
        res.render("deleteAccount", {
          validationErrors,
          validationSuccess,
          dataUser: req.session.contextUser,
        });
      }
      break;
    case "POST":
      if (req.path == "/deleteAccount") {
        let { password } = req.body;
        if (!password) {
          newMessage("error", "El campo contraseña no puede estar vació,", req);
          return res.redirect("/recoveryPassword");
        }

        User.findById(req.session.userID).then((user) => {
          if (user) {
            bcrypt.compare(password, user.password, (error, same) => {
              if (error) {
                Object.keys(error.errors).map((key) => {
                  newMessage("error", error.errors[key].message, req);
                });

                newMessage(
                  "error",
                  "Hubo un error en la comparación de las contraseñas.",
                  req
                );

                return res.redirect("/deleteAccount");
              } else if (same) {
                User.findByIdAndDelete(req.session.userID)
                  .then((user) => {
                    console.log("Eliminacion de cuenta");
                    newMessage(
                      "success",
                      "Cuenta eliminada correctamente.",
                      req
                    );
                    return res.redirect("/closeSession");
                  })
                  .catch((error) => {
                    Object.keys(error.errors).map((key) => {
                      newMessage("error", error.errors[key].message, req);
                    });
                    newMessage(
                      "error",
                      "Ocurrió un problema en la eliminación de la cuenta",
                      req
                    );
                  });
              } else {
                newMessage("error", "Escribe nuevamente la contraseña", req);
                return res.redirect("/deleteAccount");
              }
            });
          } else {
            newMessage("error", "Errror al identificar usuario con ID", req);
            return res.redirect("/login");
          }
        });
      }
      break;

    default:
      break;
  }
};
