import express from "express";
import {
    criarAluno,
    listarAluno,
    listarAlunoPorId,
    atualizarAluno,
    excluirAluno
} from "../controllers/ControlAluno.js";

const router = express.Router();

router.get("/", listarAluno);
router.post("/", criarAluno);
router.get("/:id", listarAlunoPorId);
router.put("/:id", atualizarAluno);
router.delete("/:id", excluirAluno);

export default router;
