
console.log("JS carregado!");

let map;
let markers = [];
let arvores = JSON.parse(localStorage.getItem("arvores")) || [];

function initLeaflet() {

  const portoAlegreCenter = [-30.0277, -51.2287];

 map = L.map('map').setView(portoAlegreCenter, 14);


  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
    maxZoom: 19
  }).addTo(map);

  map.on('click', function(e) {
    const nome = prompt("Nome da árvore (ou cancelar):");
    if (!nome) return;

    const nova = {
      nome: nome,
      lat: parseFloat(e.latlng.lat.toFixed(6)),
      lon: parseFloat(e.latlng.lng.toFixed(6)),
      criadoEm: new Date().toISOString()
    };

    arvores.push(nova);
    localStorage.setItem('arvores', JSON.stringify(arvores));
    adicionarMarcador(nova);
    atualizarLista();
  });

  arvores.forEach(adicionarMarcador);
  atualizarLista();
}

function adicionarMarcador(arvore) {
  const marker = L.marker([Number(arvore.lat), Number(arvore.lon)]).addTo(map);
  const popupContent = `<strong>${escapeHtml(arvore.nome)}</strong><br>Lat: ${arvore.lat}<br>Lon: ${arvore.lon}`;
  marker.bindPopup(popupContent);
  markers.push(marker);
}

function atualizarLista() {
  const lista = document.getElementById('listaArvores');
  lista.innerHTML = '';

  if (arvores.length === 0) {
    lista.innerHTML = '<li>Nenhuma árvore cadastrada ainda.</li>';
    return;
  }

  arvores.forEach((a, i) => {
    const li = document.createElement('li');
    li.innerHTML = `${escapeHtml(a.nome)} — (${a.lat}, ${a.lon}) <button data-index="${i}" class="remover">Remover</button>`;
    lista.appendChild(li);
  });

  document.querySelectorAll('.remover').forEach(btn => {
    btn.addEventListener('click', (ev) => {
      const idx = Number(ev.target.getAttribute('data-index'));
      if (!Number.isInteger(idx)) return;

      arvores.splice(idx, 1);

      localStorage.setItem('arvores', JSON.stringify(arvores));

      markers.forEach(m => map.removeLayer(m));
      markers = [];
      arvores.forEach(adicionarMarcador);
      atualizarLista();
    });
  });
}

function escapeHtml(str) {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

document.addEventListener('DOMContentLoaded', initLeaflet);

