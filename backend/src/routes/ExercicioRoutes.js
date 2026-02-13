import express from "express";
import {
    criarExercicio,
    listarExercicios, // função unificada
    atualizarExercicio,
    deletarExercicio
} from "../controllers/ControlExercicio.js";

const router = express.Router();

router.post('/', criarExercicio);

// as duas rotas abaixo usam a mesma função listarExercicios
router.get('/', listarExercicios); 
router.get('/:personalId', listarExercicios);

router.put('/:id', atualizarExercicio);
router.delete('/:id', deletarExercicio);

export default router;