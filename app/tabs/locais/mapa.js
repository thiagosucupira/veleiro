/* Aba "Onde estudar e praticar" — parte 2: o mapa (Leaflet).
   Base 100% offline: terra (Natural Earth 50m) e divisas dos estados (IBGE) desenhadas como GeoJSON nos tokens do tema.
   O mapa detalhado do OpenStreetMap só é criado quando o usuário liga a chave; por padrão não há nenhuma requisição externa.
   Agrupamento por proximidade feito aqui mesmo (sem plugin): células de TAM pixels na projeção do zoom atual. */
(function () {
  'use strict';
  var D = VL.locais;
  var TAM = 54;               // lado da célula de agrupamento, em pixels
  var ZOOM_MAX_OFFLINE = 12;
  var ZOOM_MAX_OSM = 18;
  var BRASIL = [[-33.9, -74.2], [5.4, -34.6]];
  var URL_OSM = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';

  function reduzMovimento() { return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches); }

  /**
   * D.criarMapa(el, o) → Promise do controle.
   * o: { popup(reg) → Node, aoAbrir(reg|null), aoMover(), selecionados() → [ids de grupo], aoOsm(ligado) }
   * controle: { definir(regs), abrir(reg, {voar}), fechar(), ajustar(regs, extras), usuario(pos|null), osm(bool),
   *             limites() → {norte, sul, leste, oeste}, destruir(), mapa }
   */
  D.criarMapa = function (el, o) {
    return Promise.all([
      VL.libs.leaflet(),
      VL.load(['data/geo/world_land_50m.js', 'data/geo/br_uf.js']),
    ]).then(function (res) {
      var Lf = res[0];
      var regs = [];
      var marcadores = Lf.layerGroup();
      var popupAtual = null, regAberto = null;
      var viva = true;

      var mapa = Lf.map(el, {
        zoomControl: false, minZoom: 2, maxZoom: ZOOM_MAX_OFFLINE, zoomSnap: 0.5, zoomDelta: 1, preferCanvas: true, attributionControl: false,
        maxBounds: [[-75, -190], [84, 190]], maxBoundsViscosity: 0.8, worldCopyJump: false,
      });
      /* Celular (ponteiro grosso): um dedo rola a página; mover o mapa pede dois dedos (o pinça-e-arrasta do Leaflet já
         move e aproxima com dois dedos). Um aviso curto aparece quando alguém tenta arrastar com um dedo só. */
      var avisoGesto = null, avisoT = 0;
      if (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) {
        mapa.dragging.disable();
        avisoGesto = document.createElement('div');
        avisoGesto.className = 'loc-gesto-aviso';
        avisoGesto.setAttribute('aria-hidden', 'true');
        avisoGesto.textContent = 'Use dois dedos para mover o mapa';
        el.appendChild(avisoGesto);
        el.addEventListener('touchmove', function (ev) {
          if (ev.touches.length !== 1) { avisoGesto.classList.remove('loc-gesto-on'); return; }
          avisoGesto.classList.add('loc-gesto-on');
          clearTimeout(avisoT);
          avisoT = setTimeout(function () { avisoGesto.classList.remove('loc-gesto-on'); }, 1400);
        }, { passive: true });
      }
      el.setAttribute('role', 'region');
      el.setAttribute('aria-label', 'Mapa dos locais. A lista ao lado traz as mesmas informações em texto.');
      mapa.createPane('base').style.zIndex = 150;
      mapa.createPane('rotulos').style.zIndex = 250;
      mapa.getPane('rotulos').style.pointerEvents = 'none';
      mapa.getPane('base').style.pointerEvents = 'none';

      /* ---- base offline ---- */
      function cor(v) { return VL.cssVar(v) || '#888'; }
      function estiloTerra() { return { pane: 'base', fillColor: cor('--land'), fillOpacity: 1, color: cor('--land-ink'), weight: 0.6, opacity: 0.55, interactive: false }; }
      function estiloUF() { return { pane: 'base', fill: false, color: cor('--line'), weight: 1, opacity: 1, interactive: false }; }
      ['base', 'rotulos'].forEach(function (pn) { var pe = mapa.getPane(pn); if (pe) pe.setAttribute('aria-hidden', 'true'); });
      var terra = Lf.geoJSON(VL.geo.land50m, { style: estiloTerra, pane: 'base', interactive: false }).addTo(mapa);
      var ufs = Lf.geoJSON(VL.geo.brUF, { style: estiloUF, pane: 'base', interactive: false }).addTo(mapa);
      /* siglas das UFs (aparecem a partir do zoom 5) */
      var rotulosUF = Lf.layerGroup().addTo(mapa);
      ufs.eachLayer(function (l) {
        var f = l.feature && l.feature.properties;
        if (!f || !f.uf) return;
        var c = l.getBounds().getCenter();
        Lf.marker(c, { pane: 'rotulos', interactive: false, keyboard: false, icon: Lf.divIcon({ className: 'loc-uf', html: VL.esc(f.uf), iconSize: [30, 14], iconAnchor: [15, 7] }) }).addTo(rotulosUF);
      });
      function aplicarTema() {
        terra.setStyle(estiloTerra()); ufs.setStyle(estiloUF());
        el.classList.toggle('loc-escuro', VL.settings.temaEscuro());
      }
      aplicarTema();
      var offTema = VL.on('tema', aplicarTema);

      Lf.control.zoom({ position: 'topleft', zoomInTitle: 'Aproximar', zoomOutTitle: 'Afastar' }).addTo(mapa);
      var atrib = Lf.control.attribution({ prefix: 'Leaflet', position: 'bottomright' }).addTo(mapa);
      atrib.addAttribution('Terra: Natural Earth · Estados: IBGE');
      marcadores.addTo(mapa);

      function rotulosVisiveis() { el.classList.toggle('loc-zoom-uf', mapa.getZoom() >= 5); }

      /* ---- ícones ---- */
      function iconePino(r) {
        var g = D.grupoDoMarcador(r, o.selecionados ? o.selecionados() : []);
        var html = '<span class="loc-pin loc-c' + g.cor + '">' + D.glifo(g.icone, 17) + '</span>';
        return Lf.divIcon({ className: 'loc-ico', html: html, iconSize: [34, 34], iconAnchor: [17, 17] });
      }
      function iconeCluster(n) {
        var t = n < 10 ? 38 : (n < 100 ? 44 : 50);
        return Lf.divIcon({ className: 'loc-ico', html: '<span class="loc-cluster" style="width:' + t + 'px;height:' + t + 'px">' + n + '</span>', iconSize: [t, t], iconAnchor: [t / 2, t / 2] });
      }

      /* ---- popups ---- */
      function fecharPopup() { if (popupAtual) { mapa.closePopup(popupAtual); popupAtual = null; } }
      function abrirPopupDe(r) {
        fecharPopup();
        regAberto = r;
        /* em mapa estreito (celular) o balão não pode ficar por baixo dos botões de zoom, à esquerda */
        var estreito = el.clientWidth < 520;
        var largura = Math.max(220, Math.min(340, el.clientWidth - (estreito ? 92 : 48)));
        popupAtual = Lf.popup({ maxWidth: largura, minWidth: Math.min(220, largura), maxHeight: Math.max(220, Math.min(460, el.clientHeight - 60)),
          autoPanPaddingTopLeft: [estreito ? 60 : 28, 28], autoPanPaddingBottomRight: [20, 28], offset: [0, -14], className: 'loc-popup', closeButton: true })
          .setLatLng([r.lat, r.lon]).setContent(o.popup(r)).openOn(mapa);
        if (o.aoAbrir) o.aoAbrir(r);
      }
      mapa.on('popupclose', function (e) {
        if (e.popup === popupAtual) { popupAtual = null; regAberto = null; if (o.aoAbrir) o.aoAbrir(null); }
      });

      function popupGrupo(lista, ll) {
        fecharPopup();
        var caixa = VL.h('div', { class: 'loc-pop-grupo' },
          VL.h('p', { class: 'loc-pop-grupo-t' }, lista.length + ' locais neste ponto'),
          VL.h('ul', null, lista.slice().sort(function (a, b) { return a.nomeOrd < b.nomeOrd ? -1 : 1; }).map(function (r) {
            return VL.h('li', null, VL.h('button', { type: 'button', class: 'loc-pop-grupo-b', onclick: function () { abrirPopupDe(r); } }, r.d.nome));
          })));
        popupAtual = Lf.popup({ maxWidth: 320, maxHeight: 320, className: 'loc-popup', offset: [0, -14] }).setLatLng(ll).setContent(caixa).openOn(mapa);
        regAberto = null;
      }

      /* ---- desenhar marcadores com agrupamento ---- */
      function desenhar() {
        if (!viva) return;
        marcadores.clearLayers();
        var z = mapa.getZoom(), celulas = {};
        regs.forEach(function (r) {
          if (!r.mapa) return;
          var p = mapa.project([r.lat, r.lon], z);
          var k = Math.floor(p.x / TAM) + ':' + Math.floor(p.y / TAM);
          (celulas[k] = celulas[k] || []).push(r);
        });
        Object.keys(celulas).forEach(function (k) {
          var arr = celulas[k];
          if (arr.length === 1) {
            var r = arr[0];
            Lf.marker([r.lat, r.lon], { icon: iconePino(r), title: r.d.nome, alt: r.d.nome, riseOnHover: true, keyboard: true })
              .on('click', function () { abrirPopupDe(r); }).addTo(marcadores);
            return;
          }
          var la = 0, lo = 0;
          arr.forEach(function (r) { la += r.lat; lo += r.lon; });
          var centro = [la / arr.length, lo / arr.length];
          var rotulo = arr.length + ' locais agrupados. Toque para aproximar.';
          Lf.marker(centro, { icon: iconeCluster(arr.length), title: rotulo, alt: rotulo, keyboard: true }).on('click', function () {
            var b = Lf.latLngBounds(arr.map(function (r) { return [r.lat, r.lon]; }));
            var igual = b.getNorthEast().distanceTo(b.getSouthWest()) < 30;
            if (igual || mapa.getZoom() >= mapa.getMaxZoom()) { popupGrupo(arr, centro); return; }
            mapa.fitBounds(b, { padding: [60, 60], maxZoom: mapa.getMaxZoom(), animate: !reduzMovimento() });
          }).addTo(marcadores);
        });
      }

      var temporizador = null, pendente = null;
      function aoMovimento() {
        rotulosVisiveis();
        desenhar();
        if (o.aoMover) { clearTimeout(temporizador); temporizador = setTimeout(function () { if (viva) o.aoMover(); }, 140); }
      }
      mapa.on('moveend zoomend', aoMovimento);

      /* ---- posição do usuário ---- */
      var voce = null;
      function usuario(pos) {
        if (voce) { mapa.removeLayer(voce); voce = null; }
        if (!pos) return;
        voce = Lf.marker([pos.lat, pos.lon], { icon: Lf.divIcon({ className: 'loc-ico', html: '<span class="loc-voce" role="img" aria-label="Sua posição aproximada"></span>', iconSize: [22, 22], iconAnchor: [11, 11] }), keyboard: false, zIndexOffset: 800, title: 'Sua posição (aproximada)' }).addTo(mapa);
      }

      /* ---- ajuste de enquadramento ---- */
      function enquadrar(pontos, opc) {
        mapa.invalidateSize();
        opc = opc || {};
        var anim = !reduzMovimento() && opc.animar !== false;
        if (!pontos.length) { mapa.fitBounds(BRASIL, { padding: [10, 10], animate: anim }); return; }
        if (pontos.length === 1) { mapa.setView(pontos[0], Math.min(opc.zoomUnico || 11, mapa.getMaxZoom()), { animate: anim }); return; }
        mapa.fitBounds(Lf.latLngBounds(pontos), { padding: [44, 44], maxZoom: opc.maxZoom || 9, animate: anim });
      }

      /* ---- mapa detalhado (OpenStreetMap), só sob pedido ---- */
      var tiles = null, erros = 0, carregou = 0;
      function osm(ligar) {
        if (ligar && !tiles) {
          erros = 0; carregou = 0;
          tiles = Lf.tileLayer(URL_OSM, {
            maxZoom: 19, referrerPolicy: 'strict-origin-when-cross-origin', crossOrigin: false,
            attribution: '© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>',
          });
          tiles.on('tileload', function () { carregou++; });
          tiles.on('tileerror', function () {
            erros++;
            if (erros >= 4 && !carregou) {
              osm(false);
              VL.ui.toast('Não foi possível carregar o mapa detalhado. Sem internet? Voltamos ao mapa offline.', 5000);
              if (o.aoOsm) o.aoOsm(false);
            }
          });
          tiles.addTo(mapa);
          mapa.setMaxZoom(ZOOM_MAX_OSM);
          el.classList.add('loc-com-osm');
        } else if (!ligar && tiles) {
          mapa.removeLayer(tiles); tiles = null;
          el.classList.remove('loc-com-osm');
          mapa.setMaxZoom(ZOOM_MAX_OFFLINE);
          if (mapa.getZoom() > ZOOM_MAX_OFFLINE) mapa.setZoom(ZOOM_MAX_OFFLINE);
        }
      }

      /* ---- tamanho ---- */
      var ro = null;
      if (window.ResizeObserver) { ro = new ResizeObserver(function () { if (viva) mapa.invalidateSize({ pan: false }); }); ro.observe(el); }

      rotulosVisiveis();
      mapa.fitBounds(BRASIL, { animate: false });

      return {
        mapa: mapa,
        definir: function (lista) { regs = lista; if (regAberto && lista.indexOf(regAberto) < 0) fecharPopup(); desenhar(); },
        redesenhar: desenhar,
        abrir: function (r, opc) {
          if (!r.mapa) return;
          var alvo = [r.lat, r.lon];
          var voar = !opc || opc.voar !== false;
          var z = Math.max(mapa.getZoom(), 10);
          mapa.invalidateSize();
          if (pendente) { pendente.cancelar(); pendente = null; }
          if (voar && !reduzMovimento()) {
            var t = null;
            var fim = function () { pendente.cancelar(); pendente = null; abrirPopupDe(r); };
            pendente = { cancelar: function () { clearTimeout(t); mapa.off('moveend', fim); } };
            mapa.on('moveend', fim);
            /* se o mapa já estava no lugar, o moveend não dispara */
            t = setTimeout(function () { if (viva && pendente) fim(); }, 1000);
            mapa.flyTo(alvo, z, { duration: 0.7 });
          } else { mapa.setView(alvo, z, { animate: false }); abrirPopupDe(r); }
        },
        fechar: fecharPopup,
        ajustar: function (lista, extras, opc) {
          var pts = lista.filter(function (r) { return r.mapa; }).map(function (r) { return [r.lat, r.lon]; }).concat(extras || []);
          enquadrar(pts, opc);
        },
        usuario: usuario,
        osm: osm,
        limites: function () { var b = mapa.getBounds(); return { norte: b.getNorth(), sul: b.getSouth(), leste: b.getEast(), oeste: b.getWest() }; },
        destruir: function () {
          viva = false; clearTimeout(avisoT); clearTimeout(temporizador); offTema(); if (pendente) pendente.cancelar();
          if (ro) ro.disconnect();
          /* Sair da aba no meio de uma animação deixava o Leaflet com temporizadores já amarrados (fim do zoom animado, redesenho
             do canvas) que disparavam depois do remove() e davam TypeError no console. Como os temporizadores chamam os métodos
             pelo objeto, trocar os métodos por funções vazias antes do remove() os neutraliza. */
          var nada = function () { return this; };
          try { mapa.stop(); } catch (e) { /* sem animação em curso */ }
          /* com preferCanvas há um renderizador por camada (pane): base, rótulos e o padrão */
          var rds = [mapa._renderer];
          Object.keys(mapa._paneRenderers || {}).forEach(function (k) { rds.push(mapa._paneRenderers[k]); });
          rds = rds.filter(Boolean);
          var cancelaRedesenho = function () {
            rds.forEach(function (rd) { try { if (rd._redrawRequest) Lf.Util.cancelAnimFrame(rd._redrawRequest); } catch (e) { /* ok */ } rd._redrawRequest = null; });
          };
          cancelaRedesenho();
          rds.forEach(function (rd) { rd._clear = rd._draw = rd._redraw = rd._update = nada; });
          mapa._move = mapa._moveEnd = mapa._resetView = mapa._onZoomTransitionEnd = nada;
          try { mapa.remove(); } catch (e) { /* já removido */ }
          /* o remove() tira as camadas uma a uma e cada uma agenda um redesenho: cancela o que sobrou */
          cancelaRedesenho();
        },
      };
    });
  };
})();
