import express from 'express';
import {
  criarTreino,
  listarTreinosPorProjeto,
  buscarTreino,
  deletarTreino,
  editarTreino,
  adicionarExercicio,
  reordenarExercicios
} from '../controllers/ControlTreino.js';

const router = express.Router();

router.post('/', criarTreino);
router.post('/:treinoId/exercicios', adicionarExercicio);
router.get('/projeto/:projetoId', listarTreinosPorProjeto);
router.get('/:id', buscarTreino);
router.put('/:treinoId/exercicios/reordenar', reordenarExercicios);
router.put('/:treinoId', editarTreino);
router.delete('/:treinoId', deletarTreino);

export default router;
