import express from "express";
import {
    criarAluno,
    listarAluno,
    listarAlunoPorId,
    atualizarAluno,
    excluirAluno
} from "../controllers/ControlcadAluno.js";

const router = express.Router();

router.post("/", criarAluno);
router.get("/", listarAluno);
router.get("/:id", listarAlunoPorId);
router.put("/:id", atualizarAluno);
router.delete("/:id", excluirAluno);

export default router;