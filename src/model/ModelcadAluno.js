import mongoose from "mongoose";

const CadAlunoSchema = new mongoose.Schema({

    nomeUsu: {
        type: String,
        required: true
    },
    nomeCom: {
        type: String,
        required: true
    },
    cpf: {
        type: String,
        required: true
    },
    idade: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    telefone: {
        type: String,
        required: false
    },
    senha: {
        type: String,
        required: true
    },
    sexo: {
        type: String,
        enum: ["MASC", "FEM"],
        required: true
    },
    status: {
        type: String,
        enum: ['A', 'C', 'S'],
        required: true
    },

    // FK: cada usuário pode ter um personal atribuído
    fk_personal: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CadPersonalSchema",
        required: false
    }

});

export default mongoose.model('CadAlunoSchema', CadAlunoSchema);