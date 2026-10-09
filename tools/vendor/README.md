# Reconstruir as bibliotecas vendorizadas

```bash
mkdir /tmp/vendorbuild && cd /tmp/vendorbuild && npm init -y
npm install three@0.180.0 leaflet@1.9.4 chart.js@4.5.1 d3@7.9.0 esbuild@0.25.10 @fontsource-variable/atkinson-hyperlegible-next@5.3.0
cp <repo>/tools/vendor/three-entry.js src/three-entry.js
npx esbuild src/three-entry.js --bundle --minify --format=iife --legal-comments=eof --outfile=<repo>/app/assets/vendor/three.bundle.min.js
cp node_modules/leaflet/dist/{leaflet.js,leaflet.css} <repo>/app/assets/vendor/leaflet/ && cp -r node_modules/leaflet/dist/images <repo>/app/assets/vendor/leaflet/
cp node_modules/chart.js/dist/chart.umd.min.js node_modules/d3/dist/d3.min.js <repo>/app/assets/vendor/
cp node_modules/@fontsource-variable/atkinson-hyperlegible-next/files/*latin*-wght-*.woff2 <repo>/app/assets/vendor/fonts/
```
