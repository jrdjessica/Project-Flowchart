'use strict';

function initMap() {
    // Start location
    const start = { lat: 39.828, lng: -98.579 };

    // Create map
    const map = new google.maps.Map(document.querySelector('#map'), {
        zoom: 2,
        center: start,
        mapId: '626153b4a5c38e8d',
    });

    fetch('/api/shop')
        .then(res => res.json())
        .then(orders => {
            for (let order of orders) {
                let lat = order.latitude;
                let lng = order.longitude;

                // Create marker
                const marker = new google.maps.Marker({
                    position: { lat: lat, lng: lng },
                    map: map,
                    icon: '/static/img/icons-point.png'
                });

                // Content inside info window
                let contentString = `<div>Name: ${order.fname} ${order.lname}</div>
                                    <div>Location: ${order.city}, ${order.country}</div>
                                    <div>Order Total: $${order.total}</div>`

                // Create info window
                const infowindow = new google.maps.InfoWindow({
                    content: contentString,
                });

                // Create event listener
                marker.addListener("click", () => {
                    infowindow.open({
                        map: map,
                        anchor: marker,
                    });
                });
            }
        }
        )
}
