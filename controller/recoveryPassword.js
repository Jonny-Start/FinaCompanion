const User = require("../models/user");
require("dotenv").config();
const sgMail = require("@sendgrid/mail");

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
      if (req.path == "/recoveryPassword") {
        req.session.validationEmail = null;
        res.render("recoveryPassword", {
          validationErrors,
          validationSuccess,
        });
      }
      break;

    case "POST":
      if (req.path == "/recoveryPassword") {
        let { email } = req.body;
        if (!email) {
          newMessage("error", "Ningún campo puede estar vacío.", req);
          return res.redirect("/recoveryPassword");
        }

        if (await !existUser(email)) {
          newMessage(
            "error",
            `Por favor revisar la información ingresada: ${email}`,
            req
          );
          return res.redirect("/recoveryPassword");
        }

        const codeRecovery = getNumbers(7);
        await User.updateOne({ email: email }, { resetPassword: codeRecovery })
          .then((success) => {
            sgMail.setApiKey(process.env.SENDGRID_API_KEY);
            const msg = {
              to: email, // Quien lo recibe?
              from: "jonnyalejandro.ca0910@gmail.com", // Quien lo envia?
              subject: "Solicitud de cambio de contraseña", //Asunto
              //text: "este es el text",
              html:
                "Hola! este es el link para restablecer tu contraseña contraseña <a href='" +
                req.host +
                ":3000/resetPasword?codeRecovery=" +
                codeRecovery +
                "'>Esto es un correo desde la app</a>",
            };
            sgMail
              .send(msg)
              .then(() => {
                newMessage(
                  "success",
                  "Un link fue enviado a su correo electrónico para realizar la recuperación de cuenta. ",
                  req
                );
                return res.redirect("/recoveryPassword");
              })
              .catch((error) => {
                newMessage("error", error.message, req);
                return res.redirect("/recoveryPassword");
              });
          })
          .catch((error) => {
            newMessage("error", error.message, req);
            return res.redirect("/recoveryPassword");
          });
      }
      break;

    default:
      break;
  }
};
