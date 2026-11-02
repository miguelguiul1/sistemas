---
tipo: conhecimento
criado: 2026-11-02
---
# Instruções para o Claude usar este vault

Este vault é o segundo cérebro do Miguel (agência de marketing: clientes, campanhas, criativos, resultados, edição e sites). Tudo é arquivo `.md`. A raiz do vault é a pasta onde este arquivo está.

## Estrutura

| Pasta | O que vai aqui |
|---|---|
| `00-inbox` | Qualquer coisa solta, sem organizar. O Claude esvazia isto. |
| `01-projetos` | Projetos e campanhas com começo e fim (site, lançamento, campanha). |
| `02-clientes` | Uma nota por cliente ou lead (contato, combinados, histórico). |
| `03-conhecimento` | Processos, scripts, objeções, FAQ, aprendizados, ideias e referências. |
| `04-diario` | Reuniões e registros por data. |
| `05-modelos` | Modelos de nota. Não mexer; não buscar respostas aqui. |

Arquivos que começam com `_` e a pasta `_rotina` são do sistema: ignore nas buscas.

## Padrão das notas

Toda nota começa com um bloco assim:

```
---
tipo: cliente | lead | projeto | reuniao | ideia | conhecimento | diario
criado: AAAA-MM-DD
tags: []
---
```

Links entre notas usam `[[Nome da Nota]]` (nome do arquivo sem `.md`). Cliente tem nota com o nome dele (`02-clientes/Nome do Cliente.md`); reunião se chama `AAAA-MM-DD Assunto - Cliente.md`.

## Como buscar (responder perguntas)

1. Busque pelo nome (Glob) e pelo conteúdo (Grep, sem diferenciar maiúsculas/minúsculas e testando sinônimos e variações de acento) em todas as pastas, menos `05-modelos` e `_rotina`.
2. Leia as notas encontradas inteiras, não só o trecho.
3. Siga os `[[links]]` das notas mais relevantes (1 nível) para completar a resposta.
4. Se duas notas se contradizem, vale a de data mais recente (`criado`/nome do arquivo); avise que há conflito.

## Como citar

- Toda resposta termina com **Fontes:** e a lista de notas usadas, no formato `[[Nome da Nota]]` (com a pasta se houver nomes repetidos).
- Fatos importantes (valores, datas, prazos, decisões) levam a nota ao lado: "…fechou em R$ 3.000/mês ([[Cliente X]])".
- Separe o que veio do vault do que é conhecimento geral seu, dizendo qual é qual.

## Quando não achar nada

- Diga claramente: "Não achei isso no seu vault." Nunca invente dado de cliente, valor ou data.
- Diga o que buscou (termos e pastas), para ele confiar que foi procurado.
- Sugira o próximo passo: perguntar a informação a ele e, se ele responder, salvar numa nota nova no inbox.
- Se achar algo parecido mas não exato, mostre como "parecido", com a nota citada.

## Regras de segurança (sempre)

- **Nunca apagar nem sobrescrever** nota existente. Reorganizar = **mover**, e toda mudança vai para `registro-organizacao.md`.
- Em nota existente, só **acrescentar** (frontmatter faltando no topo, seção `## Relacionado` no fim). Não reescrever o texto do Miguel.
- Nome já existe no destino? Acrescente `-2`, `-3`… ao nome. Não sobrescreva.
- Na dúvida sobre onde algo vai, deixe no inbox e avise.
- **Senhas, tokens e dados de cartão não ficam no vault.** Se aparecerem numa nota, avise o Miguel e não copie para outras notas.
- Não publicar, enviar ou gastar dinheiro sem confirmação.
