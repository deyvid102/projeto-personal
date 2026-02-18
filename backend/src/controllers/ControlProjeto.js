import Projeto from '../model/ModelProjeto.js'
import Treino from '../model/ModelTreino.js'

// 1. busca projeto por id
export async function buscarProjeto(req, res) {
    try {
        const { projetoId } = req.params;
        const projeto = await Projeto.findById(projetoId);
        if (!projeto) return res.status(404).json({ erro: 'projeto não encontrado' });
        const treinos = await Treino.find({ fk_projeto: projetoId }).sort({ ordem: 1 });
        res.json({ projeto, treinos });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
}

// 2. cria novo projeto
export async function criarProjeto(req, res) {
    try {
        const { nome, descricao, objetivo, fk_aluno, fk_personal, data_inicio, data_fim } = req.body;
        if (!nome || !objetivo || !fk_aluno || !fk_personal || !data_fim) {
            return res.status(400).json({ erro: 'campos obrigatórios não informados' });
        }
        let status = 'R'; 
        if (data_inicio) {
            const dInicio = new Date(data_inicio);
            const agora = new Date();
            agora.setHours(0, 0, 0, 0);
            if (dInicio > agora) status = 'AG';
        }
        const projeto = await Projeto.create({
            nome, descricao, objetivo, fk_aluno, fk_personal, data_inicio, data_fim, status
        });
        res.status(201).json(projeto);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
}

// 3. lista por aluno
export async function listarProjetosPorAluno(req, res) {
    try {
        const { alunoId } = req.params;
        const projetos = await Projeto.find({ fk_aluno: alunoId }).sort({ createdAt: -1 });
        res.json(projetos);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
}

// 4. lista por personal
export async function listarProjetosPorPersonal(req, res) {
    try {
        const { personalId } = req.params;
        const projetos = await Projeto.find({ fk_personal: personalId }).sort({ createdAt: -1 });
        res.json(projetos);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
}

// 5. edita dados do projeto
export async function editarProjeto(req, res) {
    try {
        const { projetoId } = req.params;
        const dados = req.body;
        const projeto = await Projeto.findById(projetoId);
        if (!projeto) return res.status(404).json({ erro: 'projeto não encontrado' });
        Object.keys(dados).forEach(campo => {
            if (campo !== 'reativar') projeto[campo] = dados[campo];
        });
        await projeto.save();
        res.json({ mensagem: 'projeto atualizado com sucesso', projeto });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
}

// 6. ativa projeto
export async function ativarProjeto(req, res) {
    try {
        const { projetoId } = req.params;
        const projeto = await Projeto.findById(projetoId);
        if (!projeto) return res.status(404).json({ erro: 'projeto não encontrado' });
        const projetoAtivo = await Projeto.findOne({ fk_aluno: projeto.fk_aluno, status: 'A' });
        if (projetoAtivo) return res.status(400).json({ erro: 'aluno já possui um projeto ativo' });
        projeto.status = 'A';
        if (!projeto.data_inicio || new Date(projeto.data_inicio) > new Date()) {
            projeto.data_inicio = new Date();
        }
        await projeto.save();
        res.json({ mensagem: 'projeto ativado com sucesso', projeto });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
}

// 7. reativa projeto
export async function reativarProjeto(req, res) {
    try {
        const { projetoId } = req.params;
        const projeto = await Projeto.findById(projetoId);
        if (!projeto) return res.status(404).json({ erro: 'projeto não encontrado' });
        const projetoAtivo = await Projeto.findOne({ fk_aluno: projeto.fk_aluno, status: 'A' });
        if (projetoAtivo) return res.status(400).json({ erro: 'aluno já possui um projeto ativo' });
        const dInicio = projeto.data_inicio ? new Date(projeto.data_inicio) : new Date();
        const agora = new Date();
        agora.setHours(0, 0, 0, 0);
        projeto.status = dInicio > agora ? 'AG' : 'A';
        await projeto.save();
        res.json({ mensagem: 'projeto reativado com sucesso', projeto });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
}

// 8. conclui projeto
export async function concluirProjeto(req, res) {
    try {
        const { projetoId } = req.params;
        const projeto = await Projeto.findById(projetoId);
        if (!projeto) return res.status(404).json({ erro: 'projeto não encontrado' });
        projeto.status = 'F'; 
        if (!projeto.data_fim || new Date(projeto.data_fim) > new Date()) {
            projeto.data_fim = new Date();
        }
        await projeto.save();
        res.json({ mensagem: 'projeto concluído com sucesso', projeto });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
}

// 9. cancela projeto
export async function cancelarProjeto(req, res) {
    try {
        const { projetoId } = req.params;
        const projeto = await Projeto.findByIdAndUpdate(projetoId, { status: 'C' }, { new: true });
        res.json({ mensagem: 'projeto cancelado com sucesso', projeto });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
}

// 10. deleta projeto (ATUALIZADO PARA DELETAR TREINOS)
export async function deletarProjeto(req, res) {
    try {
        const { projetoId } = req.params;
        
        // primeiro deletamos todos os treinos vinculados a este projeto
        await Treino.deleteMany({ fk_projeto: projetoId });
        
        // depois deletamos o projeto em si
        await Projeto.findByIdAndDelete(projetoId);
        
        res.json({ mensagem: 'projeto e todos os seus treinos foram deletados' });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
}