/* eslint-disable */

export const displayMap = locations => {
  var map = L.map('map', {
    style: 'mapbox://styles/mapbox/light-v10',
    zoomControl: false,
    scrollWheelZoom: false,
  }).setView([51.5, -0.09], 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
    id: 'mapbox/streets-v11',
  }).addTo(map);

  var icon = L.icon({
    iconUrl: '/img/pin.png',
    iconSize: [32, 40], // size of the icon
    iconAnchor: [16, 45], // points of the icon which will correspond to marker's location
    popupAnchor: [0, -50], // point from which the popup should open relative to the iconAnchor
  });
  console.log(locations);

  const markers = [];
  locations.forEach(location => {
    const [lng, lat] = location.coordinates;
    L.marker([lat, lng], { icon })
      .addTo(map)
      .bindPopup(`${location.day} | ${location.description}`, {
        autoClose: false,
        className: 'mapPopup',
      })
      .openPopup();

    markers.push([lat, lng]);
  });

  const bounds = new L.LatLngBounds(markers).pad(0.7);
  map.fitBounds(bounds);
};
