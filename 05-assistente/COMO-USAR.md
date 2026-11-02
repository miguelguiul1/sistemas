# Assistente pessoal (resumo da manhã)

Todo dia às 7h chega no seu e-mail um resumo com:
📅 compromissos de hoje · ✅ tarefas de hoje/atrasadas · 📧 e-mails não lidos.

É grátis e roda no Google, sem PC ligado. Você faz isso **uma vez só**:

## Instalar (5 min)
1. Abra https://script.google.com e clique em **Novo projeto**.
2. Apague o código que aparece e cole o conteúdo de `Codigo.gs`.
3. Na engrenagem **Configurações do projeto**, marque **"Mostrar arquivo appsscript.json"**. Volte ao editor, abra o `appsscript.json` e cole o conteúdo do arquivo de mesmo nome daqui.
4. No topo, escolha a função **`instalar`** e clique em **Executar**.
5. O Google vai pedir permissão (Gmail, Agenda, Tarefas, enviar e-mail). Aceite — é só na sua conta. Se aparecer "app não verificado": **Avançado → Acessar (não seguro)**; o código é seu.
6. Pronto. O primeiro resumo chega agora, e depois todo dia às 7h.

## Ajustar
No começo do `Codigo.gs`, em `CONFIG`: mude a hora (`HORA`), quantos e-mails mostrar, etc. Depois rode `instalar` de novo.

## Testar / parar
- Receber agora: execute `enviarResumo`.
- Parar: no relógio (Acionadores) do Apps Script, apague o acionador.

## Obs.
- Usa a agenda principal e todas as listas do Google Tarefas.
- Nada de senha/token: o Google já sabe quem é você.
