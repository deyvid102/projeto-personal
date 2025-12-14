import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import CadPersonalRoutes from "./routes/CadPersonalRoutes.js";
import CadAlunoRoutes from "./routes/CadAlunoRoutes.js"

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Conectado ao mongoDB');
    } catch (error) {
        console.log('ERRO ao conectar com mongoDB', error);
    }
};

connectDB();

app.use("/personal", CadPersonalRoutes);
app.use("/aluno", CadAlunoRoutes);

app.listen(PORT, () => {
    console.log(`O servidor está rodando na porta ${PORT}`);
});
