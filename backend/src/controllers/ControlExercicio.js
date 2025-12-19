import Exercicio from '../model/ModelExercicio.js';

// CREATE
export async function criarExercicio(req, res) {
  try {
    const exercicio = await Exercicio.create(req.body);
    return res.status(201).json(exercicio);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

// GET
export async function listarExerciciosPublicos(req, res) {
  const exercicios = await Exercicio.find({
    publico: true 
  }).sort({ nome: 1 });

  res.json(exercicios);
}

//GET
export async function listarExerciciosDoPersonal(req, res) {
  const { personalId } = req.params;

  const exercicios = await Exercicio.find({
    $or: [
      { publico: true },
      { fk_personal: personalId }
    ]
  }).sort({ nome: 1 });

  res.json(exercicios);
}

//UPDATE
export async function atualizarExercicio(req, res) {
  const { id } = req.params;

  const exercicio = await Exercicio.findByIdAndUpdate(
    id,
    req.body,
    { new: true }
  );

  if (!exercicio) {
    return res.status(404).json({ message: 'Exercício não encontrado' });
  }

  res.json(exercicio);
}

//DELETE
export async function deletarExercicio(req, res) {
  const { id } = req.params;

  const exercicio = await Exercicio.findByIdAndDelete(id);

  if (!exercicio) {
    return res.status(404).json({ message: 'Exercício não encontrado' });
  }

  res.status(204).send();
}