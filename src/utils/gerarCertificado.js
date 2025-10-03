const PDFDocument = require("pdfkit");

function gerarCertificado(empresa, res) {
  const doc = new PDFDocument({
    size: "A4",
    layout: "landscape",
  });

  // configura o response como PDF
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=certificado-${empresa.cnpj}.pdf`
  );

  doc.pipe(res);

  // Fundo azul degradê simples
  const pageWidth = doc.page.width;
  const pageHeight = doc.page.height;

  const gradient = doc.linearGradient(0, 0, pageWidth, pageHeight);
  gradient.stop(0, "#0077b6").stop(1, "#00b4d8");
  doc.rect(0, 0, pageWidth, pageHeight).fill(gradient);

  // Título
  doc
    .fontSize(48)
    .fillColor("#ffffff")
    .font("Helvetica-Bold")
    .text("CERTIFICADO", {
      align: "center",
      valign: "center",
    });

  // Espaço
  doc.moveDown(3);

  // Nome da empresa em destaque
  doc
    .fontSize(36)
    .fillColor("#ffffff")
    .font("Helvetica-Bold")
    .text(`${empresa.razao_social}`, {
      align: "center",
    });

  doc.moveDown(1);

  // Texto complementar
  doc
    .fontSize(20)
    .fillColor("#f1f1f1")
    .font("Helvetica")
    .text(
      "Certificamos a participação desta empresa no programa de ScaleUps.",
      {
        align: "center",
      }
    );

  doc.moveDown(2);

  // Rodapé
  doc
    .fontSize(14)
    .fillColor("#e0f7fa")
    .font("Helvetica-Oblique")
    .text("Emitido automaticamente pelo sistema de certificados", {
      align: "center",
      valign: "bottom",
    });

  doc.end();
}

module.exports = gerarCertificado;
