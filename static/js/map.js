
// Initialize map, starts in US
function initMap() {
    geocoder = new google.maps.Geocoder();

    const start = { lat: 39.828, lng: -98.579 };

    const map = new google.maps.Map(document.querySelector('#map'), {
        zoom: 1,
        center: start,
    });

    fetch('/api/shop')
        .then(res => res.json())
        .then(orders => {
            for (let order of orders) {
                lat = order.latitude
                lng = order.longitude
                // console.log(lat)
                // console.log(lng)
                console.log(typeof lat)
                addMarker({ lat: lat, lng: lng }, map)
            }
        }
        )
}


// Add markers to map
function addMarker(location, map) {
    new google.maps.Marker({
        position: location,
        map: map,
    });
}


// Takes in address, returns lat and lng, add to map
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
