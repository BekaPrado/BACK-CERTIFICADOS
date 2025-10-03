const express = require("express");
const cors = require("cors");
require("dotenv").config();

const adminRoutes = require("./src/routes/adminRoutes");
const empresaRoutes = require("./src/routes/empresaRoutes");

const app = express();
app.use(cors());
app.use(express.json());

// Rotas
app.use("/admin", adminRoutes);
app.use("/empresas", empresaRoutes); // usa a constante já criada, não redeclare

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
