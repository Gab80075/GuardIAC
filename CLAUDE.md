# CLAUDE.md

Instrucciones de proyecto para Claude Code en **GuardIAC** (generador de políticas de privacidad, React + Express + esbuild).

## Sobre el proyecto

- `App.tsx`, `components/`, `services/`, `constants.ts`, `types.ts`: frontend React/TypeScript.
- `server.js`: servidor Express (sirve la app en producción).
- `esbuild.config.js` / `vite.config.ts`: build.
- Requiere `GEMINI_API_KEY` en `.env.local` para correr en local (`npm install`, `npm run dev`).
- Deploy: `npm run build && gcloud app deploy` (App Engine, ver `app.yaml`).

## Reparto con Codex

- Planificar y decidir: Claude. Antes de escribir código, plan corto y aprobación.
- Escribir código de más de un archivo: delegar a Codex con `/codex:rescue`,
  con el plan ya aprobado adentro del pedido.
- Revisar: lo hace el que no escribió. Si el código salió de Codex, lo reviso yo.
  Si lo escribí yo, corre `/codex:adversarial-review`.
- Nada se da por terminado sin que yo lea el cambio.
- Si Codex y Claude no coinciden, gana el que muestre el error reproducido,
  no el que argumente mejor.

### Cómo delegar

```
/codex:rescue Implementa <lo que hay que hacer>.
El plan aprobado es <pega el plan acá>.
No toques <lo que no se toca>.
Cuando termines, listame los archivos que tocaste y qué quedó sin resolver.
```

### Setup (una sola vez, en la máquina del usuario)

```
npm install -g @openai/codex
codex login
```

En Claude Code:

```
/plugin marketplace add openai/codex-plugin-cc
/plugin install codex@openai-codex
/codex:setup
```

Portón de revisión opcional (Codex revisa antes de devolver el turno cuando hubo cambios de código):

```
/codex:setup --enable-review-gate
```

Se apaga con `/codex:setup --disable-review-gate`.
