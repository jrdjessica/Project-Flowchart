'use strict';

function initMap() {

    const start = { lat: 39.828, lng: -98.579 };

    const map = new google.maps.Map(document.querySelector('#map'), {
        zoom: 1,
        center: start,
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
                });

                // Create info window
                const infowindow = new google.maps.InfoWindow({
                    content: 'contentString',
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




// Maps javascript api - geocoding
// Takes in address, returns lat and lng, add to map
// geocoder = new google.maps.Geocoder();
// function codeAddress(address, map) {
//     geocoder.geocode({ 'address': address }, function (results, status) {

//         if (status == 'OK') {
//             let latitude = results[0].geometry.location.lat();
//             let longitude = results[0].geometry.location.lng();

//             addMarker({ lat: latitude, lng: longitude }, map);

//         } else {
//             alert(`Address was unsuccessful. ${address} ${status}`);
//         }
//     });
// }
