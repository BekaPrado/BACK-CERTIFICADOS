const usuarioDAO = require("../dao/usuarioDAO");

module.exports = {
    async criarUsuario(req, res) {
        try {
            const usuario = req.body;
            if (!usuario.nome || !usuario.email || !usuario.curso) {
                return res.status(400).json({ error: "Preencha todos os campos obrigatórios!" });
            }
            const novo = await usuarioDAO.create(usuario);
            res.status(201).json(novo);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async listarUsuarios(req, res) {
        try {
            const lista = await usuarioDAO.findAll();
            res.json(lista);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async buscarPorId(req, res) {
        try {
            const { id } = req.params;
            const usuario = await usuarioDAO.findById(id);
            if (!usuario) return res.status(404).json({ error: "Usuário não encontrado!" });
            res.json(usuario);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async deletarUsuario(req, res) {
        try {
            const { id } = req.params;
            const result = await usuarioDAO.delete(id);
            res.json(result);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
};
