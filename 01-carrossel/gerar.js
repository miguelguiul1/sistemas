#!/usr/bin/env node
/**
 * Gerador de carrossel: conteudo.json  ->  slides HTML  ->  PNG 1080x1350
 *
 * Uso:
 *   node gerar.js conteudo.json                  (salva em saidas/AAAA-MM-DD/<tema>/)
 *   node gerar.js conteudo.json --saida pasta/   (escolhe a pasta)
 *   node gerar.js --esqueleto "tema" 7           (cria um conteudo.json em branco pra preencher)
 *
 * Estilo (cores, fontes, @) fica só em config.json.
 */
const fs = require('fs');
const path = require('path');

const dir = __dirname;
const cfg = JSON.parse(fs.readFileSync(path.join(dir, 'config.json'), 'utf8'));

const esc = (s) =>
  String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
// *palavra* vira destaque dourado
const rich = (s) => esc(s).replace(/\*([^*]+)\*/g, '<em>$1</em>').replace(/\n/g, '<br>');
const slug = (s) =>
  String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 50) || 'carrossel';
const hoje = () => new Date().toISOString().slice(0, 10);

function css() {
  const c = cfg.cores, f = cfg.fontes;
  const fam = (n) => encodeURIComponent(n).replace(/%20/g, '+');
  return `
@import url('https://fonts.googleapis.com/css2?family=${fam(f.titulo)}:ital,wght@0,600;0,800;1,600&family=${fam(f.corpo)}:wght@400;500;700&display=swap');
:root{--fundo:${c.fundo};--verde:${c.verde};--ouro:${c.dourado};--claro:${c.claro};--e:1}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:${cfg.largura}px;height:${cfg.altura}px;overflow:hidden}
body{font-family:'${f.corpo}',system-ui,sans-serif;color:var(--claro);background:var(--fundo)}
.slide{position:relative;width:100%;height:100%;padding:90px 96px;display:flex;flex-direction:column;overflow:hidden}
.t-capa,.t-cta{background:radial-gradient(circle at 85% 12%,#16805e 0%,var(--verde) 38%,var(--fundo) 100%)}
.t-conteudo,.t-lista{background:radial-gradient(circle at 100% 0%,#0f2a21 0%,var(--fundo) 60%)}
.t-destaque{background:var(--claro);color:var(--fundo)}
.topo{display:flex;justify-content:space-between;align-items:center;font-size:28px;letter-spacing:.04em;font-weight:500;opacity:.85}
.topo b{color:var(--ouro);font-weight:700}
.t-destaque .topo b{color:var(--verde)}
.corpo{flex:1;display:flex;flex-direction:column;justify-content:center;overflow:hidden;padding:40px 0}
.rodape{display:flex;justify-content:space-between;align-items:center;font-size:28px;font-weight:500}
.rodape .perfil{color:var(--ouro);font-weight:700}
.t-destaque .rodape .perfil{color:var(--verde)}
.rodape .deslize{opacity:.7}
h1,h2{font-family:'${cfg.fontes.titulo}',Georgia,serif;font-weight:800;line-height:1.08;letter-spacing:-.01em}
h1{font-size:calc(116px*var(--e))}
h2{font-size:calc(80px*var(--e));margin-bottom:calc(36px*var(--e))}
em{color:var(--ouro);font-style:italic}
.t-destaque em{color:var(--verde)}
.linha{width:120px;height:6px;background:var(--ouro);border-radius:3px;margin:calc(40px*var(--e)) 0}
.sub{font-size:calc(44px*var(--e));line-height:1.35;opacity:.92;max-width:92%}
.texto{font-size:calc(46px*var(--e));line-height:1.4;opacity:.95}
.texto+.itens{margin-top:calc(34px*var(--e))}
.itens{list-style:none;display:flex;flex-direction:column;gap:calc(26px*var(--e))}
.itens li{display:flex;gap:28px;align-items:flex-start;font-size:calc(42px*var(--e));line-height:1.35}
.itens .n{flex:none;width:calc(64px*var(--e));height:calc(64px*var(--e));border-radius:50%;border:3px solid var(--ouro);color:var(--ouro);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:calc(32px*var(--e))}
.destaque-txt{font-family:'${cfg.fontes.titulo}',Georgia,serif;font-weight:800;font-size:calc(96px*var(--e));line-height:1.12}
.destaque-ref{margin-top:calc(40px*var(--e));font-size:calc(40px*var(--e));line-height:1.35;opacity:.8}
.aspas{font-family:Georgia,serif;font-size:260px;line-height:.6;color:var(--verde);margin-bottom:10px}
.botao{display:inline-block;margin-top:44px;background:var(--ouro);color:var(--fundo);font-weight:700;font-size:42px;padding:28px 56px;border-radius:999px;align-self:flex-start}
.marca-d{position:absolute;right:-140px;bottom:-140px;width:520px;height:520px;border-radius:50%;border:2px solid rgba(212,175,55,.35)}
.marca-d::after{content:'';position:absolute;inset:60px;border-radius:50%;border:2px solid rgba(212,175,55,.2)}
.bookmark{width:120px;height:120px;margin-bottom:30px}
.barra{position:absolute;left:0;bottom:0;height:10px;background:var(--ouro)}
`;
}

