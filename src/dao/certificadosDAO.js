const pool = require("../config/db");

module.exports = {
    async create(certificado) {
        const sql = `INSERT INTO tbl_certificados (id_usuario, curso, data_conclusao) VALUES (?, ?, ?)`;
        const [result] = await pool.query(sql, [
            certificado.id_usuario,
            certificado.curso,
            certificado.data_conclusao
        ]);
        return { id: result.insertId, ...certificado };
    },

    async findAll() {
        const sql = `SELECT c.id_certificado, u.nome, u.email, c.curso, c.data_conclusao
                     FROM tbl_certificados c
                     JOIN tbl_usuarios u ON u.id_usuario = c.id_usuario`;
        const [rows] = await pool.query(sql);
        return rows;
    },

    async findById(id) {
        const sql = `SELECT c.id_certificado, u.nome, u.email, c.curso, c.data_conclusao
                     FROM tbl_certificados c
                     JOIN tbl_usuarios u ON u.id_usuario = c.id_usuario
                     WHERE c.id_certificado = ?`;
        const [rows] = await pool.query(sql, [id]);
        return rows[0];
    },

    async delete(id) {
        await pool.query("DELETE FROM tbl_certificados WHERE id_certificado = ?", [id]);
        return { message: "Certificado excluído com sucesso!" };
    }
};
