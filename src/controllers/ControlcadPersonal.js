import ModelcadPersonal from "../model/ModelcadPersonal.js";

// CREATE
export const criarPersonal = async (req, res) => {
    try {
        const novo = await ModelcadPersonal.create(req.body);
        res.json(novo);
    } catch (error) {
        res.status(500).json({ error });
    }
};

// READ
export const listarPersonal = async (req, res) => {
    try {
        const lista = await ModelcadPersonal.find();
        res.json(lista);
    } catch (error) {
        res.status(500).json({ error });
    }
};

// UPDATE
export const atualizarPersonal = async (req, res) => {
    try {
        const atualizado = await ModelcadPersonal.findByIdAndUpdate(
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
export const excluirPersonal = async (req, res) => {
    try {
        const excluido = await ModelcadPersonal.findByIdAndDelete(req.params.id);
        res.json(excluido);
    } catch (error) {
        res.status(500).json({ error });
    }
};
