import Exercicio from '../model/ModelExercicio.js';

// CREATE
export async function criarExercicio(req, res) {
  try {
    const exercicio = await Exercicio.create(req.body);
    res.status(201).json(exercicio);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// LIST
export async function listarExercicios(req, res) {
  const { personalId } = req.params;

  const exercicios = await Exercicio.find({
    status: 'A',
    $or: [
      { publico: true },
      { 'criadoPor.id': personalId }
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