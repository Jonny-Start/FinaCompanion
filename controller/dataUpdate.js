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
        const allDataUser = await User.findById(req.session.userID);

        res.render("dataupdate", {
          validationErrors,
          validationSuccess,
          dataUser: req.session.contextUser,
          allDataUser,
        });
      }
      break;

    case "POST":
      if (req.path == "/dataUpdate") {
        const allDataUser = await User.findById(req.session.userID);

        let { fullName, phoneNumber } = req.body;
        let nickName = req.body.nickName
          ? req.body.nickName
          : allDataUser.nickName;
        let gender = req.body.gender ? req.body.gender : allDataUser.gender;

        if (!fullName || !phoneNumber) {
          newMessage(
            "error",
            "El campo nombre, numero telefonico o email no pueden estar vacíos.",
            req
          );
          return res.redirect("/dataUpdate");
        }

        await User.findByIdAndUpdate(req.session.userID, {
          fullName: fullName,
          phoneNumber: phoneNumber,
          nickName: nickName,
          gender: gender,
        })
          .then((user) => {
            newMessage("success", "Datos actualizados correctamente", req);

            req.session.contextUser = {
              nickName: nickName
                ? nickName
                : user.nickName
                ? user.nickName
                : user.fullName,
              gender: gender ? gender : user.gender,
            };

            return res.redirect("/dataUpdate");
          })
          .catch((error) => {
            newMessage("error", error.message, req);
            return res.redirect("/dataUpdate");
          });
      }
      break;

    default:
      break;
  }
};
