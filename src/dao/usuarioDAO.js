const pool = require("../config/db");

module.exports = {
    async create(usuario) {
        const sql = `INSERT INTO tbl_usuarios (nome, email, curso, data_conclusao) VALUES (?, ?, ?, ?)`;
        const [result] = await pool.query(sql, [
            usuario.nome,
            usuario.email,
            usuario.curso,
            usuario.data_conclusao
        ]);
        return { id: result.insertId, ...usuario };
    },

    async findAll() {
        const [rows] = await pool.query("SELECT * FROM tbl_usuarios");
        return rows;
    },

    async findById(id) {
        const [rows] = await pool.query("SELECT * FROM tbl_usuarios WHERE id_usuario = ?", [id]);
        return rows[0];
    },

    async delete(id) {
        await pool.query("DELETE FROM tbl_usuarios WHERE id_usuario = ?", [id]);
        return { message: "Usuário excluído com sucesso!" };
    }
};
