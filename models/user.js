const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    fullName: { type: String, required: true }, //Nombre completo
    phoneNumber: { type: Number, required: true }, //Numero de telefono
    email: { type: String, required: true, unique: true }, // Correo electronico
    validationEmail: { type: Boolean, required: true, default: false }, // Correo electronico validado
    resetPassword: { type: Number, required: false }, // Codigo se solicitud de recuperar contraseña
    password: { type: String, required: true }, // Contraseña
    active: { type: Boolean, required: true }, // Usuario activo True or False
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
const User = mongoose.model("User", userSchema);

module.exports = User;

// dateAdd: { type: Date, required: true, default: Date.now },
// dateUpdate: { type: Date, required: true, default: Date.now },
