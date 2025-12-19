import express from "express";
import {
    criarExercicio,
    listarExerciciosPublicos,
    listarExerciciosDoPersonal,
    atualizarExercicio,
    deletarExercicio
} from "../controllers/ControlExercicio.js";

const router = express.Router();

router.post('/', criarExercicio);
router.get('/', listarExerciciosPublicos);
router.get('/:personalId', listarExerciciosDoPersonal);
router.put('/:id', atualizarExercicio);
router.delete('/:id', deletarExercicio);

export default router;
