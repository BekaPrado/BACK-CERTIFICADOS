const express = require("express");
const router = express.Router();
const certificadoController = require("../controllers/certificadoController");

router.post("/", certificadoController.emitirCertificado);
router.get("/", certificadoController.listarCertificados);
router.get("/:id", certificadoController.buscarPorId);
router.delete("/:id", certificadoController.deletarCertificado);

module.exports = router;
