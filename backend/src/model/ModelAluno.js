import mongoose from "mongoose";

const CadAlunoSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true
    },
    // Substituído idade (Number) por dataNascimento (Date)
    dataNascimento: {
        type: Date,
    },
    objetivo: {
        type: String,
    },
    whatsapp: {
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
        default: 'A'
    },
    // FK: cada aluno pertence a um personal
    fk_personal: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Personal",
        required: true
    }
}, { timestamps: true }); // Adicionado para controle de criação/atualização

export default mongoose.model('Aluno', CadAlunoSchema);