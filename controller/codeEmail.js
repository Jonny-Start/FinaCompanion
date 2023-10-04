const User = require("../models/user");
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
      if (req.path == "/codeEmail") {
        res.render("codeEmail", {
          validationErrors,
          validationSuccess,
        });
      }
      break;

    case "POST":
      if (req.path == "/codeEmail") {
        let { number_1, number_2, number_3, number_4, number_5 } = req.body;

        if (!number_1 || !number_2 || !number_3 || !number_4 || !number_5) {
          newMessage("error", "Ningún campo puede estar vacío.", req);
          return res.redirect("/codeEmail");
        }

        let numverValidate =
          number_1.toString() +
          number_2.toString() +
          number_3.toString() +
          number_4.toString() +
          number_5.toString();

        const dataUser = await User.findById(req.session.userID);
        if (dataUser.validationEmail != numverValidate) {
          newMessage("error", "El codigo ingresado es incorrecto", req);
          return res.redirect("/codeEmail");
        }

        await User.updateOne(
          { _id: req.session.userID },
          { validationEmail: null }
        )
          .then((success) => {
            req.session.validationEmail = null;
            newMessage("success", "Codigo correcto", req);
            return res.redirect("/home");
          })
          .catch((error) => {
            newMessage("error", error.message, req);
            return res.redirect("/codeEmail");
          });
      }
      break;

    default:
      break;
  }
};
