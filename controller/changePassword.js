const User = require("../models/user");
const bcrypt = require("bcrypt");
const History = require("../models/history");
require("dotenv").config();
const sgMail = require("@sendgrid/mail");

const { newMessage, clearMessage } = require("./../middleware/utils");

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
      if (req.path == "/changePassword") {
        res.render("changePassword", {
          validationErrors,
          validationSuccess,
          dataUser: req.session.contextUser,
        });
      }
      break;
    case "POST":
      if (req.path == "/changePassword") {
        let { passwordCurrent, password } = req.body;

        if (!password) {
          newMessage("error", "Ningún campo puede estar vacío.", req);
          return res.redirect("/changePassword");
        }

        const user = await User.findById(req.session.userID);

        bcrypt.compare(passwordCurrent, user.password, (error, same) => {
          if (error) {
            Object.keys(error.errors).map((key) => {
              newMessage("error", error.errors[key].message, req);
            });

            return res.redirect("/changePassword");
          } else if (same) {
            // Si las cointraseñas son las mismas, se crea una nueva
            const saltRounds = 10;
            bcrypt.hash(password, saltRounds, async (err, hash) => {
              if (err) {
                Object.keys(err.errors).map((key) => {
                  newMessage("error", err.errors[key].message, req);
                });
                newMessage("error", err.message, req);
                return res.redirect("/createAccount");
              }
              // Nueva contraseña
              let passwordNew = hash;

              // Actualización de contraseña
              await User.updateOne(
                { _id: req.session.userID },
                { password: passwordNew }
              )
                .then(async (success) => {
                  // Se crea el registro historico
                  await History.create({
                    user_id: req.session.userID,
                    author_id: req.session.userID,
                    bill_id: null,
                    description: "Contraseña actualizada",
                  });

                  // Se envia correo electronico informativo de actialización
                  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                  const msg = {
                    to: user.email, // Quien lo recibe?
                    from: "jonnyalejandro.ca0910@gmail.com", // Quien lo envia?
                    subject: "Cambio de contraseña FinaCompanion", //Asunto
                    //text: "este es el text",
                    html: "<p>Se acaba de realizar el cambio de contraseña de tu cuenta de FinaCompanion</p>",
                  };
                  sgMail
                    .send(msg)
                    .then(() => {
                      newMessage("success", "Contraseña actualizada", req);
                      return res.redirect("/changePassword");
                    })
                    .catch((error) => {
                      newMessage("error", error.message, req);
                      return res.redirect("/changePassword");
                    });
                })
                .catch((error) => {
                  newMessage("error", error.message, req);
                  return res.redirect("/changePassword");
                });
            });
          } else {
            newMessage("error", "Contraseñas incorrectas", req);
            return res.redirect("/changePassword");
          }
        });
      }
      break;

    default:
      break;
  }
};
