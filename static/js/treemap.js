'use strict';

google.charts.load('current', { 'packages': ['treemap'] });
google.charts.setOnLoadCallback(drawChart);

function drawChart() {
    fetch('/api/shop')
        .then(res => res.json())
        .then(orders => {
            let rowCharts = [];

            // Add country parent ['United States', 'Global', 0]
            let rowCountry = [[orders[0].country, 'Global', 0]];

            // Add state parent ['CA', 'United States', 11]
            let rowState = [];

            // Add city ['Millcreek', 'UT', 1]
            let rowCity = [];

            for (let order of orders) {
                // let addRowState = [order.state, order.country, 0];
                // let addRowCity = [order.city, order.state, order.num_items];

                // Add unique country parent row
                for (let row of rowCountry) {
                    let addRowCountry = [order.country, 'Global', 0];
                    let lastItem = rowCountry[rowCountry.length - 1];
                    if (JSON.stringify(row) == JSON.stringify(addRowCountry)) {
                        break
                    }
                    else if (row == lastItem) {
                        rowCountry.push(addRowCountry);
                    }
                }


                // rowCharts.push(addRowState);
                // rowCharts.push(addRowCity);
            }
            // console.log(rowCharts);

            console.log(rowCountry);


            const data = google.visualization.arrayToDataTable([

                // ['Location', 'Parent', 'num orders']

                // ['Global', null, 0, 0],

                // country, parent, num orders
                // ['Brazil', 'Global', 0],
                // ['United States', 'Global', 0],
                // ['Mexico', 'Global', 0],
                // ['Canada', 'Global', 0],

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