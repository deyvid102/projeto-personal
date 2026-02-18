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

// criação e busca
router.post("/", criarProjeto);
router.get('/:projetoId', buscarProjeto); // alterado de :id para :projetoId para manter o padrão

// listagens
router.get("/aluno/:alunoId", listarProjetosPorAluno);
router.get('/personal/:personalId', listarProjetosPorPersonal);

// atualizações de dados e estados (status)
router.put('/:projetoId', editarProjeto);
router.patch('/:projetoId/ativar', ativarProjeto);
router.patch('/:projetoId/reativar', reativarProjeto);
router.patch('/:projetoId/concluir', concluirProjeto);
router.patch('/:projetoId/cancelar', cancelarProjeto);

// exclusão
router.delete('/:projetoId', deletarProjeto);

export default router;