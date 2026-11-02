// Funções puras: interpretam o TEXTO de um card da Biblioteca de Anúncios (pt-BR ou en).
// Só lê informação pública do anúncio. Nada de dados pessoais.

const MESES = {
  jan: 0, fev: 1, feb: 1, mar: 2, abr: 3, apr: 3, mai: 4, may: 4, jun: 5, jul: 6,
  ago: 7, aug: 7, set: 8, sep: 8, out: 9, oct: 9, nov: 10, dez: 11, dec: 11,
};

const CTAS = [
  'Saiba mais', 'Comprar agora', 'Enviar mensagem', 'Cadastre-se', 'Fale conosco', 'Ver mais',
  'Pedir agora', 'Baixar', 'Reservar', 'Ligar agora', 'Obter oferta', 'Assinar', 'Agendar agora',
  'Entrar em contato', 'Ver menu', 'Instalar agora', 'Solicitar', 'Mande uma mensagem',
  'Learn more', 'Shop now', 'Send message', 'Sign up', 'Contact us', 'Order now', 'Book now',
  'Get offer', 'Call now', 'Download', 'Subscribe', 'WhatsApp message', 'Enviar mensagem no WhatsApp',
];

function parseData(texto, hoje = new Date()) {
  // "Veiculação iniciada em 5 de out de 2026" | "Started running on 5 Oct 2026" | "Oct 5, 2026"
  const t = texto.toLowerCase().replace(/\./g, '');
  let m = t.match(/(\d{1,2})\s+(?:de\s+)?([a-zç]{3})[a-zç]*\s+(?:de\s+)?(\d{4})/);
  let d, mes, a;
  if (m) { d = +m[1]; mes = MESES[m[2]]; a = +m[3]; }
  else {
    m = t.match(/([a-z]{3})[a-z]*\s+(\d{1,2}),?\s+(\d{4})/);
    if (m) { mes = MESES[m[1]]; d = +m[2]; a = +m[3]; }
  }
  if (mes === undefined || !a) return null;
  const dt = new Date(Date.UTC(a, mes, d));
  const dias = Math.max(0, Math.round((Date.UTC(hoje.getUTCFullYear(), hoje.getUTCMonth(), hoje.getUTCDate()) - dt) / 86400000));
  return { iso: dt.toISOString().slice(0, 10), dias };
}

function parseVersoes(texto) {
  // "Este anúncio tem várias versões" / "3 anúncios usam este criativo e texto" / "This ad has multiple versions"
  let m = texto.match(/(\d+)\s+an[uú]ncios?\s+usam?/i) || texto.match(/(\d+)\s+ads?\s+use/i)
    || texto.match(/(\d+)\s+vers[õo]es/i) || texto.match(/(\d+)\s+versions/i);
  if (m) return +m[1];
  if (/v[aá]rias vers[õo]es|multiple versions/i.test(texto)) return 2;
  return 1;
}

function parseCard(texto, hoje = new Date()) {
  const linhas = texto.split('\n').map((l) => l.trim()).filter(Boolean);
  const id = (texto.match(/(?:ID da biblioteca|Library ID)\s*:?\s*(\d{6,})/i) || [])[1] || null;
  const data = parseData(texto, hoje);
  const versoes = parseVersoes(texto);
  const ativo = !/inativo|inactive/i.test(texto);

  const iSpons = linhas.findIndex((l) => /^(patrocinado|sponsored)$/i.test(l));
  const pagina = iSpons > 0 ? linhas[iSpons - 1] : null;

  const ctaIdx = linhas.findIndex((l) => CTAS.some((c) => c.toLowerCase() === l.toLowerCase()));
  const cta = ctaIdx >= 0 ? linhas[ctaIdx] : null;

  const ruido = /^(ativo|inativo|active|inactive|abrir menu suspenso|ver detalhes do an[uú]ncio|see ad details|see summary details|ver detalhes do resumo|plataformas|platforms|ID da biblioteca|Library ID|Veicula|Started running|\d+:\d+\s*\/\s*\d+:\d+)/i;
  const ini = iSpons >= 0 ? iSpons + 1 : 0;
  const fim = ctaIdx >= 0 ? ctaIdx : linhas.length;
  const corpo = linhas.slice(ini, fim).filter((l) => !ruido.test(l) && !/^(patrocinado|sponsored)$/i.test(l));
  // linha logo antes do CTA costuma ser o título/domínio do link; mantém no corpo
  const textoAnuncio = corpo.join('\n');
  const gancho = corpo[0] || null;

  const dias = data ? data.dias : 0;
  const score = dias + (versoes - 1) * 15; // mais tempo no ar + mais versões = mais provável que venda

  return {
    id, pagina, ativo, inicio: data ? data.iso : null, dias_no_ar: data ? data.dias : null,
    versoes, cta, gancho, texto: textoAnuncio, score,
  };
}

module.exports = { parseCard, parseData, parseVersoes, CTAS };
