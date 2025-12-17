import express from "express";
import {
    criarPersonal,
    listarPersonal,
    listarPersonalPorId,
    atualizarPersonal,
    excluirPersonal
} from "../controllers/ControlPersonal.js";

const router = express.Router();

router.post("/", criarPersonal);
router.get("/", listarPersonal);
router.get("/:id", listarPersonalPorId);
router.put("/:id", atualizarPersonal);
router.delete("/:id", excluirPersonal);

export default router;