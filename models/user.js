const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    fullName: { type: String, required: true },
    phoneNumber: { type: Number, required: true },
    email: { type: String, required: true, unique: true },
    validationEmail: { type: Boolean, required: true, default: false },
    password: { type: String, required: true },
    active: { type: Boolean, required: true },
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
