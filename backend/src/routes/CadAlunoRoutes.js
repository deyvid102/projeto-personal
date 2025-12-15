import express from "express";
import {
    criarAluno,
    listarAluno,
    listarAlunoPorId,
    atualizarAluno,
    excluirAluno
} from "../controllers/ControlcadAluno.js";

const router = express.Router();

// GET principal
router.get("/", listarAluno);

// POST
router.post("/", criarAluno);

// GET por ID
router.get("/:id", listarAlunoPorId);

// PUT
router.put("/:id", atualizarAluno);

// DELETE
router.delete("/:id", excluirAluno);

export default router;