function slideHtml(s, i, total) {
  const perfil = cfg.perfil;
  const t = s.tipo || 'conteudo';
  const topo = `<div class="topo"><span><b>●</b> ${esc(perfil)}</span><span>${i + 1}/${total}</span></div>`;
  const rodape = (ultimo) => `<div class="rodape"><span class="perfil">${esc(perfil)}</span><span class="deslize">${ultimo ? '' : esc(cfg.textos.deslize) + ' →'}</span></div>`;
  const barra = `<div class="barra" style="width:${((i + 1) / total) * 100}%"></div>`;
  let corpo = '';
  if (t === 'capa') {
    corpo = `<h1>${rich(s.titulo)}</h1><div class="linha"></div>${s.subtitulo ? `<p class="sub">${rich(s.subtitulo)}</p>` : ''}`;
  } else if (t === 'destaque') {
    corpo = `<div class="aspas">“</div><p class="destaque-txt">${rich(s.titulo || s.texto)}</p>${s.texto && s.titulo ? `<p class="destaque-ref">${rich(s.texto)}</p>` : ''}`;
  } else if (t === 'cta') {
    const tit = s.titulo || cfg.textos.cta_titulo;
    const txt = s.texto || cfg.textos.cta_texto;
    corpo = `<svg class="bookmark" viewBox="0 0 24 24" fill="none" stroke="${cfg.cores.dourado}" stroke-width="1.6" stroke-linejoin="round"><path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4.5L5 21V4a1 1 0 0 1 1-1z"/></svg><h1 style="font-size:calc(104px*var(--e))">${rich(tit)}</h1><div class="linha"></div><p class="sub">${rich(txt)}</p><span class="botao">${esc(cfg.textos.cta_botao.replace('{perfil}', perfil))}</span>`;
  } else { // conteudo / lista
    const itens = (s.itens || []).map((x, k) => `<li><span class="n">${k + 1}</span><span>${rich(x)}</span></li>`).join('');
    corpo = `${s.titulo ? `<h2>${rich(s.titulo)}</h2>` : ''}${s.texto ? `<p class="texto">${rich(s.texto)}</p>` : ''}${itens ? `<ul class="itens">${itens}</ul>` : ''}`;
  }
  const cls = t === 'lista' ? 'conteudo' : t;
  return `<!doctype html><html><head><meta charset="utf-8"><style>${css()}</style></head><body>
<div class="slide t-${cls}">${t === 'capa' || t === 'cta' ? '<div class="marca-d"></div>' : ''}${topo}<div class="corpo" id="corpo">${corpo}</div>${rodape(i === total - 1)}${barra}</div></body></html>`;
}

function validar(c) {
  if (!c || !Array.isArray(c.slides) || c.slides.length < 2) throw new Error('O JSON precisa ter "slides" com pelo menos 2 itens.');
  const ok = ['capa', 'conteudo', 'lista', 'destaque', 'cta'];
  c.slides.forEach((s, i) => { if (s.tipo && !ok.includes(s.tipo)) throw new Error(`Slide ${i + 1}: tipo "${s.tipo}" inválido. Use: ${ok.join(', ')}`); });
}

async function main() {
  const args = process.argv.slice(2);
  if (args[0] === '--esqueleto') {
    const tema = args[1] || 'Meu tema';
    const n = Math.max(3, parseInt(args[2] || '7', 10));
    const slides = [{ tipo: 'capa', titulo: `${tema}`, subtitulo: 'Frase curta que dá vontade de deslizar' }];
    for (let k = 2; k < n; k++) slides.push({ tipo: 'conteudo', titulo: `Ponto ${k - 1}`, texto: 'Texto curto e direto.' });
    slides.push({ tipo: 'cta' });
    const out = path.join(process.cwd(), 'conteudo.json');
    fs.writeFileSync(out, JSON.stringify({ tema, slides, legenda: 'Legenda aqui.', hashtags: ['#ia', '#claude'] }, null, 2));
    console.log('Criei', out, '- preencha e rode: node gerar.js conteudo.json');
    return;
  }
  const iS = args.indexOf('--saida');
  const arq = args.find((a, k) => !a.startsWith('--') && k !== (iS >= 0 ? iS + 1 : -1));
  if (!arq) { console.error('Uso: node gerar.js conteudo.json [--saida pasta]'); process.exit(1); }
  const conteudo = JSON.parse(fs.readFileSync(arq, 'utf8'));
  validar(conteudo);
  const iSaida = args.indexOf('--saida');
  const saida = iSaida >= 0 ? path.resolve(args[iSaida + 1]) : path.join(dir, 'saidas', hoje(), slug(conteudo.tema || path.basename(arq, '.json')));
  fs.mkdirSync(saida, { recursive: true });

  let chromium;
  try { ({ chromium } = require('playwright')); }
  catch { console.error('Falta instalar. Rode uma vez: npm run instalar'); process.exit(1); }
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: cfg.largura, height: cfg.altura } });
  const total = conteudo.slides.length;
  for (let i = 0; i < total; i++) {
    await page.setContent(slideHtml(conteudo.slides[i], i, total), { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready).catch(() => {});
    await page.waitForTimeout(150);
    // encolhe o texto se não couber
    await page.evaluate(() => {
      const c = document.getElementById('corpo'); let e = 1;
      while (c.scrollHeight > c.clientHeight + 1 && e > 0.5) { e -= 0.04; document.documentElement.style.setProperty('--e', e.toFixed(2)); }
      return e;
    });
    const nome = path.join(saida, `slide-${String(i + 1).padStart(2, '0')}.png`);
    await page.screenshot({ path: nome });
  }
  await browser.close();
  // legenda + cópia do conteúdo
  const tags = (conteudo.hashtags || []).join(' ');
  fs.writeFileSync(path.join(saida, 'legenda.txt'), `${conteudo.legenda || ''}\n\n${tags}\n`);
  fs.writeFileSync(path.join(saida, 'conteudo.json'), JSON.stringify(conteudo, null, 2));
  console.log(`Pronto! ${total} slides em: ${saida}`);
}
main().catch((e) => { console.error('Erro:', e.message); process.exit(1); });
