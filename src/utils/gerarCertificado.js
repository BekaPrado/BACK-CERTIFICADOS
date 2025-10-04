const PDFDocument = require("pdfkit");
const fs = require('fs'); // Necessário se você for carregar a imagem do disco

function gerarCertificado(empresa, res) {
    const doc = new PDFDocument({
        size: "A4",
        layout: "landscape", // A4 Deitado
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
        "Content-Disposition",
        `attachment; filename=certificado-${empresa.cnpj}.pdf`
    );

    doc.pipe(res);

    // --- CONFIGURAÇÕES DE DESIGN E CORES ---
    const PADDING = 40; 
    const pageWidth = doc.page.width;
    const pageHeight = doc.page.height;
    const innerWidth = pageWidth - 2 * PADDING;
    const center = pageWidth / 2;
    const CERTIFIER_NAME = "100 Open Startups";
    
    // Cores (Ajustadas para o "Azul Royal Marinho" da 100 Open Startups)
    const DEEP_BLUE = "#00509d"; // Azul Marinho Profundo (Royal)
    const LIGHT_ACCENT = "#e0f8ff"; // Sutil toque de azul claro
    const TEXT_COLOR = "#333333";

    // --- 1. FUNDO E BORDA MODERNA ---

    // Fundo base sutil
    doc.rect(0, 0, pageWidth, pageHeight).fill("#ffffff");

    // Borda decorativa interna em Azul Marinho
    doc.lineWidth(5);
    doc.rect(PADDING, PADDING, pageWidth - 2 * PADDING, pageHeight - 2 * PADDING).stroke(DEEP_BLUE);
    
    // Tarja decorativa na lateral (opcional: dá um toque moderno)
    doc.rect(0, 0, 10, pageHeight).fill(DEEP_BLUE);
    doc.rect(pageWidth - 10, 0, 10, pageHeight).fill(DEEP_BLUE);


    // --- 2. ESPAÇO E INSERÇÃO DO LOGO ---
    const logoSize = 100;
    const logoX = center - logoSize / 2;
    const logoY = PADDING + 30;

    // A área de comentários abaixo é onde você deve colocar a lógica para a imagem real.
    // **SUGESTÃO DE CÓDIGO PARA IMAGEM (Requer que o arquivo seja acessível no backend):**
    /*
    try {
        const logoPath = '/logo.svg'; 
        doc.image(logoPath, logoX, logoY, {
            width: logoSize,
            height: logoSize,
            align: 'center',
            valign: 'top'
        });
    } catch (e) {
        // Fallback: Se o arquivo do logo não for encontrado
        doc.fontSize(16).fillColor(DEEP_BLUE).text(CERTIFIER_NAME + " LOGO", logoX, logoY + 40, {
            width: logoSize,
            align: 'center'
        });
    }
    */
    
    // Placeholder Simples para fins de teste:
    doc.fontSize(16).fillColor(DEEP_BLUE).font("Helvetica-Bold").text(CERTIFIER_NAME + " LOGO AQUI", logoX, logoY + 40, {
        width: logoSize,
        align: 'center'
    });
    
    let currentY = logoY + logoSize + 40; // Posição abaixo do logo

    // --- 3. CONTEÚDO PRINCIPAL CENTRALIZADO ---

    // TÍTULO GRANDE E MODERNO
    doc
        .fontSize(56)
        .fillColor(DEEP_BLUE)
        .font("Helvetica-Bold")
        .text("CERTIFICADO", PADDING, currentY, {
            align: "center",
            width: innerWidth,
        });

    doc.moveDown(0.2);
    currentY = doc.y;
    
    doc
        .fontSize(24)
        .fillColor(DEEP_BLUE)
        .font("Helvetica")
        .text("DE RECONHECIMENTO EMPRESARIAL", {
            align: "center",
            width: innerWidth,
        });

    doc.moveDown(1.5);
    currentY = doc.y;

    // TEXTO DE CONCESSÃO
    doc
        .fontSize(18)
        .fillColor(TEXT_COLOR)
        .font("Helvetica")
        .text("É com grande honra que a " + CERTIFIER_NAME + " confere este certificado a:", PADDING, currentY, {
            align: "center",
            width: innerWidth,
        });

    doc.moveDown(0.5);
    currentY = doc.y;

    // NOME DA EMPRESA EM DESTAQUE (48pt)
    doc
        .fontSize(48) 
        .fillColor(DEEP_BLUE)
        .font("Helvetica-Bold")
        .text(`${empresa.razao_social}`, {
            align: "center",
            width: innerWidth,
        });

    doc.moveDown(1.5);
    currentY = doc.y;

    // TEXTO COMPLEMENTAR
    doc
        .fontSize(18)
        .fillColor(TEXT_COLOR)
        .font("Helvetica")
        .text(
            `Pela sua participação no **Programa ScaleUps** e seu compromisso em fomentar a inovação e o crescimento no ecossistema brasileiro de tecnologia.`,
            {
                align: "center",
                width: innerWidth,
            }
        );

    doc.moveDown(3);

    // --- 4. DATA E ASSINATURA ---
    const signatureBottomY = pageHeight - 90;
    const signatureWidth = 200;

    // Linha de Assinatura (Centralizada)
    doc.lineWidth(1)
       .lineCap('square')
       .moveTo(center - signatureWidth / 2, signatureBottomY)
       .lineTo(center + signatureWidth / 2, signatureBottomY)
       .stroke(DEEP_BLUE);

    doc.moveDown(0.2);
    
    // Texto da Assinatura
    doc
        .fontSize(14)
        .fillColor(DEEP_BLUE)
        .font("Helvetica-Bold")
        .text(CERTIFIER_NAME, center - signatureWidth / 2, signatureBottomY + 5, {
            width: signatureWidth,
            align: 'center'
        });

    // Informações legais (CNPJ e Data) no canto inferior
    doc
        .fontSize(10)
        .fillColor("#666")
        .font("Helvetica")
        .text(`CNPJ: ${empresa.cnpj} | Emissão: ${new Date().toLocaleDateString("pt-BR")}`, 
            center - innerWidth / 2, 
            pageHeight - 25, {
                width: innerWidth,
                align: 'left'
            }
        );

    doc.end();
}

module.exports = gerarCertificado;