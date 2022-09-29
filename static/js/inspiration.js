'use strict';

fetch('/api/inspiration')
    .then(res => res.json())
    .then(searchResults => {
        console.log(searchResults);
    }
    );