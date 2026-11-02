#!/usr/bin/env node
// Pesquisa anúncios ATIVOS na Biblioteca de Anúncios da Meta (pública, grátis, sem login).
// Uso: node pesquisar.js "chuteira" [--pais BR] [--max 30] [--headless]
// Gera: pesquisas/AAAA-MM-DD-nicho.md (+ pasta com prints e dados.json)
// Não usa API paga, não faz login, não coleta dados pessoais (só o que a própria biblioteca mostra).

const fs = require('fs');
const path = require('path');
const { parseCard } = require('./lib/parse');

function args() {
  const a = process.argv.slice(2);
  const o = { nicho: null, pais: 'BR', max: 30, headless: false };
  for (let i = 0; i < a.length; i++) {
    if (a[i] === '--pais') o.pais = (a[++i] || 'BR').toUpperCase();
    else if (a[i] === '--max') o.max = Math.min(100, Math.max(1, parseInt(a[++i], 10) || 30));
    else if (a[i] === '--headless') o.headless = true;
    else if (!a[i].startsWith('--')) o.nicho = a[i];
  }
  return o;
}

const slug = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
const pausa = () => espera(1500 + Math.random() * 1500); // educado: não martela o site

// Roda dentro da página: acha cada card pelo "ID da biblioteca" e marca com data-mm-idx.
const MARCAR_CARDS = () => {
  const re = /(ID da biblioteca|Library ID)\s*:?\s*(\d{6,})/i;
  const achados = new Map();
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const m = walker.currentNode.nodeValue.match(re);
    if (!m) continue;
    let el = walker.currentNode.parentElement;
    // sobe até um bloco grande que contenha só este ID
    while (el && el.parentElement) {
      const pai = el.parentElement;
      const ids = (pai.innerText || '').match(new RegExp(re.source, 'gi')) || [];
      if (ids.length > 1) break;
      el = pai;
    }
    if (el && !achados.has(m[2])) achados.set(m[2], el);
  }
  let i = 0;
  const out = [];
  for (const [id, el] of achados) {
    el.setAttribute('data-mm-idx', String(i));
    out.push({ idx: i, id, texto: el.innerText });
    i++;
  }
  return out;
};

async function main() {
  const { nicho, pais, max, headless } = args();
  if (!nicho) {
    console.log('Uso: node pesquisar.js "palavra-chave" [--pais BR] [--max 30] [--headless]');
    process.exit(1);
  }
  let chromium;
  try { ({ chromium } = require('playwright')); } catch {
    console.error('Falta instalar. Rode: npm run instalar');
    process.exit(1);
  }

  const hoje = new Date();
  const dataStr = hoje.toISOString().slice(0, 10);
  const base = `${dataStr}-${slug(nicho)}`;
  const dirPrints = path.join(__dirname, 'pesquisas', base);
  fs.mkdirSync(dirPrints, { recursive: true });

  const url = process.env.PESQUISA_URL_TESTE || 'https://www.facebook.com/ads/library/?' + new URLSearchParams({
    active_status: 'active', ad_type: 'all', country: pais, q: nicho,
    media_type: 'all', search_type: 'keyword_unordered',
  });

  console.log(`Abrindo a Biblioteca de Anúncios: "${nicho}" (${pais})...`);
  const browser = await chromium.launch({ headless, ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}) });
  const ctx = await browser.newContext({ locale: 'pt-BR', viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });

  const temCards = () => page.evaluate(() => /(ID da biblioteca|Library ID)\s*:?\s*\d{6,}/i.test(document.body.innerText));
  let ok = false;
  for (let t = 0; t < 12 && !ok; t++) { await espera(2500); ok = await temCards(); }
  if (!ok && !headless) {
    console.log('\nNão apareceram anúncios ainda. Se tiver aviso de cookies/captcha na janela, resolva ele agora (tenho 90s)...');
    for (let t = 0; t < 30 && !ok; t++) { await espera(3000); ok = await temCards(); }
  }
  if (!ok) {
    console.error('\nNão consegui ver anúncios (sem resultado, bloqueio ou rede). Tente de novo mais tarde,');
    console.error('ou use a coleta manual descrita no COMO-USAR.md (seção "Plano B").');
    await browser.close();
    process.exit(2);
  }

  let cards = [];
  let semCrescer = 0;
  while (cards.length < max && semCrescer < 3) {
    const antes = cards.length;
    cards = await page.evaluate(MARCAR_CARDS);
    semCrescer = cards.length > antes ? 0 : semCrescer + 1;
    process.stdout.write(`\r  ${cards.length} anúncios carregados...`);
    if (cards.length >= max) break;
    await page.mouse.wheel(0, 2500);
    await pausa();
  }
  console.log('');

  // Parse + ranking (mais tempo no ar e mais versões primeiro)
  const lista = cards.map((c) => ({ ...parseCard(c.texto, hoje), idx: c.idx, texto_bruto: c.texto }));
  lista.sort((a, b) => b.score - a.score);
  const top = lista.slice(0, Math.min(15, lista.length));

  for (const [n, ad] of top.entries()) {
    try {
      const arq = `anuncio-${String(n + 1).padStart(2, '0')}.png`;
      await page.locator(`[data-mm-idx="${ad.idx}"]`).first().screenshot({ path: path.join(dirPrints, arq), timeout: 15000 });
      ad.print = `${base}/${arq}`;
    } catch { ad.print = null; }
  }
  await browser.close();

  fs.writeFileSync(path.join(dirPrints, 'dados.json'), JSON.stringify({ nicho, pais, data: dataStr, anuncios: top }, null, 2));

  const linhas = [
    `# Pesquisa de anúncios: ${nicho} (${pais}) — ${dataStr}`,
    '',
    `Fonte: Biblioteca de Anúncios da Meta (pública). ${lista.length} anúncios ativos lidos, top ${top.length} abaixo.`,
    'Ordem: mais tempo no ar + mais versões = mais provável que esteja vendendo. **Use só pra se inspirar, não copie.**',
    'Os campos marcados com _(Claude preenche)_ são a análise; o resto veio direto da biblioteca.',
    '',
  ];
  top.forEach((ad, n) => {
    linhas.push(`## ${n + 1}. ${ad.pagina || 'Anunciante'} — ${ad.dias_no_ar ?? '?'} dias no ar, ${ad.versoes} versão(ões)`);
    linhas.push('');
    linhas.push(`- **Link:** ${ad.id ? `https://www.facebook.com/ads/library/?id=${ad.id}` : '(sem id)'}`);
    if (ad.print) linhas.push(`- **Print:** ![print](${ad.print})`);
    linhas.push(`- **No ar desde:** ${ad.inicio || '?'}`);
    linhas.push(`- **CTA (botão):** ${ad.cta || '(não identificado)'}`);
    linhas.push(`- **Gancho (1ª linha):** ${ad.gancho || '(sem texto — provável vídeo/imagem)'}`);
    linhas.push(`- **Oferta:** _(Claude preenche)_`);
    linhas.push(`- **Por que provavelmente funciona:** _(Claude preenche)_`);
    linhas.push('');
    linhas.push('<details><summary>Texto completo</summary>', '', '```', ad.texto || '(vazio)', '```', '', '</details>', '');
  });
  const md = path.join(__dirname, 'pesquisas', `${base}.md`);
  fs.writeFileSync(md, linhas.join('\n'));
  console.log(`Pronto! Relatório: ${path.relative(process.cwd(), md)}`);
}

main().catch((e) => { console.error('Erro:', e.message); process.exit(1); });
