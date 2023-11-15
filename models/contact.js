const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const contactSchema = new Schema(
  {
    user_id: { type: Number, required: true }, // Id del usuario al que le pertenece el movimiento
    fullName: { type: String, required: true }, //Nombre completo del contacto
    phoneNumber: { type: Number, required: false }, //Numero de telefono del contacto
    email: { type: String, required: false, default: null }, // Correo electronico del contacto
    address: { type: String, require: false, default: null }, // direccion fisica de el contacto
    gender: { type: String, required: false, default: null }, // Genero de el contacto
    description: { Type: String, required: true }, // Descripcion del contacto
  },
  {
    //El timestamps crea fecha de actualización y fecha de creación automáticamente
    timestamps: true,
    //MongoDB crea un registro de versión de los datos por cada registro, con este comando se desactivan
    versionKey: false,
  }
);

/**
 * Creamos modelo
 */
const Contact = mongoose.model("Contact", contactSchema);

module.exports = Contact;
