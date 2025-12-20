import Projeto from '../model/ModelProjeto.js'
import Treino from '../model/ModelTreino.js'

export async function criarProjeto(req, res) {
    try {
    const {
      nome,
      descricao,
      objetivo,
      fk_aluno,
      fk_personal,
      data_inicio,
      data_fim
    } = req.body;

    if (!nome || !objetivo || !fk_aluno || !fk_personal || !data_fim) {
      return res.status(400).json({ erro: 'Campos obrigatórios não informados' });
    }

    let status = 'RASCUNHO';

    if (data_inicio && new Date(data_inicio) > new Date()) {
        status = 'AGENDADO';
    }

    const projeto = await Projeto.create({
      nome,
      descricao,
      objetivo,
      fk_aluno,
      fk_personal,
      data_inicio,
      data_fim,
      status
    });

    res.status(201).json(projeto);

  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
}

export async function buscarProjeto(req, res) {
  try {
    const { id } = req.params;

    const projeto = await Projeto.findById(id);
    if (!projeto) {
      return res.status(404).json({ erro: 'Projeto não encontrado' });
    }

    const treinos = await Treino
      .find({ fk_projeto: id })
      .sort({ ordem:1 })

    res.json({projeto, treinos});

  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
}

export async function listarProjetosPorAluno(req, res) {
  try {
    const { alunoId } = req.params;

    const projetos = await Projeto.find({ fk_aluno: alunoId })
      .sort({ createdAt: -1 });

    res.json(projetos);

  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
}

export async function listarProjetosPorPersonal(req, res) {
  try {
    const { personalId } = req.params;

    const projetos = await Projeto.find({ fk_personal: personalId })
      .sort({ createdAt: -1 });

    res.json(projetos);

  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
}

export async function editarProjeto(req, res) {
  try {
    const { projetoId } = req.params;
    const dados = req.body;

    const projeto = await Projeto.findById(projetoId);
    if (!projeto) {
      return res.status(404).json({ erro: 'Projeto não encontrado' });
    }

    const agora = new Date();

    if (projeto.status === 'ATIVO') {
      const camposBloqueados = ['nome', 'objetivo', 'descricao', 'data_inicio'];
      for (const campo of camposBloqueados) {
        if (campo in dados) {
          return res.status(400).json({
            erro: `Projeto ativo não permite alterar ${campo}`
          });
        }
      }
    }

    if (projeto.status === 'CONCLUIDO') {
      // pode editar datas e textos
      if (dados.data_inicio && new Date(dados.data_inicio) > agora) {
        projeto.status = 'AGENDADO';
      }
    }

    if (projeto.status === 'CANCELADO') {
      // edição livre
      if (dados.reativar === true) {
        projeto.status = dados.data_inicio && new Date(dados.data_inicio) > agora
          ? 'AGENDADO'
          : 'ATIVO';
      }
    }

    /* ============================
       APLICA ALTERAÇÕES
    ============================ */

    Object.keys(dados).forEach(campo => {
      if (campo !== 'reativar') {
        projeto[campo] = dados[campo];
      }
    });

    await projeto.save();

    res.json({
      mensagem: 'Projeto atualizado com sucesso',
      projeto
    });

  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
}

export async function cancelarProjeto(req, res) {
  try {
    const { projetoId } = req.params;

    const projeto = await Projeto.findById(projetoId);
    if (!projeto) {
      return res.status(404).json({ erro: 'Projeto não encontrado' });
    }

    if (projeto.status === 'CONCLUIDO') {
      return res.status(400).json({
        erro: 'Projeto concluído não pode ser cancelado'
      });
    }

    projeto.status = 'CANCELADO';
    await projeto.save();

    res.json({
      mensagem: 'Projeto cancelado com sucesso',
      projeto
    });

  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
}


export async function ativarProjeto(req, res) {
  try {
    const { projetoId } = req.params;

    const projeto = await Projeto.findById(projetoId);
    if (!projeto) {
      return res.status(404).json({ erro: 'Projeto não encontrado' });
    }

    if (['CONCLUIDO', 'CANCELADO'].includes(projeto.status)) {
      return res.status(400).json({ erro: 'Projeto não pode ser ativado' });
    }

    if (projeto.data_inicio && new Date(projeto.data_inicio) > new Date()) {
      return res.status(400).json({ erro: 'Projeto ainda não pode ser iniciado' });
    }

    // 🔐 Regra: só 1 projeto ativo por aluno
    const projetoAtivo = await Projeto.findOne({
      fk_aluno: projeto.fk_aluno,
      status: 'ATIVO'
    });

    if (projetoAtivo) {
      return res.status(400).json({
        erro: 'Aluno já possui um projeto ativo'
      });
    }

    projeto.status = 'ATIVO';

    // Se ativou antes da data, ajusta data_inicio
    if (!projeto.data_inicio || projeto.data_inicio > new Date()) {
      projeto.data_inicio = new Date();
    }

    await projeto.save();

    res.json({ mensagem: 'Projeto ativado com sucesso', projeto });

  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
}

export async function reativarProjeto(req, res) {
  try {
    const { projetoId } = req.params;

    const projeto = await Projeto.findById(projetoId);
    if (!projeto) {
      return res.status(404).json({ erro: 'Projeto não encontrado' });
    }

    if (!['CANCELADO', 'CONCLUIDO'].includes(projeto.status)) {
      return res.status(400).json({
        erro: 'Projeto não pode ser reativado'
      });
    }

    // 🔐 Regra: apenas 1 projeto ativo por aluno
    const projetoAtivo = await Projeto.findOne({
      fk_aluno: projeto.fk_aluno,
      status: 'ATIVO'
    });

    if (projetoAtivo) {
      return res.status(400).json({
        erro: 'Aluno já possui um projeto ativo'
      });
    }

    const agora = new Date();

    projeto.status =
      projeto.data_inicio && new Date(projeto.data_inicio) > agora
        ? 'AGENDADO'
        : 'ATIVO';

    await projeto.save();

    res.json({
      mensagem: 'Projeto reativado com sucesso',
      projeto
    });

  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
}

export async function concluirProjeto(req, res) {
  try {
    const { projetoId } = req.params;

    const projeto = await Projeto.findById(projetoId);
    if (!projeto) {
      return res.status(404).json({ erro: 'Projeto não encontrado' });
    }

    if (projeto.status === 'CONCLUIDO') {
      return res.status(400).json({ erro: 'Projeto já concluído' });
    }

    projeto.status = 'CONCLUIDO';

    // Ajusta data_fim se concluir antes
    if (!projeto.data_fim || projeto.data_fim > new Date()) {
      projeto.data_fim = new Date();
    }

    await projeto.save();

    res.json({ mensagem: 'Projeto concluído com sucesso', projeto });

  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
}

export async function deletarProjeto(req, res) {
  try {
    const { projetoId } = req.params;

    const projeto = await Projeto.findById(projetoId);
    if (!projeto) {
      return res.status(404).json({ erro: 'Projeto não encontrado' });
    }

    if (['ATIVO', 'CONCLUIDO'].includes(projeto.status)) {
      return res.status(400).json({
        erro: 'Projeto ativo ou concluído não pode ser deletado'
      });
    }

    await Projeto.findByIdAndDelete(projetoId);

    res.json({ mensagem: 'Projeto deletado com sucesso' });

  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
}

