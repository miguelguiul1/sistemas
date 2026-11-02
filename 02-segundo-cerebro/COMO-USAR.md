# Segundo cérebro

Tudo que você e a agência sabem num lugar só. Você joga as coisas num lugar (o **inbox**) e pergunta; o Claude organiza e responde dizendo **de qual nota veio**.

## 1. Instalar o Obsidian (1 vez, grátis)
1. Entre em https://obsidian.md → **Download** → instale como qualquer programa.

## 2. Colocar o vault no seu notebook
1. Copie a pasta `02-segundo-cerebro/vault` para **Documentos** e renomeie para `SegundoCerebro`.
   (Fica fora do repositório de propósito: seus clientes não vão pro GitHub.)
2. Abra o Obsidian → **Abrir pasta como cofre** (*Open folder as vault*) → escolha `Documentos/SegundoCerebro`.
3. Se pedir, clique em **Confiar nos autores** (*Trust*).

## 3. Usar no dia a dia
- **Guardar algo:** crie uma nota nova (`Ctrl+N`, no Mac `Cmd+N`) e cole o que quiser. Ela cai sozinha no `00-inbox`. Não precisa organizar.
- **Usar um modelo** (cliente, projeto, reunião, ideia): `Ctrl+P` → digite **Inserir modelo**.

## 4. Falar com o Claude sobre o vault
1. Abra o terminal **dentro da pasta** `Documentos/SegundoCerebro` e rode `claude`.
   (O Claude já lê as regras sozinho, é assim que ele "aponta" pro vault.)
2. Exemplos do que pedir:
   - **Perguntar:** "O que combinamos com a cliente Maria sobre os criativos?"
   - **Organizar:** "Organiza meu inbox."
   - **Virar nota:** "Transforma isto em nota de reunião: (cole a transcrição)"
3. Ele sempre fecha a resposta com **Fontes: [[nota]]**. Se não achar, ele diz que não achou (não inventa).

## 5. Organização automática (1 vez)
Precisa do Python (grátis, https://python.org). No terminal, na pasta `SegundoCerebro`:
```
python _rotina/agendar.py
```
Pronto: todo dia às 08:00 o inbox é organizado (notebook ligado). Outro horário: `python _rotina/agendar.py --hora 18:30`. Desligar: `python _rotina/agendar.py --remover`.

- Notas com `tipo:` no topo são movidas na hora; as sem tipo o Claude organiza (usa seu plano do Claude, sem custo extra).
- Para rodar agora: `python _rotina/organizar_inbox.py` (ou `--simular` para só ver o que faria).

## Segurança
Nada é apagado nem sobrescrito: só movido. Tudo que mudou fica listado em `registro-organizacao.md`. **Não guarde senhas** nas notas.
