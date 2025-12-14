import mongoose from "mongoose";

const CadPersonalSchema = new mongoose.Schema({

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

});

export default mongoose.model('CadPersonalSchema', CadPersonalSchema);