        mapboxgl.accessToken = mapToken;
        const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/light-v10', // stylesheet location
        center: road.geometry.coordinates, // starting position [lng, lat]
        zoom: 11 // starting zoom
        });

        map.addControl(new mapboxgl.NavigationControl());

        new mapboxgl.Marker()
        .setLngLat(road.geometry.coordinates)
        .setPopup(new mapboxgl.Popup().setHTML(`<h4>${road.title}</h4><p>${road.location}</p>`))
        .addTo(map)

