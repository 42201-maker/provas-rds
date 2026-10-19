/**
 * Configuração central da API do Frontend
 *
 * Regra padrão (não precisa editar nada quando o site e a API estão no MESMO projeto da Vercel):
 *   - Rodando em localhost / 127.0.0.1 / file://  -> API local  (http://localhost:3000/api)
 *   - Rodando em qualquer outro endereço (Vercel) -> MESMA ORIGEM (<seu-site>/api)
 *
 * Se o seu backend estiver publicado em OUTRO projeto da Vercel, preencha PROD_API_URL
 * (ex: 'https://meu-backend.vercel.app/api') ou use o botão "URL Ativa" na tela de login.
 */
const CONFIG = {
  // Deixe vazio ('') para usar a mesma origem do site (recomendado).
  PROD_API_URL: 'https://provas-rds-p9dz.vercel.app',

  // URL para testes em ambiente local (porta do backend: PORT=3000 no .env)
  LOCAL_API_URL: 'http://localhost:3000/api',

  // Chave do override salvo no navegador.
  // (V2 de propósito: descarta URLs antigas/erradas que ficaram salvas em testes anteriores.)
  STORAGE_KEY: 'SETOR_PROVAS_API_URL_V2',
  LEGACY_STORAGE_KEYS: ['SETOR_PROVAS_API_URL'],

  // Garante que a URL termine em /api e sem barra final
  normalizarUrl(url) {
    let limpa = String(url || '').trim().replace(/\/+$/, '');
    if (!limpa) return '';
    if (!/\/api$/i.test(limpa)) limpa += '/api';
    return limpa;
  },

  // Está sendo executado em ambiente local (servidor local, Live Server ou arquivo aberto direto)?
  ehAmbienteLocal() {
    const host = window.location.hostname;
    return (
      window.location.protocol === 'file:' ||
      host === 'localhost' ||
      host === '127.0.0.1'
    );
  },

  _lerOverride() {
    try {
      const salvo = localStorage.getItem(this.STORAGE_KEY);
      if (!salvo) return '';
      const url = this.normalizarUrl(salvo);
      // Uma URL de localhost salva nunca funciona numa página publicada: ignora.
      if (!this.ehAmbienteLocal() && /\/\/(localhost|127\.0\.0\.1)/i.test(url)) return '';
      return url;
    } catch (e) {
      return '';
    }
  },

  // Detecta automaticamente o ambiente e retorna a URL correta da API
  get API_URL() {
    // 1. Override manual salvo no navegador
    const override = this._lerOverride();
    if (override) return override;

    // 2. Ambiente local
    if (this.ehAmbienteLocal()) return this.LOCAL_API_URL;

    // 3. Backend em outro projeto (se configurado acima)
    if (this.PROD_API_URL) return this.normalizarUrl(this.PROD_API_URL);

    // 4. Padrão em produção: mesma origem do site (https://seu-site.vercel.app/api)
    return `${window.location.origin}/api`;
  },

  // Salva (ou remove, se vazio) uma URL customizada no navegador
  setApiUrl(novaUrl) {
    try {
      if (novaUrl && String(novaUrl).trim()) {
        localStorage.setItem(this.STORAGE_KEY, this.normalizarUrl(novaUrl));
      } else {
        localStorage.removeItem(this.STORAGE_KEY);
      }
    } catch (e) {
      console.warn('Não foi possível salvar a URL da API no navegador:', e);
    }
  },

  // Atalhos (também usáveis pelo console do navegador)
  // Retorna false quando é preciso pedir a URL ao usuário (página local sem PROD_API_URL).
  usarVercel() {
    if (this.PROD_API_URL) {
      this.setApiUrl(this.PROD_API_URL);
    } else if (this.ehAmbienteLocal()) {
      return false;
    } else {
      this.setApiUrl('');
    }
    console.log('✅ Usando API online:', this.API_URL);
    return true;
  },

  usarLocal() {
    this.setApiUrl(this.LOCAL_API_URL);
    console.log('✅ Usando API local:', this.API_URL);
  },

  resetarUrl() {
    this.setApiUrl('');
    console.log('✅ URL resetada — detecção automática ativada:', this.API_URL);
  }
};

// Limpa chaves antigas que podem estar apontando para uma URL errada
try {
  CONFIG.LEGACY_STORAGE_KEYS.forEach((k) => localStorage.removeItem(k));
} catch (e) {
  /* localStorage indisponível: segue com a detecção automática */
}

window.CONFIG = CONFIG;
