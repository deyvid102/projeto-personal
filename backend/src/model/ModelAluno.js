import mongoose from "mongoose";

const CadAlunoSchema = new mongoose.Schema({

    nome: {
        type: String,
        required: true
    },
    idade: {
        type: Number,
    },
    objetivo: {
        type: String,
    },

    sexo: {
        type: String,
        enum: ["M", "F", ""],
        default: ""
    },
    status: {
        type: String,
        enum: ['A', 'C', 'S'],
    },
    // FK: cada usuário pode ter um personal atribuído
    fk_personal: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Personal",
    }

});

export default mongoose.model('Aluno', CadAlunoSchema);

// const AlunoSchema = new mongoose.Schema({
//   usuarioId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Usuario",
//     required: true,
//     unique: true
//   },

//   idade: {
//     type: Number
//   },

//   objetivo: {
//     type: String
//   },

//   sexo: {
//     type: String,
//     enum: ["M", "F"]
//   },

//   fk_personal: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Personal",
//     required: true
//   },

//   status: {
//     type: String,
//     enum: ["A", "C", "S"],
//     default: "A"
//   }

// }, { timestamps: true });

// export default mongoose.model("Aluno", AlunoSchema);
