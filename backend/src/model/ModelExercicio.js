import mongoose from "mongoose";

const ExercicioSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true
  },
  grupoMuscular: {
    type: String,
    required: true
  },
  descricao: {
    type: String
  },
  midia: {
    tipo: {
      type: String,
      enum: ["video", "imagem"]
    },
    key: {
      type: String
    }
  },
  fk_personal: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Personal',
    default: null
  },
  publico: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

export default mongoose.model('Exercicio', ExercicioSchema);