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
}, { _id: true }); // Alterado para true para permitir edição individual

const TreinoSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true
  },
  observacoes: {
    type: String
  },
  status: {
    type: String,
    enum: ['R', 'AG', 'A', 'F', 'C'],
    default: 'A'
  },
  fk_projeto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Projeto',
    required: true
  },
  fk_personal: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Personal',
    required: true
  },
  dia_semana: {
    type: [String], 
    required: true,
    enum: ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB']
  },
  exercicios: {
    type: [TreinoExercicioSchema],
    default: []
  }
}, { timestamps: true });

export default mongoose.model('Treino', TreinoSchema);