var input = document.querySelector(".search");
var go = document.querySelector(".go");
var layerSelect = document.querySelector(".layer-select");
var popupInput = document.querySelector(".popup-input");

var mapElement = document.querySelector("leaflet-map");
var leaflet = mapElement.leaflet;
var map = mapElement.map;
var lookup = mapElement.lookup;

map.setMaxZoom(19);
map.options.closePopupOnClick = false;

var tiles = {};

for (var l in lookup) {
  var layer = lookup[l];
  if (!(layer instanceof leaflet.TileLayer)) continue;
  tiles[l] = layer;
  map.removeLayer(layer);
  var option = document.createElement("option");
  option.value = l;
  option.innerHTML = l;
  layerSelect.appendChild(option);
}

var changeLayer = function() {
  var value = layerSelect.value;
  var layer = tiles[value];
  layer.addTo(map);
  for (var t in tiles) {
    if (tiles[t] !== layer && tiles[t]._map) {
      map.removeLayer(tiles[t]);
    }
  }
};

layerSelect.addEventListener("change", changeLayer);
changeLayer();

var bubble = new leaflet.Popup();

map.on("click", function(e) {
  bubble = new leaflet.Popup();
  bubble.setLatLng(e.latlng);
  bubble.setContent(popupInput.value.trim() || " ");
  map.addLayer(bubble, e.latlng);
});

popupInput.addEventListener("keyup", function() {
  var value = popupInput.value.trim() || " ";
  bubble.setContent(value);
});

go.addEventListener("click", function() {
  var address = input.value.replace(/\s/g, "+");
  var url = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&bounds=47.4955511,-122.4359085|47.734145,-122.2359032`;
  var xhr = fetch(url).then(r => r.json());
  xhr.then(function(data) {
    if (data.status !== "ZERO_RESULTS" && data.results.length) {
      var top = data.results[0].geometry;
      var view = top.viewport;
      var bounds = [
        [view.southwest.lat, view.southwest.lng],
        [view.northeast.lat, view.northeast.lng]
      ];
      map.fitBounds(bounds);
    }
  });
});