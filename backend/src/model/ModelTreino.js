import mongoose from "mongoose";

const TreinoExercicioSchema = new mongoose.Schema({
  fk_exercicio: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exercicio',
    required: true
  },
  series: { type: Number, required: true },
  repeticoes: { type: Number, required: true },
  carga: { type: String },        
  descanso: { type: String },     
  observacoes: { type: String },
  ordem: { type: Number, required: true, min: 1 }
}, { _id: false });

const TreinoSchema = new mongoose.Schema({

  nome: {
    type: String,
    required: true
  },

  objetivo: {
    type: String
  },

  observacoes: {
    type: String
  },

  fk_projeto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Projeto',
    required: true
  },

  // FK → Personal responsável pelo treino
  fk_personal: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Personal',
    required: true
  },

  ordem: {
    type: Number,
    required: true,
    min: 1
  },

  exercicios: {
    type: [TreinoExercicioSchema],
    default: []
  }

}, { timestamps: true });

TreinoSchema.index(
  { fk_projeto: 1, ordem: 1 },
  { unique: true }
);

export default mongoose.model('Treino', TreinoSchema);
