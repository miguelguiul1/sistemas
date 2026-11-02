# Máquina de carrossel — como usar

Você dá um tema, sai um carrossel em PNG (1080x1350) + legenda com hashtags. **Nada é postado sozinho.**

## 1) Instalar (só uma vez)
Precisa do [Node.js](https://nodejs.org) (grátis). Depois, na pasta `01-carrossel`:
```bash
npm run instalar
```

## 2) Fazer um carrossel
No Claude Code, dentro do repositório, escreva:

> faz um carrossel de 8 slides sobre "como usar o Claude pra criar anúncios"

O Claude pesquisa, escreve os slides e a legenda e gera tudo em
`01-carrossel/saidas/AAAA-MM-DD/<tema>/`:
- `slide-01.png`, `slide-02.png`… (a ordem do carrossel)
- `legenda.txt` (legenda + hashtags, é só copiar)

Pra um **cliente**: "faz um carrossel de 7 slides pra [cliente] sobre [assunto]".

## 3) Carrosséis da semana (automático)
A rotina sugere 7 temas e gera 7 carrosséis-rascunho em `saidas/AAAA-MM-DD/`.
- **Na hora:** peça "faz os carrosséis da semana".
- **Todo domingo sozinho** (com o notebook ligado e o app aberto): no app do Claude Code, crie uma **tarefa agendada** semanal (domingo, de manhã) com o texto: `Rode a skill carrossel-semanal`.
  Alternativa pelo terminal (Mac/Linux), agendando no `cron`: `claude -p "Rode a skill carrossel-semanal"` dentro desta pasta.
- Segunda-feira é só abrir a pasta, revisar e postar.

## 4) Mudar o visual
Abra `config.json`: lá ficam seu @, cores, fontes e o texto do último slide. Mudou, vale pros próximos carrosséis.

## 5) Postar (você que faz)
**Pelo celular:** passe os PNGs pro celular (AirDrop, Drive, cabo), Instagram → **+** → Publicação → selecione os slides **na ordem** → cole a legenda.

**Agendando no Meta Business Suite (grátis):**
1. Sua conta do Instagram precisa ser **profissional** e ligada a uma Página do Facebook.
2. Acesse business.facebook.com → **Criar publicação** → marque **Instagram**.
3. **Adicionar mídia** → envie os PNGs na ordem (slide-01 primeiro).
4. Cole a legenda do `legenda.txt`.
5. Em baixo, ative **Agendar**, escolha dia e hora e clique **Agendar**.

## Se der problema
- "Falta instalar" → rode `npm run instalar`.
- Texto cortado → deixe o texto do slide mais curto e peça pra gerar de novo.
- Sem internet as fontes bonitas não carregam (fica uma fonte parecida).

Teste rápido: `npm run exemplo` gera um carrossel de exemplo em `exemplo/png/`.
