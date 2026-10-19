// ============================================================
// Entrada serverless da Vercel para o deploy UNIFICADO
// (site + API no mesmo projeto, com a raiz do repositório como Root Directory).
// A API real fica em backend/; este arquivo só a expõe em /api.
// ============================================================
module.exports = require('../backend/api/index.js');
