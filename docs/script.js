// Rio Mapa Multimodal — Frontend (Leaflet)

const RIO_CENTER = [-22.9068, -43.1729];
// desliga o zoom padrão para controlar a ordem
const map = L.map('map', { preferCanvas: true, zoomControl: false }).setView(RIO_CENTER, 12);

// Escala posicionada à direita do zoom no canto inferior esquerdo
L.control.scale({ position: 'bottomleft', metric: true, imperial: false, maxWidth: 150 }).addTo(map);


// 2) zoom à esquerda
L.control.zoom({ position: 'bottomleft' }).addTo(map);


// Base ESRI Dark Gray (Base)
const esriBase = L.tileLayer(
  'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
  { attribution: 'Tiles © Esri — Esri, DeLorme, NAVTEQ', maxZoom: 19, crossOrigin: true }
).addTo(map);

// Overlay de rótulos (Reference)
const esriLabels = L.tileLayer(
  'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}',
  { attribution: 'Labels © Esri', maxZoom: 19, crossOrigin: true }
).addTo(map);


// Cores (bitmask)
const coverageColors = {
  0: '#00000000',
  1: '#00FF00', // Bike
  2: '#FF0000', // Ônibus
  3: '#FFFF00', // Bike + Ônibus
  4: '#0000FF', // Trilhos
  5: '#00FFFF', // Bike + Trilhos
  6: '#FF00FF', // Ônibus + Trilhos
  7: '#FFFFFF'  // Todos os modais
};

function style(feature) {
  const mask = feature.properties?.mask ?? 0;
  const color = feature.properties?.color || coverageColors[mask] || '#00000000';
  const visible = mask !== 0;
  return {
    fill: true,
    fillColor: color,
    color: color,
    weight: 0,
    opacity: visible ? 0.7 : 0,
    fillOpacity: visible ? 0.7 : 0,
    interactive: false
  };
}

function setTimestamp(text) {
  const el = document.getElementById('timestamp');
  if (el) el.textContent = text;
}

function setStatus(text) {
  const el = document.getElementById('status');
  if (!el) return;
  if (!text) { el.hidden = true; el.textContent = ''; return; }
  el.hidden = false; el.textContent = text;
}

const qs = new URLSearchParams(location.search);
const GEOJSON_PATH = qs.get('file') || 'data/hex_coverage_2025-08-19_12h00.geojson';
const canvasRenderer = L.canvas({ padding: 0.3 });

fetch(GEOJSON_PATH, { cache: 'no-store' })
  .then(res => {
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  })
  .then(data => {
    let ts = data?.properties?.timestamp;
    if (!ts && Array.isArray(data.features) && data.features.length) {
      ts = data.features[0]?.properties?.timestamp;
    }
// remove "Janela:" se vier do backend
if (ts) ts = String(ts).replace(/^janela:\s*/i, '');
setTimestamp(ts || '—');


    const layer = L.geoJSON(data, {
      style,
      renderer: canvasRenderer,
    }).addTo(map);

    try {
      map.fitBounds(layer.getBounds(), { padding: [20, 20] });
    } catch {}

    setStatus('');
  })
  .catch(err => {
    console.error('Falha ao carregar GeoJSON:', err);
    setStatus('Não foi possível carregar a camada. Verifique se está servindo via http://localhost e se o caminho do arquivo está correto.');
    setTimestamp('—');
  });