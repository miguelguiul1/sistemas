#!/usr/bin/env python3
"""Agenda a organização do inbox todo dia (Windows, Mac e Linux). Grátis, sem serviço externo.

  python agendar.py                 # todo dia às 08:00
  python agendar.py --hora 18:30    # outro horário
  python agendar.py --remover       # desliga
  python agendar.py --simular       # só mostra o comando
"""
import argparse, os, platform, re, shlex, subprocess, sys
from pathlib import Path

NOME = "SegundoCerebroInbox"
MARCA = "# segundo-cerebro-inbox"


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--hora", default="08:00", help="HH:MM (padrão 08:00)")
    ap.add_argument("--remover", action="store_true")
    ap.add_argument("--simular", action="store_true")
    ap.add_argument("--sem-claude", action="store_true", help="só regras, sem chamar o Claude")
    a = ap.parse_args()

    m = re.fullmatch(r"([01]?\d|2[0-3]):([0-5]\d)", a.hora)
    if not m:
        sys.exit("Hora inválida. Use HH:MM, ex.: 08:00")
    h, mi = int(m[1]), int(m[2])

    script = Path(__file__).resolve().parent / "organizar_inbox.py"
    args = [sys.executable, str(script)] + ([] if a.sem_claude else ["--com-claude"])
    log = script.parent / "ultima-execucao.log"

    if platform.system() == "Windows":
        if a.remover:
            cmd = ["schtasks", "/Delete", "/TN", NOME, "/F"]
        else:
            tr = subprocess.list2cmdline(args)
            cmd = ["schtasks", "/Create", "/SC", "DAILY", "/TN", NOME, "/TR", tr, "/ST", f"{h:02d}:{mi:02d}", "/F"]
        print(" ".join(cmd))
        if not a.simular:
            sys.exit(subprocess.run(cmd).returncode)
        return

    # Mac / Linux: cron
    try:
        atual = subprocess.run(["crontab", "-l"], capture_output=True, text=True)
        saida = atual.stdout if atual.returncode == 0 else ""
    except FileNotFoundError:
        if not a.simular:
            sys.exit("Este computador não tem o 'crontab'. Me chame no Claude que eu monto outro jeito.")
        saida = ""
    linhas = [l for l in saida.splitlines() if MARCA not in l]
    if not a.remover:
        path = os.environ.get("PATH", "")
        comando = f"{mi} {h} * * * PATH={shlex.quote(path)} {' '.join(shlex.quote(x) for x in args)} >> {shlex.quote(str(log))} 2>&1 {MARCA}"
        linhas.append(comando)
    novo = "\n".join(linhas) + ("\n" if linhas else "")
    print(("Removendo agendamento." if a.remover else "Agendando:") + "\n" + novo)
    if not a.simular:
        r = subprocess.run(["crontab", "-"], input=novo, text=True)
        sys.exit(r.returncode)


if __name__ == "__main__":
    main()
