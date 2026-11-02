---
name: carrossel
description: Cria um carrossel de Instagram (PNG 1080x1350) + legenda com hashtags a partir de um tema. Use quando o Miguel pedir "faz um carrossel sobre X", "carrossel de N slides", ou der um tema para Instagram.
---

# Skill: Carrossel

Você cria carrosséis prontos pra postar. **Nunca poste nada**: só gera arquivos.

## Entrada
- **Tema** (obrigatório). Se vier só um assunto vago, escolha o melhor ângulo e siga (não pergunte à toa).
- **Nº de slides** (padrão 8; mínimo 5, máximo 10).
- Opcional: para quem é (ex.: cliente da agência). Nesse caso adapte o tom ao cliente e use `--saida` numa pasta com o nome dele.

## Passo a passo
1. **Pesquisar** (WebSearch/WebFetch): 2–4 fontes recentes e confiáveis (de preferência oficiais: anthropic.com, docs). Anote só fatos que achou. **Não invente número, data, nome de recurso ou preço.** Se não confirmou, não afirma.
2. **Escrever a copy** slide por slide, no tom do Miguel: português do Brasil, informal e direto, frases curtas, sem enrolação, sem jargão. Cada slide tem UMA ideia.
   - Slide 1 `capa`: título forte (gancho, curiosidade ou promessa), até ~10 palavras. Use `*palavra*` pra destacar em dourado 1–2 palavras.
   - Slides do meio: `conteudo` (título + texto curto, até ~25 palavras), `lista` (2–4 itens curtos) ou `destaque` (frase de impacto, no máx. 1 por carrossel).
   - Último slide `cta`: "Salva pra depois" (já é o padrão, basta `{ "tipo": "cta" }`).
3. **Legenda**: gancho na 1ª linha, 3–6 linhas curtas, pergunta pra gerar comentário, lembrete de salvar/compartilhar. Mais **8–12 hashtags** (mistura de grandes e de nicho, em português).
4. **Salvar o conteúdo** como JSON (formato abaixo) em `01-carrossel/saidas/AAAA-MM-DD/<tema-em-slug>/conteudo.json` — ou arquivo temporário — e rodar:
   ```bash
   cd 01-carrossel && node gerar.js caminho/conteudo.json
   ```
   Se der erro de "Falta instalar", rode `npm run instalar` e tente de novo.
5. **Conferir**: abra 2–3 PNGs (capa, um do meio, o último) e veja se nada ficou cortado/feio. Corrija o texto e gere de novo se precisar.
6. **Responder** ao Miguel: pasta onde ficou, resumo de 1 linha por slide, a legenda, e lembrar que é rascunho pra ele revisar e postar.

## Formato do conteudo.json
```json
{
  "tema": "texto do tema",
  "slides": [
    { "tipo": "capa", "titulo": "Título com *destaque*", "subtitulo": "opcional" },
    { "tipo": "conteudo", "titulo": "Título", "texto": "Texto curto." },
    { "tipo": "lista", "titulo": "Título", "itens": ["item 1", "item 2"] },
    { "tipo": "destaque", "titulo": "Frase de impacto", "texto": "complemento opcional" },
    { "tipo": "cta" }
  ],
  "legenda": "Texto da legenda...",
  "hashtags": ["#claude", "#ia"]
}
```
Estilo (cores, fontes, @) fica em `01-carrossel/config.json`. Não coloque estilo no JSON do conteúdo.

## Regras
- Custo zero, sem APIs pagas. Sem senha/token no repositório.
- Nunca publicar, agendar ou enviar nada sem o Miguel confirmar.
