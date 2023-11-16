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
const existUser = async (email) => {
  return (respon = !!(await User.findOne({ email: email })));
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

//Crear String con la fecha de hoy
const months = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];
const getDateToday = () => {
  const fecha = new Date();
  const dia = fecha.getDate();
  const mes = months[fecha.getMonth()];
  const año = fecha.getFullYear();

  return `${dia} de ${mes} del ${año}`;
};

//Agregar ceros antes de cada numero si es menor igual a 9
const addZeroForward = (numero) => {
  return numero < 10 ? `0${numero}` : numero;
};

//Extraer hora exacta
const getCurrentTime = () => {
  const fecha = new Date();

  const horas = addZeroForward(fecha.getHours());
  const minutos = addZeroForward(fecha.getMinutes());

  // const periodo = horas >= 12 ? "PM" : "AM";
  // // Convertir a formato de 12 horas
  // horas = horas % 12 || 12;

  return `${horas}:${minutos}`;
};

//formatear fecha
const formatDate = (fecha) => {
  const opciones = { day: "2-digit", month: "2-digit", year: "numeric" };
  const fechaFormateada = new Date(fecha).toLocaleDateString("es-CO", opciones);
  return fechaFormateada;
};

//formatear fecha con letras
const formatDateLetters = (fecha) => {
  const fechaFormateada = new Date(fecha);

  const dia = fechaFormateada.getDate();
  const mes = months[fechaFormateada.getMonth()];
  const año = fechaFormateada.getFullYear();

  return `${dia} de ${mes} del ${año}`;
};

module.exports = {
  newMessage,
  clearMessage,
  existUser,
  getNumbers,
  getDateToday,
  getCurrentTime,
  formatDate,
  formatDateLetters,
};

// const obtenerFechaHoraBogota = () => {
//   const fecha = new Date();
//   // Configurar el formato de fecha y hora para el huso horario de Bogotá
//   const opciones = {
//     timeZone: 'America/Bogota',
//     year: 'numeric',
//     month: 'long',
//     day: 'numeric',
//     hour: 'numeric',
//     minute: 'numeric',
//     second: 'numeric',
//     hour12: true,
//   };
//   const formatoFechaHora = new Intl.DateTimeFormat('es-CO', opciones);
//   return formatoFechaHora.format(fecha);
// };
// const fechaHoraBogota = obtenerFechaHoraBogota();
// console.log("Fecha y hora en Bogotá:", fechaHoraBogota);
