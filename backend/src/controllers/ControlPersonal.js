import Personal from "../model/ModelPersonal.js";

// CREATE
export const criarPersonal = async (req, res) => {
    try {
        const novo = await Personal.create(req.body);
        res.json(novo);
    } catch (error) {
        res.status(500).json({ error });
    }
};

// READ
export const listarPersonal = async (req, res) => {
    try {
        const lista = await Personal.find();
        res.json(lista);
    } catch (error) {
        res.status(500).json({ error });
    }
};

// READ - buscar por ID
export const listarPersonalPorId = async (req, res) => {
    try {
        const personal = await Personal.findById(req.params.id);
        if (!personal) {
            return res.status(404).json({ message: "Personal não encontrado" });
        }
        res.json(personal);
    } catch (error) {
        res.status(500).json({ error });
    }
};

// UPDATE
export const atualizarPersonal = async (req, res) => {
    try {
        const atualizado = await Personal.findByIdAndUpdate(
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
        const excluido = await Personal.findByIdAndDelete(req.params.id);
        res.json(excluido);
    } catch (error) {
        res.status(500).json({ error });
    }
};
