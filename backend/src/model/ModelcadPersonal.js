import mongoose from "mongoose";

const CadPersonalSchema = new mongoose.Schema({

     nome: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    senha: {
        type: String,
        required: true
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

});

export default mongoose.model('CadPersonalSchema', CadPersonalSchema);