const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const historySchema = new Schema(
  {
    user_id: { type: Number, required: true }, // Id del usuario al que le pertenece el movimiento
    id_author: { type: Number, required: true }, // Id del autor al que pertenece el historico
    id_bill: { type: Number, required: false }, // Id de la cuenta a la que pertenece el historico
    description: { Type: String, required: true }, // Descripcion del historico
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
const History = mongoose.model("History", historySchema);

module.exports = History;

