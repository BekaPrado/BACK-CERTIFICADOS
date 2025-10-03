const certificadoDAO = require("../dao/certificadoDAO");

module.exports = {
    async emitirCertificado(req, res) {
        try {
            const certificado = req.body;
            if (!certificado.id_usuario || !certificado.curso || !certificado.data_conclusao) {
                return res.status(400).json({ error: "Preencha todos os campos obrigatórios!" });
            }
            const novo = await certificadoDAO.create(certificado);
            res.status(201).json(novo);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async listarCertificados(req, res) {
        try {
            const lista = await certificadoDAO.findAll();
            res.json(lista);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async buscarPorId(req, res) {
        try {
            const { id } = req.params;
            const certificado = await certificadoDAO.findById(id);
            if (!certificado) return res.status(404).json({ error: "Certificado não encontrado!" });
            res.json(certificado);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async deletarCertificado(req, res) {
        try {
            const { id } = req.params;
            const result = await certificadoDAO.delete(id);
            res.json(result);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
};
