import Exercicio from '../model/ModelExercicio.js';
import mongoose from "mongoose";

// CREATE
export async function criarExercicio(req, res) {
  try {
    // força publico false para garantir que exercícios de personal não sejam globais
    const dados = { ...req.body, publico: false };
    const exercicio = await Exercicio.create(dados);
    return res.status(201).json(exercicio);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

// GET - inteligente (suporta /exercicios e /exercicios/:personalId)
export async function listarExercicios(req, res) {
  try {
    // tenta pegar o id tanto do parâmetro da rota quanto da query (?fk_personal=...)
    const personalId = req.params.personalId || req.query.fk_personal;

    let filtro = { publico: true };

    if (personalId && mongoose.Types.ObjectId.isValid(personalId)) {
      filtro = {
        $or: [
          { publico: true },
          { fk_personal: new mongoose.Types.ObjectId(personalId) }
        ]
      };
    }

    const exercicios = await Exercicio.find(filtro).sort({ nome: 1 });
    res.json(exercicios);
  } catch (err) {
    res.status(500).json({ error: "erro ao listar exercícios" });
  }
}

// UPDATE
export async function atualizarExercicio(req, res) {
  try {
    const { id } = req.params;
    
    // impede edição de exercícios públicos por segurança
    const original = await Exercicio.findById(id);
    if (original?.publico) {
      return res.status(403).json({ message: 'exercícios públicos não podem ser editados' });
    }

    const exercicio = await Exercicio.findByIdAndUpdate(id, req.body, { new: true });

    if (!exercicio) {
      return res.status(404).json({ message: 'exercício não encontrado' });
    }

    res.json(exercicio);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// DELETE
export async function deletarExercicio(req, res) {
  try {
    const { id } = req.params;
    const exercicio = await Exercicio.findByIdAndDelete(id);

    if (!exercicio) {
      return res.status(404).json({ message: 'exercício não encontrado' });
    }

    res.status(204).send();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}