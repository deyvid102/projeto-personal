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
        enum: ["M", "F"],
        default: ""
    },
    status: {
        type: String,
        enum: ['A', 'C', 'S'],
    },
    // FK: cada usuário pode ter um personal atribuído
    fk_personal: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CadPersonalSchema",
    }

});

export default mongoose.model('CadAlunoSchema', CadAlunoSchema);