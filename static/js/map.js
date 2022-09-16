
// Initialize map, starts in US
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
                lat = order.latitude;
                lng = order.longitude;

                addMarker({ lat: lat, lng: lng }, map);
                // addInfoWindow(map);
                // console.log(order)
            }
        }
        )
}


// Add markers to map
function addMarker(location, map) {
    const marker = new google.maps.Marker({
        position: location,
        map: map,
    });
    addInfoWindow(marker, map)
}

// Add info window
function addInfoWindow(marker, map) {
    const infowindow = new google.maps.InfoWindow({
        content: 'contentString',
    });

    marker.addListener("click", () => {
        infowindow.open({
            map: map,
            anchor: marker,
        });
    });
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
