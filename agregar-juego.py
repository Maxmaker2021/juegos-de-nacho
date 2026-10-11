#!/usr/bin/env python3
"""Agrega, actualiza o quita juegos del sitio Juegos de Nacho.

Ejemplos (parado en esta carpeta):

  python3 agregar-juego.py mi-juego.html --nombre "Gomera Loca" --descripcion "Gomera contra pollos"
  python3 agregar-juego.py nueva-version.html --nombre "Gomera Loca"      (actualiza el juego)
  python3 agregar-juego.py --nombre "Juego Secreto" --proximamente         (solo la tarjeta)
  python3 agregar-juego.py --quitar gomera-loca
  python3 agregar-juego.py --lista

Después de correrlo, volvé a subir la carpeta al hosting (o los archivos que cambiaron).
"""
import argparse
import json
import os
import re
import sys
import unicodedata

AQUI = os.path.dirname(os.path.abspath(__file__))
JSON_PATH = os.path.join(AQUI, "juegos.json")
CARPETA = os.path.join(AQUI, "juegos")
ICONOS = ["botella", "gomera", "penal", "golf", "joystick"]

RESET = ('<style>html{padding:env(safe-area-inset-top,0px) 0 env(safe-area-inset-bottom,0px)}'
         'body{margin:0}[hidden]{display:none!important}img{max-width:100%}</style>')
VOLVER = ('<a data-volver href="../index.html" style="position:fixed;top:calc(8px + env(safe-area-inset-top,0px));'
          'left:8px;z-index:2147483000;background:rgba(16,34,45,.78);color:#fff;'
          'font:800 12px/1 system-ui,sans-serif;padding:7px 11px;border-radius:999px;'
          'text-decoration:none">&#8249; Juegos de Nacho</a>')


def slug(texto):
    t = unicodedata.normalize("NFKD", texto).encode("ascii", "ignore").decode()
    t = re.sub(r"[^a-zA-Z0-9]+", "-", t).strip("-").lower()
    return t or "juego"


def cargar():
    if not os.path.exists(JSON_PATH):
        return []
    with open(JSON_PATH, encoding="utf-8") as f:
        datos = json.load(f)
    if not isinstance(datos, list):
        sys.exit("juegos.json tiene que ser una lista.")
    return datos


def guardar(lista):
    with open(JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(lista, f, ensure_ascii=False, indent=2)
        f.write("\n")


def preparar(html):
    """Deja el HTML listo para publicarse como página suelta y con link de vuelta a la portada."""
    if not re.search(r"<html", html, re.I):
        html = ('<!doctype html>\n<html lang="es">\n<head>\n<meta charset="utf-8">\n'
                '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
                + RESET + '\n</head>\n<body>\n' + html + '\n</body>\n</html>\n')
    elif not re.search(r'name=["\']viewport["\']', html, re.I):
        html = re.sub(r"<head[^>]*>", lambda m: m.group(0) + '\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">', html, count=1, flags=re.I)
    if "Juegos de Nacho" not in html and "data-volver" not in html:
        if re.search(r"</body>", html, re.I):
            html = re.sub(r"</body>", VOLVER + "\n</body>", html, count=1, flags=re.I)
        else:
            html += "\n" + VOLVER + "\n"
    return html


def buscar(lista, ident, nombre):
    for i, g in enumerate(lista):
        if ident and g.get("id") == ident:
            return i
        if nombre and (g.get("id") == slug(nombre) or slug(g.get("nombre", "")) == slug(nombre)):
            return i
    return -1


def main():
    ap = argparse.ArgumentParser(description="Agrega, actualiza o quita juegos del sitio.")
    ap.add_argument("archivo", nargs="?", help="archivo .html del juego")
    ap.add_argument("--nombre", help="nombre que se ve en la portada")
    ap.add_argument("--descripcion", help="una o dos frases cortas")
    ap.add_argument("--icono", choices=ICONOS, help="dibujo de la tarjeta: " + ", ".join(ICONOS))
    ap.add_argument("--id", help="identificador (por defecto, sale del nombre)")
    ap.add_argument("--proximamente", action="store_true", help="mostrarlo como 'Próximamente'")
    ap.add_argument("--quitar", metavar="ID", help="saca un juego de la portada")
    ap.add_argument("--lista", action="store_true", help="muestra los juegos cargados")
    a = ap.parse_args()

    lista = cargar()

    if a.lista:
        for g in lista:
            print("%-22s %-14s %s" % (g.get("id"), g.get("estado"), g.get("archivo") or "-"))
        return

    if a.quitar:
        n = [g for g in lista if g.get("id") != a.quitar]
        if len(n) == len(lista):
            sys.exit("No encontré un juego con id '%s'. Probá con --lista." % a.quitar)
        guardar(n)
        print("Listo, '%s' ya no aparece en la portada. Su archivo sigue en juegos/ por si lo querés borrar." % a.quitar)
        return

    nombre = a.nombre
    if not nombre and a.archivo:
        nombre = os.path.splitext(os.path.basename(a.archivo))[0].replace("-", " ").replace("_", " ").title()
    if not nombre:
        sys.exit("Falta el juego. Ejemplo: python3 agregar-juego.py mi-juego.html --nombre \"Mi Juego\"")

    i = buscar(lista, a.id, nombre)
    previo = lista[i] if i >= 0 else {}
    ident = a.id or previo.get("id") or slug(nombre)
    entrada = dict(previo)
    entrada["id"] = ident
    entrada["nombre"] = a.nombre or previo.get("nombre") or nombre
    entrada["descripcion"] = a.descripcion if a.descripcion is not None else previo.get("descripcion", "")
    entrada["icono"] = a.icono or previo.get("icono") or "joystick"
    entrada["archivo"] = previo.get("archivo", "")

    subidos = []
    if a.archivo:
        if not os.path.isfile(a.archivo):
            sys.exit("No encuentro el archivo '%s'." % a.archivo)
        with open(a.archivo, encoding="utf-8") as f:
            html = preparar(f.read())
        destino = entrada["archivo"] or "juegos/%s.html" % ident
        os.makedirs(CARPETA, exist_ok=True)
        with open(os.path.join(AQUI, destino), "w", encoding="utf-8") as f:
            f.write(html)
        entrada["archivo"] = destino
        subidos.append(destino)

    if a.proximamente or not entrada["archivo"]:
        entrada["estado"] = "proximamente"
    else:
        entrada["estado"] = "jugable"

    if i >= 0:
        lista[i] = entrada
    else:
        lista.append(entrada)
    guardar(lista)

    print("Listo: '%s' (%s)." % (entrada["nombre"], entrada["estado"]))
    print("Volvé a subir al sitio: juegos.json" + "".join(", " + s for s in subidos))


if __name__ == "__main__":
    main()
