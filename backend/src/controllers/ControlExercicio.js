import Exercicio from '../model/ModelExercicio.js';
import mongoose from "mongoose";

// CREATE - cria um exercício vinculado ao personal
export async function criarExercicio(req, res) {
  try {
    // força publico false para garantir que exercícios de personal não sejam globais
    // e garante que o fk_personal seja tratado como ObjectId se válido
    const dados = { ...req.body, publico: false };
    
    if (dados.fk_personal && mongoose.Types.ObjectId.isValid(dados.fk_personal)) {
      dados.fk_personal = new mongoose.Types.ObjectId(dados.fk_personal);
    }

    const exercicio = await Exercicio.create(dados);
    return res.status(201).json(exercicio);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

// GET - inteligente (traz públicos + privados do personal)
export async function listarExercicios(req, res) {
  try {
    // pega o id de qualquer uma das fontes possíveis
    const personalId = req.params.personalId || req.query.fk_personal;

    let filtro = { publico: true };

    if (personalId) {
      // criamos um filtro que aceita o ID como ObjectId OU como String 
      // para evitar problemas de tipagem no banco
      const idsParaBuscar = [personalId];
      if (mongoose.Types.ObjectId.isValid(personalId)) {
        idsParaBuscar.push(new mongoose.Types.ObjectId(personalId));
      }

      filtro = {
        $or: [
          { publico: true },
          { fk_personal: { $in: idsParaBuscar } }
        ]
      };
    }

    // busca, ordena por nome e retorna
    const exercicios = await Exercicio.find(filtro).sort({ nome: 1 });
    
    // log para você ver no terminal do VS Code o que o banco achou
    console.log(`busca para personal ${personalId}: encontrou ${exercicios.length} itens`);

    res.json(exercicios);
  } catch (err) {
    console.error("erro ao listar exercícios:", err);
    res.status(500).json({ error: "erro ao listar exercícios" });
  }
}

// UPDATE
export async function atualizarExercicio(req, res) {
  try {
    const { id } = req.params;
    
    // impede edição de exercícios públicos por segurança
    const original = await Exercicio.findById(id);
    if (!original) {
      return res.status(404).json({ message: 'exercício não encontrado' });
    }
    
    if (original.publico) {
      return res.status(403).json({ message: 'exercícios públicos não podem ser editados' });
    }

    const exercicio = await Exercicio.findByIdAndUpdate(id, req.body, { new: true });
    res.json(exercicio);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// DELETE
export async function deletarExercicio(req, res) {
  try {
    const { id } = req.params;
    
    // opcional: impedir deletar exercícios públicos
    const original = await Exercicio.findById(id);
    if (original?.publico) {
      return res.status(403).json({ message: 'exercícios públicos não podem ser removidos' });
    }

    const exercicio = await Exercicio.findByIdAndDelete(id);

    if (!exercicio) {
      return res.status(404).json({ message: 'exercício não encontrado' });
    }

    res.status(204).send();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}