import express from "express";
import {
    criarPersonal,
    listarPersonal,
    atualizarPersonal,
    excluirPersonal
} from "../controllers/ControlcadPersonal.js";

const router = express.Router();

router.post("/", criarPersonal);
router.get("/", listarPersonal);
router.put("/:id", atualizarPersonal);
router.delete("/:id", excluirPersonal);

export default router;