import express from 'express';
import {
  criarTreino,
  listarTreinosAluno,
  buscarTreino,
  desativarTreino,
  adicionarExercicio,
  reordenarExercicios
} from '../controllers/ControlTreino.js';

const router = express.Router();

router.post('/', criarTreino);
router.get('/aluno/:alunoId', listarTreinosAluno);
router.get('/:id', buscarTreino);
router.put('/:id/desativar', desativarTreino);
router.post('/:treinoId/exercicio', adicionarExercicio);
router.put('/:treinoId/reordenar', reordenarExercicios);

export default router;
