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
      if (req.path == "/dataUpdate") {
        res.render("dataupdate", {
          validationErrors,
          validationSuccess
        });
      }
      break;

    default:
      break;
  }
};
