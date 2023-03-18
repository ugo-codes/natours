/* eslint-disable */

export const displayMap = function (locations) {
  mapboxgl.accessToken =
    'pk.eyJ1IjoidWdvY29kZXMiLCJhIjoiY2xlc2w3ZzFvMTdnZzNzbzVlNWJvb3l1OSJ9.RYgiVHOixq_6VCorAlNNGg';
  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/ugocodes/clesnnujf000201o1b2xdr2il',
    scrollZoom: false,
    // center: [-118.113491, 34.111745],
    // zoom: 10,
    // interactive: false,
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach(loc => {
    // Create a marker
    const el = document.createElement('div');
    el.className = 'marker';

    // Add the marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    // Add a popup
    new mapboxgl.Popup({ offset: 30 })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    // Extend the map bounds to include the current location
    bounds.extend(loc.coordinates);
  });

  // map.bounds(bounds);

  // map.fitBounds(bounds);

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100,
    },
  });
};
