import Treino from '../model/ModelTreino.js';
import Projeto from '../model/ModelProjeto.js';

export async function criarTreino(req, res) {
  try {
    const {
      nome,
      objetivo,
      observacoes,
      fk_projeto,
      fk_personal,
      ordem
    } = req.body;

    if (!nome || !fk_projeto || !fk_personal || !ordem) {
      return res.status(400).json({
        erro: 'Campos obrigatórios não informados'
      });
    }

    // 🔒 Valida se projeto existe
    const projeto = await Projeto.findById(fk_projeto);
    if (!projeto) {
      return res.status(404).json({ erro: 'Projeto não encontrado' });
    }

    if (['CONCLUIDO', 'CANCELADO'].includes(projeto.status)) {
      return res.status(400).json({
        erro: 'Não é possível criar treino para projeto finalizado'
      });
    }

    const treino = await Treino.create({
      nome,
      objetivo,
      observacoes,
      fk_projeto,
      fk_personal,
      ordem
    });

    res.status(201).json(treino);

  } catch (err) {
    // Trata erro de índice único (ordem duplicada)
    if (err.code === 11000) {
      return res.status(400).json({
        erro: 'Já existe um treino com essa ordem neste projeto'
      });
    }

    res.status(500).json({ erro: err.message });
  }
}

export async function listarTreinosPorProjeto(req, res) {
  try {
    const { projetoId } = req.params;

    const treinos = await Treino.find({
      fk_projeto: projetoId
    })
      .sort({ ordem: 1 });

    res.json(treinos);

  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
}

export async function buscarTreino(req, res) {
  try {
    const { id } = req.params;

    const treino = await Treino.findById(id)
      .populate('exercicios.fk_exercicio');

    if (!treino) {
      return res.status(404).json({
        erro: 'Treino não encontrado'
      });
    }

    // Ordena exercícios
    treino.exercicios.sort((a, b) => a.ordem - b.ordem);

    res.json(treino);

  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
}

export async function editarTreino(req, res) {
  try {
    const { treinoId } = req.params;
    const dados = req.body;
    const projeto = await Projeto.findById(treino.fk_projeto);

    const treino = await Treino.findById(treinoId);
    if (!treino) {
      return res.status(404).json({
        erro: 'Treino não encontrado'
      });
    }

    if (['CONCLUIDO', 'CANCELADO'].includes(projeto.status)) {
      return res.status(400).json({
        erro: 'Não é possível alterar treinos de um projeto concluído ou cancelado'
      });
    }

    // Campos permitidos
    const camposPermitidos = [
      'nome',
      'objetivo',
      'observacoes',
      'ordem'
    ];

    camposPermitidos.forEach(campo => {
      if (campo in dados) {
        treino[campo] = dados[campo];
      }
    });

    await treino.save();

    res.json({
      mensagem: 'Treino atualizado com sucesso',
      treino
    });

  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({
        erro: 'Já existe um treino com essa ordem neste projeto'
      });
    }

    res.status(500).json({ erro: err.message });
  }
}

export async function deletarTreino(req, res) {
  try {
    const { treinoId } = req.params;

    const treino = await Treino.findById(treinoId);
    if (!treino) {
      return res.status(404).json({
        erro: 'Treino não encontrado'
      });
    }

    await Treino.findByIdAndDelete(treinoId);

    res.json({
      mensagem: 'Treino deletado com sucesso'
    });

  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
}

export async function adicionarExercicio(req, res) {
  try {
    const { treinoId } = req.params;
    const {
      exercicioId,
      series,
      repeticoes,
      carga,
      descanso,
      observacoes
    } = req.body;

    if (!exercicioId || !series || !repeticoes) {
      return res.status(400).json({
        erro: 'Campos obrigatórios não informados'
      });
    }

    const treino = await Treino.findById(treinoId);
    if (!treino) {
      return res.status(404).json({
        erro: 'Treino não encontrado'
      });
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

  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
}

export async function reordenarExercicios(req, res) {
  try {
    const { treinoId } = req.params;
    const { exercicios } = req.body;

    if (!Array.isArray(exercicios)) {
      return res.status(400).json({
        erro: 'Formato inválido'
      });
    }

    const treino = await Treino.findById(treinoId);
    if (!treino) {
      return res.status(404).json({
        erro: 'Treino não encontrado'
      });
    }

    treino.exercicios = exercicios;
    await treino.save();

    res.json({
      mensagem: 'Exercícios reordenados com sucesso',
      treino
    });

  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
}
