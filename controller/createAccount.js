const User = require("../models/user");
const bcrypt = require("bcrypt");
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
      if (req.path == "/createAccount") {
        res.render("createAccount", {
          validationErrors,
          validationSuccess,
        });
      }
      break;
    case "POST":
      if (req.path == "/createAccount") {
        let {
          fullName,
          phoneNumber,
          email,
          password,
          active = 1,
          gender = "female",
        } = req.body;
        // validationEmail = false;
        // resetPassword = false;

        if (await existUser(email)) {
          newMessage("error", "El correo electrónico ya está en uso.", req);
          return res.redirect("/createAccount");
        }

        if (!fullName || !phoneNumber || !email || !password) {
          newMessage("error", "Ningún campo puede estar vacío.", req);
          return res.redirect("/createAccount");
        }
        const saltRounds = 10;
        bcrypt.hash(password, saltRounds, function (err, hash) {
          if (err) {
            Object.keys(err.errors).map((key) => {
              newMessage("error", err.errors[key].message, req);
            });

            newMessage("error", err.message, req);
            return res.redirect("/createAccount");
          }

          const numberValidate = getNumbers(5);

          var new_user = new User({
            fullName: fullName,
            phoneNumber: phoneNumber,
            email: email,
            validationEmail: numberValidate,
            resetPassword: false,
            password: hash,
            active: true,
          });

          new_user
            .save()
            .then((result) => {
              sgMail.setApiKey(process.env.SENDGRID_API_KEY);
              const msg = {
                to: email, // Quien lo recibe?
                from: "jonnyalejandro.ca0910@gmail.com", // Quien lo envia?
                subject: "Codigo de verificación FinaCompanion", //Asunto
                //text: "este es el text",
                html:
                  "Hola, <br /> gracias por inscribirte a nuestra plataforma, para poder continuar necesitaras este codigo <br /> <br /> <strong style='font-size: 2em'>" +
                  numberValidate +
                  "</strong>",
              };
              sgMail
                .send(msg)
                .then(() => {
                  newMessage(
                    "success",
                    "¡Cuenta creada!, Ahora intenta ingresar con tus credenciales",
                    req
                  );
                  return res.redirect("/login");
                })
                .catch((error) => {
                  newMessage("error", error.message, req);
                  return res.redirect("/createAccount");
                });
            })
            .catch((error) => {
              newMessage("error", `${error.errmsg}`, req);
              newMessage(
                "error",
                "No se pudo crear la cuenta, verifica tus datos o contactate con servicio técnico",
                req
              );
              return res.redirect("/createAccount");
            });
        });
      }
      break;

    default:
      break;
  }
};
