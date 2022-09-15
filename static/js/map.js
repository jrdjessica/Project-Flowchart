let address1 = 'Mooregate Trail, Hawthorn Woods, IL, United States'
let address2 = 'Ethel Street, Cambridge, ON, Canada'
let address3 = 'Goeman Borgesiusstraat 229, Nijmegen, The Netherlands'

// Initialize map, starts in US
function initMap() {
    geocoder = new google.maps.Geocoder();

    const bangalore = { lat: 12.97, lng: 77.59 };
    const start = { lat: 39.828, lng: -98.579 };

    const map = new google.maps.Map(document.querySelector('#map'), {
        zoom: 1,
        center: start,
    });

    addMarker(bangalore, map);
    codeAddress(address1, map);
    codeAddress(address2, map);
    codeAddress(address3, map);
}

// Add markers to map
function addMarker(location, map) {
    new google.maps.Marker({
        position: location,
        map: map,
    });
}

