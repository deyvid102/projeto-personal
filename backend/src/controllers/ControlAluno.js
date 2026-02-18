import Aluno from "../model/ModelAluno.js";
import Projeto from "../model/ModelProjeto.js";
import Treino from "../model/ModelTreino.js";

// CREATE
export const criarAluno = async (req, res) => {
    try {
        const novo = await Aluno.create(req.body);
        res.status(201).json(novo);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// READ - listar alunos (opcionalmente filtrando por personal)
export const listarAluno = async (req, res) => {
    try {
        const { fk_personal } = req.query;
        const filtro = fk_personal ? { fk_personal } : {};
        const alunos = await Aluno.find(filtro);
        res.status(200).json(alunos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// READ - buscar por ID
export const listarAlunoPorId = async (req, res) => {
    try {
        const aluno = await Aluno.findById(req.params.id);
        if (!aluno) {
            return res.status(404).json({ message: "aluno não encontrado" });
        }
        res.status(200).json(aluno);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// UPDATE
export const atualizarAluno = async (req, res) => {
    try {
        const atualizado = await Aluno.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.status(200).json(atualizado);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// DELETE - exclusão em cascata (treinos -> projetos -> aluno)
export const excluirAluno = async (req, res) => {
    try {
        const alunoId = req.params.id;

        // 1. localiza os projetos do aluno para saber quais treinos apagar
        const projetos = await Projeto.find({ fk_aluno: alunoId });
        const projetoIds = projetos.map(p => p._id);

        // 2. remove todos os treinos vinculados a esses projetos
        await Treino.deleteMany({ fk_projeto: { $in: projetoIds } });

        // 3. remove todos os projetos do aluno
        await Projeto.deleteMany({ fk_aluno: alunoId });

        // 4. remove o aluno
        const excluido = await Aluno.findByIdAndDelete(alunoId);

        if (!excluido) {
            return res.status(404).json({ message: "aluno não encontrado" });
        }

        res.status(200).json({ 
            message: "aluno e todos os dados vinculados excluídos com sucesso", 
            excluido 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};