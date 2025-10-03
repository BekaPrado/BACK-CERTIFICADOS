const pool = require("../config/db");

module.exports = {
    async insertOrUpdate(empresas) {
        for (let emp of empresas) {
            await pool.query(`
                INSERT INTO empresas 
                (status_pagamento, valor_bruto, data_pgto, recibo, nota_fiscal, carimbo_data_hora,
                 nome_scaleup, razao_social, cnpj, endereco, responsavel_compra, email_responsavel,
                 nome_participante, email_participante, whatsapp, cargo, forma_pagamento, termo_adesao)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE
                status_pagamento=VALUES(status_pagamento),
                valor_bruto=VALUES(valor_bruto),
                data_pgto=VALUES(data_pgto),
                recibo=VALUES(recibo),
                nota_fiscal=VALUES(nota_fiscal),
                carimbo_data_hora=VALUES(carimbo_data_hora),
                nome_scaleup=VALUES(nome_scaleup),
                razao_social=VALUES(razao_social),
                endereco=VALUES(endereco),
                responsavel_compra=VALUES(responsavel_compra),
                email_responsavel=VALUES(email_responsavel),
                nome_participante=VALUES(nome_participante),
                email_participante=VALUES(email_participante),
                whatsapp=VALUES(whatsapp),
                cargo=VALUES(cargo),
                forma_pagamento=VALUES(forma_pagamento),
                termo_adesao=VALUES(termo_adesao)
            `, [
                emp.status_pagamento, emp.valor_bruto, emp.data_pgto, emp.recibo, emp.nota_fiscal,
                emp.carimbo_data_hora, emp.nome_scaleup, emp.razao_social, emp.cnpj, emp.endereco,
                emp.responsavel_compra, emp.email_responsavel, emp.nome_participante, emp.email_participante,
                emp.whatsapp, emp.cargo, emp.forma_pagamento, emp.termo_adesao
            ]);
        }
    },

    async findByCnpj(cnpj) {
        const [rows] = await pool.query("SELECT * FROM empresas WHERE cnpj = ?", [cnpj]);
        return rows[0];
    }
};
