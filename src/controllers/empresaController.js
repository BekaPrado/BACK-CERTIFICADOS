const xlsx = require('xlsx');
const moment = require('moment');
const db = require('../config/db');

exports.uploadEmpresas = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    }

    // Ler planilha enviada
    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);

    for (const row of data) {
      // Mapeia colunas do seu Excel para as colunas do banco
      const status_pagamento = row['STATUS']
        ? row['STATUS'].toUpperCase().trim()
        : 'PENDENTE';

      const valor_bruto = row['VALOR BRUTO'] || null;
      const data_pgto = row['DATA PGTO']
        ? moment(row['DATA PGTO'], ['DD/MM/YYYY', 'YYYY-MM-DD']).format('YYYY-MM-DD')
        : null;
      const recibo = row['RECIBO'] || null;
      const nota_fiscal = row['NOTA FISCAL'] || null;
      const carimbo_data_hora = row['Carimbo de data/hora']
        ? moment(row['Carimbo de data/hora'], ['DD/MM/YYYY HH:mm']).format('YYYY-MM-DD HH:mm:ss')
        : null;
      const nome_scaleup = row['Nome da Scaleup'] || null;
      const razao_social = row['Razão Social:'] || null;
      const cnpj = row['CNPJ:'] ? row['CNPJ:'].replace(/\D/g, '') : null;
      const endereco = row['Endereço Completo (Logradouro, nº, Bairro, Cidade / UF e CEP)'] || null;
      const responsavel_compra = row['Nome do responsável pela compra:'] || null;
      const email_responsavel = row['E-mail do responsável pela compra:'] || null;
      const nome_participante = row['Nome completo:'] || null;
      const email_participante = row['E-mail:'] || null;
      const whatsapp = row['WhatsApp:'] || null;
      const cargo = row['Cargo:'] || null;
      const forma_pagamento = row['FORMA DE PAGAMENTO'] || null;
      const termo_adesao = row['TERMO DE ADESÃO'] || null;

      // Upsert no banco (se já existir cnpj, atualiza)
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
    }

    res.json({ message: 'Planilha importada com sucesso!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao processar planilha' });
  }
};
