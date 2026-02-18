import Treino from '../model/ModelTreino.js';
import Projeto from '../model/ModelProjeto.js';

export async function criarTreino(req, res) {
  try {
    const { nome, objetivo, observacoes, fk_projeto, fk_personal, dia_semana } = req.body;
    if (!nome || !fk_projeto || !fk_personal || !dia_semana) {
      return res.status(400).json({ erro: 'Campos obrigatórios não informados' });
    }
    const projeto = await Projeto.findById(fk_projeto);
    if (!projeto) return res.status(404).json({ erro: 'Projeto não encontrado' });

    const treino = await Treino.create({
      nome, objetivo, observacoes, fk_projeto, fk_personal, dia_semana, status: 'A'
    });
    res.status(201).json(treino);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
}

export async function listarTreinosPorProjeto(req, res) {
  try {
    const { projetoId } = req.params;
    const treinos = await Treino.find({ fk_projeto: projetoId });
    res.json(treinos);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
}

export async function buscarTreino(req, res) {
  try {
    const { id } = req.params;
    const treino = await Treino.findById(id).populate('exercicios.fk_exercicio');
    if (!treino) return res.status(404).json({ erro: 'Treino não encontrado' });
    if (treino.exercicios) {
      treino.exercicios.sort((a, b) => (a.ordem || 0) - (b.ordem || 0));
    }
    res.json(treino);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
}

export async function editarTreino(req, res) {
  try {
    const { treinoId } = req.params;
    const dados = req.body;
    const treino = await Treino.findById(treinoId);
    if (!treino) return res.status(404).json({ erro: 'Treino não encontrado' });

    const camposPermitidos = ['nome', 'objetivo', 'observacoes', 'dia_semana', 'status'];
    camposPermitidos.forEach(campo => {
      if (campo in dados) treino[campo] = dados[campo];
    });

    await treino.save();
    res.json({ mensagem: 'Treino atualizado', treino });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
}

export async function deletarTreino(req, res) {
  try {
    const { treinoId } = req.params;
    const treino = await Treino.findByIdAndDelete(treinoId);
    if (!treino) return res.status(404).json({ erro: 'Treino não encontrado' });
    res.json({ mensagem: 'Treino deletado com sucesso' });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
}

export async function adicionarExercicio(req, res) {
  try {
    const { treinoId } = req.params;
    const { exercicioId, series, repeticoes, carga, descanso, observacoes } = req.body;
    const treino = await Treino.findById(treinoId);
    if (!treino) return res.status(404).json({ erro: 'Treino não encontrado' });

    treino.exercicios.push({
      fk_exercicio: exercicioId,
      series: Number(series),
      repeticoes: Number(repeticoes),
      carga, descanso, observacoes,
      ordem: treino.exercicios.length + 1
    });

    await treino.save();
    const t = await Treino.findById(treinoId).populate('exercicios.fk_exercicio');
    res.json(t);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
}

export async function editarExercicioNoTreino(req, res) {
  try {
    const { treinoId, exercicioRelId } = req.params;
    const { exercicioId, series, repeticoes, carga, descanso, observacoes } = req.body;

    const treino = await Treino.findById(treinoId);
    if (!treino) return res.status(404).json({ erro: 'Treino não encontrado' });

    const item = treino.exercicios.id(exercicioRelId);
    if (!item) return res.status(404).json({ erro: 'Relação não encontrada' });

    item.fk_exercicio = exercicioId;
    item.series = Number(series);
    item.repeticoes = Number(repeticoes);
    item.carga = carga;
    item.descanso = descanso;
    item.observacoes = observacoes;

    await treino.save();
    const t = await Treino.findById(treinoId).populate('exercicios.fk_exercicio');
    res.json(t);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
}

export async function removerExercicio(req, res) {
  try {
    const { treinoId, exercicioRelId } = req.params;
    const treino = await Treino.findById(treinoId);
    if (!treino) return res.status(404).json({ erro: 'Treino não encontrado' });

    treino.exercicios.pull({ _id: exercicioRelId });
    await treino.save();
    const t = await Treino.findById(treinoId).populate('exercicios.fk_exercicio');
    res.json(t);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
}

export async function reordenarExercicios(req, res) {
  try {
    const { treinoId } = req.params;
    const { exercicios } = req.body;
    const treino = await Treino.findById(treinoId);
    if (!treino) return res.status(404).json({ erro: 'Treino não encontrado' });
    treino.exercicios = exercicios;
    await treino.save();
    res.json({ mensagem: 'Exercícios reordenados', treino });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
}