const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const billSchema = new Schema(
  {
    contact_id: { type: Number, required: false, default: 0 }, //Id del contacto al que se le asigno el movimiento de cuenta, 0 a si mismo
    user_id: { type: Number, required: true }, // Id del usuario al que le pertenece el movimiento
    how_much: { type: Number, required: true }, //Cuanto dinero
    how_often: { type: Date, required: false }, // Cada cuanto tienes que pagar o cobrar
    increase_percentage: { type: Number, required: false }, // Porcenta de incremento
    description: { Type: String, required: false }, // descripción del registro
    base: { Type: String, required: false }, // Cual es el valor del prestamo o de la deuda sin costos extras de tasa de interes
    date_Expiry: { type: Date, required: false }, // en que fecha finaliza esta deuda o este ingreso
    group_id: { type: Date, required: false }, // Id del grupo al que pertenece o a la carpeta a al que pertenece
    name_icono: { Type: String, required: false }, // Nombre del icono para el diseño de la tarjeta
    type_bill: { type: Number, required: true }, // Tipo de registro, Ingreso = 1 o Egreso = 2
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
const Bill = mongoose.model("Bill", billSchema);

module.exports = Bill;

// dateAdd: { type: Date, required: true, default: Date.now },
// dateUpdate: { type: Date, required: true, default: Date.now },
