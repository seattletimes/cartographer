var input = document.querySelector(".search");
var go = document.querySelector(".go");
var mapElement = document.querySelector("leaflet-map");
var map = mapElement.map;

map.setMaxZoom(15);

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