const User = require("../models/user");
const History = require("../models/history");
const {
  newMessage,
  clearMessage,
  formatDate,
  formatDateLetters,
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

  const userID = req.session.userID;

  switch (TypeRequest) {
    case "GET":
      if (req.path == "/movements") {
        let dataHistory = [];
        await History.find({ user_id: userID })
          .sort({ createdAt: -1 }) //1
          .then((data) => {
            dataHistory = data;
          })
          .catch((error) => {
            newMessage("error", error.message, req);
            return res.redirect("/home");
          });

        res.render("movements", {
          validationErrors,
          validationSuccess,
          dataUser: req.session.contextUser,
          dataHistory,
          formatDate,
          formatDateLetters,
        });
      }
      break;

    default:
      break;
  }
};
