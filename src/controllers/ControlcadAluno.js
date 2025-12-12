import ModelcadAluno from "../model/ModelcadAluno.js";

// CREATE
export const criarAluno = async (req, res) => {
    try {
        const novo = await ModelcadAluno.create(req.body);
        res.json(novo);
    } catch (error) {
        res.status(500).json({ error });
    }
};

// READ
export const listarAluno = async (req, res) => {
    try {
        const lista = await ModelcadAluno.find();
        res.json(lista);
    } catch (error) {
        res.status(500).json({ error });
    }
};

// READ - buscar por ID
export const listarAlunoPorId = async (req, res) => {
    try {
        const aluno = await ModelcadAluno.findById(req.params.id);
        if (!aluno) {
            return res.status(404).json({ message: "Aluno não encontrado" });
        }
        res.json(aluno);
    } catch (error) {
        res.status(500).json({ error });
    }
};

// UPDATE
export const atualizarAluno = async (req, res) => {
    try {
        const atualizado = await ModelcadAluno.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(atualizado);
    } catch (error) {
        res.status(500).json({ error });
    }
};

// DELETE
export const excluirAluno = async (req, res) => {
    try {
        const excluido = await ModelcadAluno.findByIdAndDelete(req.params.id);
        res.json(excluido);
    } catch (error) {
        res.status(500).json({ error });
    }
};
