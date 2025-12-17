import Aluno from "../model/ModelAluno.js";

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
            return res.status(404).json({ message: "Aluno não encontrado" });
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

// DELETE
export const excluirAluno = async (req, res) => {
    try {
        const excluido = await Aluno.findByIdAndDelete(req.params.id);
        res.status(200).json(excluido);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
