# Bibliotecas de terceiros (vendorizadas para funcionar offline)

| Biblioteca | Versão | Licença | Arquivo |
|---|---|---|---|
| three.js (+ OrbitControls, CSS2DRenderer, RoundedBoxGeometry, BufferGeometryUtils) | 0.180.0 | MIT | `three.bundle.min.js` (empacotado com esbuild em IIFE, expõe `window.THREE`) — `licenses/three-MIT.txt` |
| Leaflet | 1.9.4 | BSD-2-Clause | `leaflet/` — `licenses/leaflet-BSD-2.txt` |
| Chart.js | 4.5.1 | MIT | `chart.umd.min.js` — `licenses/chartjs-MIT.md` |
| D3 | 7.9.0 | ISC | `d3.min.js` — `licenses/d3-ISC.txt` |
| Atkinson Hyperlegible Next (Braille Institute, via Fontsource) | 5.3.0 | SIL Open Font License 1.1 | `fonts/` — `fonts/OFL-atkinson-hyperlegible-next.txt` |

## Dados geográficos
| Dado | Fonte | Licença |
|---|---|---|
| Terra e países (1:110m e 1:50m) | Natural Earth — https://www.naturalearthdata.com/ | Domínio público |
| Malha dos estados do Brasil | IBGE, API de Malhas v3 — https://servicodados.ibge.gov.br/api/docs/malhas?versao=3 | Dados públicos do IBGE (citar a fonte) |
| Mapa online opcional | © colaboradores do OpenStreetMap — https://www.openstreetmap.org/copyright | ODbL (tiles carregados só quando há internet) |

Como reconstruir o pacote do Three.js: veja `tools/vendor/README.md`.
