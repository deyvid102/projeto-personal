import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import CadPersonal from "./model/cadPersonal.js";

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

//CREATE
app.post("/personal", async (req,res) => {
    try {
        const novoCadPersonal = await CadPersonal.create(req.body);
        res.json(novoCadPersonal);
    } catch (error) {
        res.json({ error : error });
    }
});

//READ
app.get('/personal', async (req, res) => {
    try {
        const getPersonal = await CadPersonal.find();
        res.json(getPersonal);
    } catch (error) {
        res.json({ error : error });
    }
});

//UPDATE
app.put('/personal/:id', async (req,res) => {
    try {
        const alteraCadPersonal = await CadPersonal.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(alteraCadPersonal);
    } catch (error) {
        res.json({ error : error });
    }
});

//DELETE
app.delete('/personal/:id', async (req,res) => {
    try {
        const excluiCadPersonal = await CadPersonal.findByIdAndDelete(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(excluiCadPersonal);
    } catch (error) {
        res.json({ error : error });
    }
});

app.listen(PORT, () => console.log(`O servidor está rodando na porta ${PORT}`));
