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

  // Mídia fica pronta para o futuro (opcional)
  midia: {
    tipo: {
      type: String,
      enum: ["video", "imagem"]
    },
    key: {
      type: String
    }
  },

  // Dono do exercício (NULL = público/admin)
  fk_personal: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Personal',
    default: null
  },

  // Só ADMIN pode marcar como público
  publico: {
    type: Boolean,
    default: false
  }
  
  // Quem criou o exercício (admin ou personal)
  // criadoPor: {
  //   tipo: {
  //     type: String,
  //     enum: ["admin", "personal"],
  //     required: true
  //   },
  //   id: {
  //     type: mongoose.Schema.Types.ObjectId,
  //     required: true
  //   }
  // }

}, { timestamps: true });

export default mongoose.model('Exercicio', ExercicioSchema);
