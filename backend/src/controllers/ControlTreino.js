import Treino from '../model/ModelTreino.js';

export async function criarTreino(req, res) {
  try {
    const treino = await Treino.create(req.body);
    res.status(201).json(treino);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function listarTreinosAluno(req, res) {
  const { alunoId } = req.params;

  const treinos = await Treino.find({
    fk_aluno: alunoId,
    status: 'A'
  }).sort({ createdAt: -1 });

  res.json(treinos);
}

export async function buscarTreino(req, res) {
  const { id } = req.params;

  const treino = await Treino.findById(id)
    .populate('exercicios.fk_exercicio');

  if (!treino) {
    return res.status(404).json({ message: 'Treino não encontrado' });
  }

  // 🔽 Ordena exercícios
  treino.exercicios.sort((a, b) => a.ordem - b.ordem);

  res.json(treino);
}

export async function desativarTreino(req, res) {
  const { id } = req.params;

  const treino = await Treino.findByIdAndUpdate(
    id,
    { status: 'I' },
    { new: true }
  );

  if (!treino) {
    return res.status(404).json({ message: 'Treino não encontrado' });
  }

  res.json(treino);
}

export async function adicionarExercicio(req, res) {
  const { treinoId } = req.params;
  const {
    exercicioId,
    series,
    repeticoes,
    carga,
    descanso,
    observacoes
  } = req.body;

  const treino = await Treino.findById(treinoId);
  if (!treino) {
    return res.status(404).json({ message: 'Treino não encontrado' });
  }

  treino.exercicios.push({
    fk_exercicio: exercicioId,
    series: Number(series),
    repeticoes: Number(repeticoes),
    carga: carga || null,        
    descanso: descanso || null,  
    observacoes,
    ordem: treino.exercicios.length + 1
  });

  await treino.save();

  const treinoAtualizado = await Treino.findById(treinoId)
    .populate('exercicios.fk_exercicio');

  res.json(treinoAtualizado);
}

export async function reordenarExercicios(req, res) {
  const { treinoId } = req.params;
  const { exercicios } = req.body;

  const treino = await Treino.findById(treinoId);
  if (!treino) {
    return res.status(404).json({ message: 'Treino não encontrado' });
  }

  treino.exercicios = exercicios;
  await treino.save();

  res.json(treino);
}
