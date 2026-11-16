# Bienes Raices

Sitio estatico con estilos SCSS y JavaScript. Las paginas HTML utilizan los
archivos compilados de `build/`.

```sh
npm ci
npm run build
npm test
```

Para desarrollar con recompilacion automatica: `npm run dev`.
Tambien se pueden ejecutar `npm run build:css`, `npm run build:js` y
`npm run build:images` por separado.

Editar estilos en `src/scss/` y scripts en `src/js/`, y recompilar antes de
publicar. Solo `src/scss/app.scss` genera CSS; los parciales se importan desde
esa entrada. Las conversiones de imagenes se guardan en cache para evitar
procesarlas nuevamente si no cambiaron. Los mapas de fuentes se generan junto
al CSS y JavaScript.

Las pruebas comprueban el menu movil y el tema oscuro tanto en el codigo fuente
como en el JavaScript compilado, incluyendo paginas sin controles y la API
antigua de preferencias del sistema.
