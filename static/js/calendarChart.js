'use strict';

google.charts.load("current", { packages: ["calendar"] });
google.charts.setOnLoadCallback(drawChart);

function drawChart() {
    fetch('/api/shop')
        .then(res => res.json())
        .then(orders => {

            // Create table
            const dataTable = new google.visualization.DataTable();

            // Contain row data
            const chartRows = [];

            // Add first item in orders to chartRows
            let addRow = { date: new Date(orders[0].date), dateValue: new Date(orders[0].date).getTime(), numItems: orders[0].num_items };
            chartRows.push(addRow);

            // Add data to chartRows
            for (let i = 1; i < orders.length; i++) {
                for (let row of chartRows) {

                    let lastItem = chartRows[chartRows.length - 1];

                    if (row['dateValue'] == new Date(orders[i].date).getTime()) {
                        row['numItems'] += orders[i].num_items;
                        break
                    }
                    else if (row == lastItem) {
                        let addRow = { date: new Date(orders[i].date), dateValue: new Date(orders[i].date).getTime(), numItems: orders[i].num_items };
                        chartRows.push(addRow);
                        break
                    }
                }

            }

            // Create columns
            dataTable.addColumn({ type: 'date', id: 'Date' });
            dataTable.addColumn({ type: 'number', id: 'Won/Loss' });

            // Create row
            for (let row of chartRows) {
                dataTable.addRows([
                    [row['date'], row['numItems']]
                ]);
            }

            // Element from DOM
            const chart = new google.visualization.Calendar(document.querySelector('#calendar_basic'));

            const options = {
                height: 350,
                calendar: {
                    dayOfWeekLabel: {
                        fontName: 'Josefin Slab',
                        fontSize: 12,
                    },
                    dayOfWeekRightSpace: 8,
                    monthLabel: {
                        fontName: 'Josefin Slab',
                        fontSize: 16,
                        color: '#01442c',
                    },
                    monthOutlineColor: {
                        stroke: '#A5A7AB',
                        strokeOpacity: 0.8,
                        strokeWidth: 2
                    },
                    underMonthSpace: 10,
                    yearLabel: {
                        fontName: 'Josefin Slab',
                        fontSize: 45,
                        color: '#5f849c',
                    },
                    underYearSpace: 10,
                    focusedCellColor: {
                        stroke: 'black',
                        strokeOpacity: 0.8,
                        strokeWidth: 2,
                    },
                },
                colorAxis: {
                    minValue: 0, colors: ['#fefefe', '#027e3d'],
                },
                tooltip: {
                    textStyle: {
                        fontName: 'Josefin Slab',

                    },
                },
            };

            chart.draw(dataTable, options);
        }
        );

}