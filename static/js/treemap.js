'use strict';

google.charts.load('current', { 'packages': ['treemap'] });
google.charts.setOnLoadCallback(drawChart);

function drawChart() {
    fetch('/api/shop')
        .then(res => res.json())
        .then(orders => {

            // Country parent data['United States', 'Global', 0]
            let rowCountry = [[orders[0].country, 'Global', 0]];

            // State parent data ['CA', 'United States', 11]
            let rowState = [[orders[0].state, orders[0].country, 0]];

            // City parent data['Millcreek', 'UT', 1]
            let rowCity = [[orders[0].city, orders[0].state, 0]];


            for (let order of orders) {

                // Add country parent row
                for (let row of rowCountry) {
                    let addRowCountry = [order.country, 'Global', 0];

                    if (JSON.stringify(row) === JSON.stringify(addRowCountry)) {
                        break
                    }
                    else if (row === rowCountry[rowCountry.length - 1]) {
                        rowCountry.push(addRowCountry);
                        break
                    }
                }

                // Add state parent row
                for (let row of rowState) {
                    let addRowState = [order.state, order.country, order.num_items];

                    if (order.state == '') {
                        order.state = 'Unknown';
                    }

                    if (row[0] == order.state) {
                        row[2] += order.num_items;
                        break
                    }
                    else if (row == rowState[rowState.length - 1]) {
                        rowState.push(addRowState);
                        break
                    }
                }

                // Add city parent row
                for (let row of rowCity) {
                    let addRowCity = [order.city, order.state, order.num_items];
                    if (row[0] == order.city) {
                        row[2] += order.num_items;
                        break
                    }
                    else if (row == rowCity[rowCity.length - 1]) {
                        rowCity.push(addRowCity);
                        break
                    }
                }

            }

            // Create chart
            const data = new google.visualization.DataTable();

            // Add column
            data.addColumn('string', 'Location');
            data.addColumn('string', 'Parent');
            data.addColumn('number', 'Num Orders');

            // Add row
            for (let row of rowCountry) {
                data.addRows([
                    ['Global', null, 0],
                    row
                ]);
            }

            for (let row of rowState) {
                data.addRows([
                    row
                ]);
            }

            for (let row of rowCity) {
                data.addRows([
                    row
                ]);
            }


            // Element from DOM
            const tree = new google.visualization.TreeMap(document.querySelector('#treemap'));

            // Chart options
            tree.draw(data, {
                minColor: '#e6d4ca',
                midColor: '#e5aca4',
                maxColor: '#ae4f47',
                headerHeight: 15,
                fontColor: 'black',
                showScale: true,
                textStyle: {
                    fontName: 'Playfair Display',
                    fontSize: 18,
                },
                showTooltips: 'false'
            });
        }
        )


}