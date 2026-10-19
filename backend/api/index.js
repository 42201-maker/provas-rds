// ============================================================
// Ponto de entrada para o ambiente serverless da Vercel
// (usado quando o Root Directory do projeto é a pasta "backend")
// ============================================================
// O app Express já carrega o .env (somente local) e garante a conexão com o
// MongoDB (com cache entre invocações) no middleware de src/app.js.
// Na Vercel, as variáveis vêm de Settings → Environment Variables.
module.exports = require('../src/app');
