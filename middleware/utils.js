// Crear nuevo mensaje
const newMessage = (type, messagePush, req) => {
  req.session.message ? "" : clearMessage(req);

  switch (type) {
    case "error":
      req.session.message.error
        ? req.session.message.error.push(messagePush)
        : (req.session.message.error = [messagePush]);

      break;
    case "success":
      req.session.message.success
        ? req.session.message.success.push(messagePush)
        : (req.session.message.success = [messagePush]);

      break;
    default:
      req.session.message.info.push(message);
      break;
  }
  return;
};

// limpiar el arreglo de mensajes
const clearMessage = (req) => {
  return (req.session.message = { error: [], success: [] });
};

// Verificar si existe un usuario mediante email
const User = require("../models/user");
const existUser = (email) => {
  User.findOne({ email: email }).then((user) => {
    return !!email;
  });
};

//Crear cadena de numeros aleatoreos
function getNumbers(longitud) {
  let cadena = "";

  for (let i = 0; i < longitud; i++) {
    const numeroAleatorio = Math.floor(Math.random() * 10); // Genera un número aleatorio entre 0 y 9
    cadena += numeroAleatorio;
  }

  return cadena;
}

module.exports = { newMessage, clearMessage, existUser, getNumbers };
