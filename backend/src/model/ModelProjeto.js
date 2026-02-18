import mongoose from "mongoose";

const ProjetoSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true
    },
    objetivo: {
        type: String
    },
    descricao: {
        type: String
    },
    status: {
        type: String,
        enum: ['R', 'AG', 'A', 'F', 'C'], 
        default: 'R'
    },
    fk_aluno: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Aluno',
        required: true
    },
    fk_personal: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Personal',
        required: true
    },
    data_inicio: {
        type: Date,
        default: Date.now
    },
    data_fim: {
        type: Date,
        required: true
    }
}, { timestamps: true });

export default mongoose.model('Projeto', ProjetoSchema);