const adminDAO = require("../dao/adminDAO");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = {
    async login(req, res) {
        try {
            const { email, senha } = req.body;
            const admin = await adminDAO.findByEmail(email);
            if (!admin) return res.status(404).json({ error: "Admin não encontrado" });

            // Senha armazenada simples no banco (pode usar bcrypt se preferir)
            const match = senha === admin.senha;
            if (!match) return res.status(401).json({ error: "Senha incorreta" });

            const token = jwt.sign({ id: admin.id, email: admin.email }, process.env.JWT_SECRET, { expiresIn: "1h" });
            res.json({ token });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
};
