const express = require('express');
const router = express.Router();
const multer = require('multer');
const xlsx = require('xlsx');
const moment = require('moment');
const db = require('../config/db');
const gerarCertificado = require('../utils/gerarCertificado');

// Configuração do multer
const upload = multer({ dest: 'uploads/' });

/**
 * ===============================
 * UPLOAD DE PLANILHA
 * ===============================
 */
router.post('/upload-empresas', upload.single('arquivo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    }

    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);

    if (!data || data.length === 0) {
      return res.status(400).json({ error: 'Planilha vazia' });
    }

    let count = 0;

    for (const row of data) {
      let status_pagamento = 'PENDENTE';
      if (row['STATUS']) status_pagamento = row['STATUS'].toUpperCase().trim();

      const valor_bruto = row['VALOR BRUTO'] || null;
      let data_pgto = null;
      if (row['DATA PGTO']) {
        const parsed = moment(row['DATA PGTO'], ['DD/MM/YYYY', 'YYYY-MM-DD'], true);
        if (parsed.isValid()) data_pgto = parsed.format('YYYY-MM-DD');
      }

      const recibo = row['RECIBO'] || null;
      const nota_fiscal = row['NOTA FISCAL'] || null;
      let carimbo_data_hora = null;
      if (row['Carimbo de data/hora']) {
        const parsedCarimbo = moment(row['Carimbo de data/hora'], ['DD/MM/YYYY HH:mm', 'YYYY-MM-DD HH:mm:ss'], true);
        if (parsedCarimbo.isValid()) carimbo_data_hora = parsedCarimbo.format('YYYY-MM-DD HH:mm:ss');
      }

      const nome_scaleup = row['Nome da Scaleup'] || null;
      const razao_social = row['Razão Social:'] || null;

      let cnpj = null;
      if (row['CNPJ:']) {
        cnpj = String(row['CNPJ:']).replace(/\D/g, '').substring(0, 14);
      }
      if (!cnpj) {
        return res.status(400).json({ error: "Erro: Linha com CNPJ inválido encontrada. Upload cancelado." });
      }

      const endereco = row['Endereço Completo (Logradouro, nº, Bairro, Cidade / UF e CEP)'] || null;
      const responsavel_compra = row['Nome do responsável pela compra:'] || null;
      const email_responsavel = row['E-mail do responsável pela compra:'] || null;
      const nome_participante = row['Nome completo:'] || null;
      const email_participante = row['E-mail:'] || null;
      const whatsapp = row['WhatsApp:'] ? String(row['WhatsApp:']) : null;
      const cargo = row['Cargo:'] || null;
      const forma_pagamento = row['FORMA DE PAGAMENTO'] || null;
      const termo_adesao = row['TERMO DE ADESÃO'] || null;

      const sql = `
        INSERT INTO empresas (
          status_pagamento, valor_bruto, data_pgto, recibo, nota_fiscal,
          carimbo_data_hora, nome_scaleup, razao_social, cnpj, endereco,
          responsavel_compra, email_responsavel, nome_participante,
          email_participante, whatsapp, cargo, forma_pagamento, termo_adesao
        )
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
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
      `;

      const values = [
        status_pagamento, valor_bruto, data_pgto, recibo, nota_fiscal,
        carimbo_data_hora, nome_scaleup, razao_social, cnpj, endereco,
        responsavel_compra, email_responsavel, nome_participante,
        email_participante, whatsapp, cargo, forma_pagamento, termo_adesao
      ];

      await db.query(sql, values);
      count++;
    }

    // Salvar no histórico
    await db.query(
  `INSERT INTO historico_uploads (arquivo_nome, quantidade_empresas) VALUES (?, ?)`,
  [req.file.originalname, count]
);


    res.json({ message: 'Planilha importada com sucesso!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao processar planilha' });
  }
});

/**
 * ===============================
 * HISTÓRICO DE UPLOADS
 * ===============================
 */
router.get('/historico', async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM historico_uploads ORDER BY data_upload DESC LIMIT 50"
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar histórico' });
  }
});

/**
 * ===============================
 * GERAR CERTIFICADO POR CNPJ
 * ===============================
 */
router.get('/certificado/:cnpj', async (req, res) => {
  try {
    const { cnpj } = req.params;
    const [rows] = await db.query("SELECT * FROM empresas WHERE cnpj = ?", [cnpj]);

    if (!rows.length) return res.status(404).json({ error: "Empresa não encontrada" });
    const empresa = rows[0];

    if (empresa.status_pagamento !== 'PAGO') {
      return res.status(403).json({ error: "Pagamento não confirmado" });
    }

    gerarCertificado(empresa, res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao gerar certificado" });
  }
});

module.exports = router;
