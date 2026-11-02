---
name: carrossel-semanal
description: Rotina semanal do Miguel - sugere 7 temas e gera 7 carrosséis em rascunho em 01-carrossel/saidas/AAAA-MM-DD/. Use quando pedirem "carrosséis da semana", "rotina semanal" ou quando a tarefa agendada disparar.
---

# Skill: Carrossel semanal

Gera 7 carrosséis-rascunho de uma vez, para o Miguel só revisar. **Não posta nada.**

## Passo a passo
1. Data de hoje = `AAAA-MM-DD`. Pasta da semana: `01-carrossel/saidas/AAAA-MM-DD/`.
2. Veja o que já saiu antes em `01-carrossel/saidas/` (pastas anteriores) pra **não repetir tema**.
3. **Pesquise** (WebSearch) o que está em alta nesta semana em: Claude/Claude Code, prompts e produtividade, IA pra marketing/agência, novidades e ferramentas de IA. Escolha **7 temas variados** (mistura: 2 novidades, 2 tutoriais/prompts, 2 marketing/agência, 1 lista de ferramentas). Só inclua novidade que você confirmou em fonte confiável.
4. Escreva `01-carrossel/saidas/AAAA-MM-DD/TEMAS.md` com os 7 temas (1 linha cada, com o porquê e a fonte).
5. Para cada tema, siga a skill `carrossel` (pesquisa curta, copy, legenda, hashtags) com **8 slides** e rode `node gerar.js` salvando em `01-carrossel/saidas/AAAA-MM-DD/NN-tema-slug/` (use `--saida`). `NN` = 01 a 07.
6. Termine com um resumo: lista dos 7 carrosséis, pasta, e lembrete: "Rascunhos! Revisa e posta (ou agenda no Meta Business Suite)".

## Regras
- Custo zero. Nada de postar, agendar ou enviar: só arquivos.
- Se um tema falhar, siga pros outros e avise no final qual falhou.
