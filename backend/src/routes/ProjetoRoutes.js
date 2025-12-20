import express from "express";
import { 
  criarProjeto,
  ativarProjeto,
  reativarProjeto,
  editarProjeto,
  cancelarProjeto,
  concluirProjeto,
  deletarProjeto,
  listarProjetosPorAluno,
  listarProjetosPorPersonal,
  buscarProjeto
} from "../controllers/ControlProjeto.js";

const router = express.Router();

router.post("/", criarProjeto);
router.get('/:id', buscarProjeto);
router.get("/aluno/:alunoId", listarProjetosPorAluno);
router.get('/personal/:personalId', listarProjetosPorPersonal);
router.put('/:projetoId', editarProjeto);
router.patch('/:projetoId/ativar', ativarProjeto);
router.patch('/:projetoId/reativar', reativarProjeto);
router.patch('/:projetoId/concluir', concluirProjeto);
router.patch('/:projetoId/cancelar', cancelarProjeto);
router.delete('/:projetoId', deletarProjeto);

export default router;