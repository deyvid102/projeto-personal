import express from 'express';
import {
  criarExercicio,
  listarExercicios,
  atualizarExercicio,
  deletarExercicio
} from '../controllers/ControlExecicio.js';

const router = express.Router();

router.post('/', criarExercicio);
router.get('/:personalId', listarExercicios);
router.put('/:id', atualizarExercicio);
router.delete('/:id', deletarExercicio);

export default router;
