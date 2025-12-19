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
  ordem: { type: Number, required: true }
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

  status: {
    type: String,
    enum: ['A', 'I', 'S'], // Ativo, Inativo, Suspenso
    default: 'A'
  },

  // FK → Personal responsável pelo treino
  fk_personal: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Personal',
    required: true
  },

  // FK → Aluno dono do treino
  fk_aluno: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Aluno',
    required: true
  },

  // Datas ajudam MUITO depois
  data_inicio: {
    type: Date,
    default: Date.now
  },

  data_fim: {
    type: Date
  },

  exercicios: {
    type: [TreinoExercicioSchema],
    default: []
  }

}, { timestamps: true });

export default mongoose.model('Treino', TreinoSchema);
