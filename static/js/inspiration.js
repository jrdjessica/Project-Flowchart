'use strict'

function clickWord(e) {
    document.querySelector('#search').value = e;
}

let images = document.getElementsByClassName("column");


function displayImages() {
    for (let i = 0; i < images.length; i += 1) {
        images[i].style.flex = "50%";
    }
}
displayImages()
