            mapboxgl.accessToken = mapToken;
        const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
        center: road.geometry.coordinates, // starting position [lng, lat]
        zoom: 11 // starting zoom
        });

        new mapboxgl.Marker()
        .setLngLat([-74.5, 40])
        .addTo(map)