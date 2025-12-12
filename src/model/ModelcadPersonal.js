import mongoose from "mongoose";

const CadPersonalSchema = new mongoose.Schema({

    nomeUsu: String,
    nomeCom: String,
    cpf: String,
    email: String,
    telefone: String,
    senha: String,
});

export default mongoose.model('CadPersonalSchema', CadPersonalSchema);