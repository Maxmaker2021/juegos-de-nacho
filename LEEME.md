# Juegos de Nacho: cómo publicarlo y moderarlo

## Qué hay en la carpeta

| Archivo | Para qué sirve |
|---|---|
| `index.html` + `juegos.js` | Portada, se arma sola desde `juegos.json` |
| `juegos.json` | Lista de juegos (nombre, descripción, archivo, estado) |
| `agregar-juego.py` | Comando para sumar, actualizar o quitar juegos |
| `juegos/botellitas.html` | Botellitas Saltarinas |
| `ideas.html` + `ideas.js` | Formulario con espacio para dibujar |
| `muro.html` + `muro.js` + `ideas.json` | Muro con las ideas que aprobás |
| `dibujos/` | Imágenes de los dibujos aprobados |
| `privacidad.html` | Texto de privacidad |

## 1. Publicar (Netlify, gratis)

El formulario necesita un servicio que reciba los envíos. Netlify lo trae incluido y acepta el dibujo como imagen.

1. Entrá a netlify.com con tu cuenta y creá un sitio nuevo arrastrando esta carpeta entera (o conectalo a un repositorio de GitHub).
2. En el sitio, andá a **Forms** y activá la detección de formularios si no está activa. Tiene que aparecer un formulario llamado **ideas**.
3. En **Forms > Form notifications** agregá tu mail para que te avise cada vez que llega una idea.
4. Verificá en Netlify los límites actuales de envíos del plan gratuito, porque pueden cambiar.
5. Abrí `privacidad.html` y reemplazá `[COMPLETAR: mail de contacto]` por un mail donde puedan pedirte borrar algo.

Si preferís otro hosting (GitHub Pages, Cloudflare Pages), la portada y los juegos funcionan igual, pero el formulario necesita otro servicio de envíos.

## 2. Moderar (nada se publica solo)

Todo lo que mandan los chicos llega a **Netlify > Forms > ideas** y a tu mail. No aparece en el sitio hasta que vos lo agregues.

1. Leé la idea y mirá el dibujo. Si tiene nombre real, escuela, teléfono, dirección o algo inapropiado, no la publiques (o sacá esos datos).
2. Si aprobás un dibujo, descargalo, ponele un nombre simple sin espacios (por ejemplo `sofi1.png`) y copialo a la carpeta `dibujos/`.
3. Agregá un bloque a `ideas.json` con este formato (hay un modelo en `ideas.ejemplo.json`):

```json
{
  "fecha": "2026-10-10",
  "tipo": "Una botella nueva",
  "juego": "Botellitas Saltarinas",
  "apodo": "Dragón veloz",
  "texto": "Una botella con alas.",
  "dibujo": "dibujos/sofi1.png",
  "respuesta": "¡Me encantó! La voy a probar."
}
```

4. Volvé a subir la carpeta a Netlify. La idea aparece en el muro.

`dibujo` y `respuesta` son opcionales. El muro muestra primero lo último que agregaste.

## 3. Sumar, actualizar o quitar un juego

La portada y el formulario leen la lista de `juegos.json`, así que **no hace falta tocar `index.html`**.

**Con un comando** (necesitás Python 3, parado en esta carpeta):

```
python3 agregar-juego.py mi-juego.html --nombre "Gomera Loca" --descripcion "Una gomera contra pollos voladores" --icono gomera
```

- Copia el juego a `juegos/`, le agrega un botón para volver a la portada y lo suma a `juegos.json`.
- Si el nombre ya existe (por ejemplo "Gomera Loca", que hoy figura como próximamente), lo convierte en juego jugable.
- Para subir una versión nueva, corré el mismo comando con el archivo nuevo.
- Otros usos: `--proximamente` (solo la tarjeta), `--quitar gomera-loca`, `--lista`.
- Íconos disponibles: botella, gomera, penal, golf, joystick.

Después volvé a subir la carpeta a Netlify, o solo `juegos.json` y el archivo de `juegos/` que cambió.

**Sin compu ni comandos** (por ejemplo, desde el celular con el sitio conectado a GitHub):

1. Subí el `.html` del juego a la carpeta `juegos/`.
2. Abrí `juegos.json`, tocá el lápiz y agregá un bloque como este (cuidá las comas):

```json
{
  "id": "mi-juego",
  "nombre": "Mi Juego",
  "descripcion": "Una frase corta.",
  "archivo": "juegos/mi-juego.html",
  "estado": "jugable",
  "icono": "joystick"
}
```

3. Guardá. Netlify publica solo los cambios.

Reglas del archivo del juego: tiene que ser una sola página `.html` y quedar dentro de `juegos/`. Si lo subís a mano, agregale un link a `../index.html` para volver.

## 4. Antes de abrirlo al público

- Probá vos el formulario de punta a punta: mandá una idea con dibujo y verificá que llegue.
- Mirá el sitio desde un celular.
- Si algún día aceptás comentarios libres sin moderación, cambiá la página de privacidad, porque ya no sería cierto lo que dice.
- Los datos y la privacidad de menores tienen reglas distintas según el país. Esto es una base prudente (sin cuentas, sin anuncios, sin datos personales, con revisión humana), pero no es asesoramiento legal.
