// Testa o leitor de texto com exemplos (sem internet): node testar.js
const assert = require('assert');
const { parseCard } = require('./lib/parse');
const hoje = new Date(Date.UTC(2026, 10, 2));

const pt = `Ativo
Plataformas
ID da biblioteca: 123456789012345
Veiculação iniciada em 5 de out de 2026
Este anúncio tem várias versões
Chuteira Pro Store
Patrocinado
Cansado de chuteira que machuca o pé?
Conheça a linha nova com frete grátis. Só até domingo.
chuteirapro.com.br
Comprar agora`;
const a = parseCard(pt, hoje);
assert.equal(a.id, '123456789012345');
assert.equal(a.pagina, 'Chuteira Pro Store');
assert.equal(a.inicio, '2026-10-05');
assert.equal(a.dias_no_ar, 28);
assert.equal(a.versoes, 2);
assert.equal(a.cta, 'Comprar agora');
assert.equal(a.gancho, 'Cansado de chuteira que machuca o pé?');

const en = `Active
Library ID: 987654321098
Started running on Sep 1, 2026
3 ads use this creative and text
Marina Sul
Sponsored
Book your boat day
Learn more`;
const b = parseCard(en, hoje);
assert.equal(b.dias_no_ar, 62);
assert.equal(b.versoes, 3);
assert.equal(b.cta, 'Learn more');
assert.ok(b.score > a.score);
console.log('OK: leitor de anúncios passou nos testes.');
