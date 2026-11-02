#!/usr/bin/env python3
"""Organiza o 00-inbox do vault. Só biblioteca padrão do Python (grátis).

Passo 1 (sempre): notas com `tipo:` no topo são MOVIDAS para a pasta certa.
Passo 2 (--com-claude): o que sobrou é entregue ao Claude (skill segundo-cerebro),
que classifica, cria links [[...]] e registra tudo.

Nunca apaga nem sobrescreve. Tudo que muda vai para registro-organizacao.md.
"""
import argparse, datetime, shutil, subprocess, sys, unicodedata
from pathlib import Path

DESTINO = {
    "cliente": "02-clientes", "lead": "02-clientes",
    "projeto": "01-projetos",
    "reuniao": "04-diario", "diario": "04-diario",
    "ideia": "03-conhecimento", "conhecimento": "03-conhecimento",
}

PROMPT = (
    "Use a skill segundo-cerebro, modo B (organizar o inbox). Esvazie 00-inbox seguindo "
    "as regras: mover (nunca apagar/sobrescrever), criar links [[...]], registrar tudo em "
    "registro-organizacao.md. Na dúvida, deixe no inbox. Termine com um relatório curto."
)


def norm(s):
    s = unicodedata.normalize("NFKD", s.strip().lower())
    return "".join(c for c in s if not unicodedata.combining(c))


def ler_tipo(path):
    try:
        texto = path.read_text(encoding="utf-8-sig", errors="replace")
    except OSError:
        return None
    linhas = texto.replace("\r\n", "\n").split("\n")
    if not linhas or linhas[0].strip() != "---":
        return None
    for linha in linhas[1:]:
        if linha.strip() == "---":
            break
        if linha.lower().startswith("tipo:"):
            valor = norm(linha.split(":", 1)[1].split("|")[0])
            return valor or None
    return None


def livre(destino):
    if not destino.exists():
        return destino
    n = 2
    while True:
        novo = destino.with_name(f"{destino.stem}-{n}{destino.suffix}")
        if not novo.exists():
            return novo
        n += 1


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--vault", help="pasta do vault (padrão: a pasta acima de _rotina)")
    ap.add_argument("--simular", action="store_true", help="só mostra o que faria, não mexe em nada")
    ap.add_argument("--com-claude", action="store_true", help="depois das regras, chama o Claude para o que sobrou")
    a = ap.parse_args()

    vault = Path(a.vault).expanduser().resolve() if a.vault else Path(__file__).resolve().parent.parent
    inbox = vault / "00-inbox"
    if not inbox.is_dir():
        sys.exit(f"Não achei {inbox}. Aponte o vault com --vault.")

    agora = datetime.datetime.now().strftime("%Y-%m-%d %H:%M")
    movidas, ficaram = [], []
    for f in sorted(inbox.iterdir()):
        if not f.is_file() or f.name.startswith((".", "_")):
            continue
        if f.suffix.lower() != ".md":
            ficaram.append((f, "não é .md"))
            continue
        pasta = DESTINO.get(ler_tipo(f) or "")
        if not pasta:
            ficaram.append((f, "sem `tipo:` reconhecido"))
            continue
        destino = livre(vault / pasta / f.name)
        movidas.append((f, destino))
        if not a.simular:
            destino.parent.mkdir(exist_ok=True)
            shutil.move(str(f), str(destino))

    for src, dst in movidas:
        print(f"{'[simulação] ' if a.simular else ''}movida: {src.name} -> {dst.parent.name}/{dst.name}")
    for f, motivo in ficaram:
        print(f"ficou no inbox: {f.name} ({motivo})")
    if not movidas and not ficaram:
        print("Inbox vazio. Nada a fazer.")

    if movidas and not a.simular:
        with (vault / "registro-organizacao.md").open("a", encoding="utf-8") as r:
            if r.tell() == 0:
                r.write("# Registro de organização\n\nTudo que a rotina moveu ou mudou.\n\n")
            for src, dst in movidas:
                r.write(f"- {agora} · movida (regra): 00-inbox/{src.name} → {dst.parent.name}/{dst.name}\n")

    restantes = [f for f, _ in ficaram if f.suffix.lower() == ".md"]
    if a.com_claude and restantes and not a.simular:
        claude = shutil.which("claude")
        if not claude:
            print("Claude não encontrado no PATH; as notas acima ficam para você organizar depois.")
            return
        print("Chamando o Claude para organizar o que sobrou...")
        try:
            subprocess.run(
                [claude, "-p", PROMPT, "--allowedTools",
                 "Read,Edit,Write,Glob,Grep,Bash(mv *),Bash(move *),Bash(ls *),Bash(dir *)"],
                cwd=vault, timeout=1200, check=False)
        except (subprocess.TimeoutExpired, OSError) as e:
            print(f"Claude não terminou: {e}")


if __name__ == "__main__":
    main()
