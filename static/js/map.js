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

    fetch('/api/shop')
        .then(res => res.json())
        .then(shop => {
            console.log(shop)
        })
}

// Add markers to map
function addMarker(location, map) {
    new google.maps.Marker({
        position: location,
        map: map,
    });
}


// Takes in address, returns lat and lng, add to map
function codeAddress(address, map) {
    geocoder.geocode({ 'address': address }, function (results, status) {

        if (status == 'OK') {
            let latitude = results[0].geometry.location.lat();
            let longitude = results[0].geometry.location.lng();

            let marker = new google.maps.Marker({
                position: { lat: latitude, lng: longitude },
                map: map
            })
        } else {
            alert('Address was unsuccessful.');
        }
    });
}

