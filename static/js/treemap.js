'use strict';

google.charts.load('current', { 'packages': ['treemap'] });
google.charts.setOnLoadCallback(drawChart);

function drawChart() {
    fetch('/api/shop')
        .then(res => res.json())
        .then(orders => {
            console.log(orders);
            const data = google.visualization.arrayToDataTable([

                // ['Location', 'Parent', 'num orders']

                // ['Global', null, 0, 0],

                // country, parent, num orders
                // ['Brazil', 'Global', 11],
                // ['United States', 'Global', 52],
                // ['Mexico', 'Global', 24],
                // ['Canada', 'Global', 16],

                // state, country, num orders
                // ['CA', 'United States', 11],
                // ['ON', 'Canada', 52],

                // city, state, num orders
                // ['Millcreek', 'UT', 11],
                // ['Raleigh', 'NC', 52],

                ['Location', 'Parent', 'Market trade volume (size)', 'Market increase/decrease (color)'],
                ['Global', null, 0, 0],
                ['America', 'Global', 0, 0],
                ['Europe', 'Global', 0, 0],
                ['Asia', 'Global', 0, 0],
                ['Australia', 'Global', 0, 0],
                ['Africa', 'Global', 0, 0],
                ['Brazil', 'America', 11, 10],
                ['USA', 'America', 52, 31],
                ['Mexico', 'America', 24, 12],
                ['Canada', 'America', 16, -23],
                ['France', 'Europe', 42, -11],
                ['Germany', 'Europe', 31, -2],
                ['Sweden', 'Europe', 22, -13],
                ['Italy', 'Europe', 17, 4],
                ['UK', 'Europe', 21, -5],
                ['China', 'Asia', 36, 4],
                ['Japan', 'Asia', 20, -12],
                ['India', 'Asia', 40, 63],
                ['Laos', 'Asia', 4, 34],
                ['Mongolia', 'Asia', 1, -5],
                ['Israel', 'Asia', 12, 24],
                ['Iran', 'Asia', 18, 13],
                ['Pakistan', 'Asia', 11, -52],
                ['Egypt', 'Africa', 21, 0],
                ['S. Africa', 'Africa', 30, 43],
                ['Sudan', 'Africa', 12, 2],
                ['Congo', 'Africa', 10, 12],
                ['Zaire', 'Africa', 8, 10]
            ]);

            const tree = new google.visualization.TreeMap(document.querySelector('#treemap'));

            tree.draw(data, {
                minColor: '#f00',
                midColor: '#ddd',
                maxColor: '#0d0',
                headerHeight: 15,
                fontColor: 'black',
                showScale: true
            });
        }
        )


}