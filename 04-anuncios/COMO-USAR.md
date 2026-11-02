# Máquina de anúncio — como usar

Acha anúncios que **já estão rodando há tempo** no seu nicho e cria **5 variações originais** pra seus clientes testarem. **Nada é publicado sozinho e criar não custa nada.** Só custa dinheiro quando você sobe o anúncio no Meta (você decide o valor).

## 1) Instalar (só uma vez)
Precisa do [Node.js](https://nodejs.org) (grátis). Na pasta `04-anuncios`:
```bash
npm run instalar
```

## 2) Usar
No Claude Code, dentro do repositório, escreva:

> pesquisa anúncios de "chuteira society"

1. O Chrome abre sozinho na Biblioteca de Anúncios da Meta (é pública, **sem login**). Se aparecer aviso de cookies, feche ele na janela.
2. Sai o relatório em `04-anuncios/pesquisas/AAAA-MM-DD-nicho.md`: link, print, texto, gancho, oferta, botão e por que provavelmente funciona. Os mais antigos e com mais versões vêm primeiro (sinal de que vendem).
3. O Claude **para e pergunta** quais 1 a 3 você quer usar. Responda com os números. Diga também pra qual cliente/produto.
4. Ele gera 5 variações de cada em `04-anuncios/variacoes/`: gancho, copy curta e roteiro de vídeo de 15 segundos (cena por cena, com legenda na tela).

## 3) Publicar (aqui sim custa dinheiro)
Siga o `checklist-publicacao.md` (público, orçamento mínimo, como medir, quando pausar). **Só publique com o cliente aprovando o valor.**

## Plano B (se a pesquisa automática não abrir)
A Meta às vezes bloqueia ou muda a página. Aí:
1. Abra [facebook.com/ads/library](https://www.facebook.com/ads/library), escolha **Brasil**, **Todos os anúncios**, busque o nicho.
2. Copie o link (ou o texto) de 5–10 anúncios que estão há muito tempo no ar / têm "várias versões".
3. Cole no Claude: "analisa esses anúncios e vamos pras variações". Ele faz o resto.

## Regras que a gente segue
- Só informação pública do anúncio. Sem dados de pessoas.
- Os criativos dos outros servem **só de inspiração**: as variações são textos novos.
- Os prints ficam só no seu notebook (não vão pro GitHub).
- Nenhuma senha ou token. A pesquisa não entra em conta nenhuma.

## Rodar sem o Claude (opcional)
```bash
cd 04-anuncios
node pesquisar.js "palavra-chave" --pais BR --max 30
```
