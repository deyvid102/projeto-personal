import express from "express";
import upload from "../middlewares/upload.js";
import { criarExercicio, listarExercicios, atualizarExercicio, deletarExercicio } from "../controllers/ControlExercicio.js";

const router = express.Router();

router.post('/', upload.single("file"), criarExercicio);

// as duas rotas abaixo usam a mesma função listarExercicios
router.get('/', listarExercicios); 
router.get('/:personalId', listarExercicios);

router.put('/:id', atualizarExercicio);
router.delete('/:id', deletarExercicio);

export default router;