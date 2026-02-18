import express from 'express';
import {
  criarTreino,
  listarTreinosPorProjeto,
  buscarTreino,
  deletarTreino,
  editarTreino,
  adicionarExercicio,
  reordenarExercicios,
  editarExercicioNoTreino, // Adicionado
  removerExercicio         // Adicionado
} from '../controllers/ControlTreino.js';

const router = express.Router();

router.post('/', criarTreino);
router.post('/:treinoId/exercicios', adicionarExercicio);
router.get('/projeto/:projetoId', listarTreinosPorProjeto);
router.get('/:id', buscarTreino);

// Rotas específicas para manipulação de itens do array de exercícios
router.put('/:treinoId/exercicios/reordenar', reordenarExercicios);
router.put('/:treinoId/exercicios/:exercicioRelId', editarExercicioNoTreino); // Rota que faltava
router.delete('/:treinoId/exercicios/:exercicioRelId', removerExercicio);     // Rota de deleção

router.put('/:treinoId', editarTreino);
router.delete('/:treinoId', deletarTreino);

export default router;