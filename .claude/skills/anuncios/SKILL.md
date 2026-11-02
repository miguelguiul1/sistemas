---
name: anuncios
description: Máquina de anúncio do Miguel - pesquisa criativos ativos na Biblioteca de Anúncios da Meta (grátis) e gera 5 variações originais (ganchos, copy curta, roteiro de vídeo 15s). Use quando pedirem "pesquisa anúncios de X", "acha criativos de X", "faz variações desse anúncio" ou "máquina de anúncio".
---

# Skill: Máquina de anúncio

Dois passos, com **parada obrigatória pra confirmação** entre eles. **Nunca publique anúncio, nunca gaste dinheiro, nunca logue em conta do Miguel.** Só gera arquivos. Custo zero.

Regras da Meta: só informação pública dos anúncios, nada de dado pessoal (nem de quem comenta/curte). **Não copie texto nem imagem de terceiros**: só se inspire no ângulo.

## Passo 1 — Pesquisa
1. **Entrada**: nicho/palavra-chave (obrigatório) e país (padrão BR). Se vier vago, escolha a palavra mais específica e siga. Palavras específicas (ex.: "chuteira society", "passeio de lancha") dão melhor resultado que genéricas.
2. Rodar (na pasta `04-anuncios`; se faltar instalar: `npm run instalar`):
   ```bash
   cd 04-anuncios && node pesquisar.js "nicho" --pais BR --max 30
   ```
   Abre o Chrome visível (o Miguel pode precisar fechar aviso de cookies). Gera `pesquisas/AAAA-MM-DD-nicho.md` + prints.
   - Código de saída 2 / "não consegui ver anúncios": use o **Plano B** (COMO-USAR.md): peça pro Miguel colar links ou textos de anúncios que ele achou em facebook.com/ads/library e analise esses.
3. **Completar a análise**: abra o `.md` e, pra cada anúncio, preencha **Oferta** (o que está sendo vendido e em que condição) e **Por que provavelmente funciona** (1–2 linhas: tipo de gancho, prova, urgência, dor, simplicidade do CTA). Se o texto estiver vazio (vídeo/imagem), diga que a leitura é limitada e abra o print pra descrever. Não invente métrica: a biblioteca não mostra vendas, só tempo no ar e versões (sinais, não prova).
4. **Resumo pro Miguel**: top 3–5 em 1 linha cada (anunciante, dias no ar, gancho) e o caminho do relatório.
5. **PARE e pergunte**: "Quais 1 a 3 criativos você quer que eu use de base pras variações? (números do relatório). Pra qual cliente/produto?" Só siga com a resposta dele.

## Passo 2 — Variações (só após confirmação)
Para cada criativo escolhido (1 a 3), gerar **5 variações originais** em `04-anuncios/variacoes/AAAA-MM-DD-nicho/variacoes-<n>.md`. Cada variação:
- **Ângulo** (ex.: dor, prova, curiosidade, urgência real, antes/depois, objeção) — as 5 devem usar ângulos diferentes entre si.
- **Gancho** (primeira frase, até ~12 palavras).
- **Copy curta** (texto principal 2–4 linhas + título até 40 caracteres + CTA sugerido do Meta, ex.: "Enviar mensagem").
- **Roteiro de vídeo vertical 9:16 de 15s**, cena a cena em tabela: `Tempo | Cena (o que aparece) | Legenda na tela | Fala/áudio`. Cenas curtas (2–4s), gancho nos 3 primeiros segundos, CTA nos últimos 3s. Só use cenas que um micro-empreendedor consegue gravar com celular.
- **Por que testar** (1 linha).

Regras de criação: texto 100% novo, nada de frase do anúncio original; sem promessa que não dá pra cumprir (resultado garantido, cura, ganho de dinheiro) nem desconto/prazo inventado — use `[PREENCHER]` onde depender de dado do cliente (preço, prazo, cidade). Evite as proibições da Meta (antes/depois de saúde exagerado, atributos pessoais tipo "você está acima do peso").

## Final
Entregue: caminho dos arquivos, as 5 ganchos num resumo, e lembre: **criar foi grátis; só custa quando publicar**, e o passo a passo está em `04-anuncios/checklist-publicacao.md`. Pergunte se quer ajuda pra montar a campanha, mas **não publique nada**.
