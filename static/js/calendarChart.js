'use strict';

google.charts.load("current", { packages: ["calendar"] });
google.charts.setOnLoadCallback(drawChart);

function drawChart() {
    fetch('/api/shop')
        .then(res => res.json())
        .then(orders => {

            var dataTable = new google.visualization.DataTable();

            const chartRows = [];

            // Add first item in orders to chartRows
            let addRow = { date: new Date(orders[0].date), dateValue: new Date(orders[0].date).getTime(), numItems: orders[0].num_items };
            chartRows.push(addRow);

            for (let i = 1; i < orders.length; i++) {
                for (let row of chartRows) {

                    let lastItem = chartRows[chartRows.length - 1];

                    if (row['dateValue'] == new Date(orders[i].date).getTime()) {
                        row['numItems'] += orders[i].num_items;
                        // console.log(i);
                        // console.log(row['dateValue']);
                        // console.log(new Date(orders[29].date).getTime());
                        break
                    }
                    else if (row == lastItem) {
                        let addRow = { date: orders[i].date, dateValue: new Date(orders[i].date).getTime(), numItems: orders[i].num_items };
                        chartRows.push(addRow);
                        // console.log('hi')
                        break
                    }
                }
                // console.log('****');
                // let addRow = { date: orders[i].date, dateValue: new Date(orders[i].date).getTime(), numItems: orders[i].num_items };
                // chartRows.push(addRow);
                // console.log(chartRows);
                // console.log(i);
            }
            console.log(chartRows);

            // console.log(chartRows[6]['dateValue']);
            // console.log(new Date(orders[7].date).getTime());

            // if (chartRows[9]['dateValue'] == new Date(orders[10].date).getTime()) {
            //     console.log('iiiiiiiii')
            // }


            dataTable.addColumn({ type: 'date', id: 'Date' });
            dataTable.addColumn({ type: 'number', id: 'Won/Loss' });

            dataTable.addRows([
                [new Date(2012, 3, 13), 37032],
                [new Date(2012, 3, 14), 38024],
                [new Date(2012, 3, 15), 38024],
                [new Date(2012, 3, 16), 38108],
                [new Date(2012, 3, 17), 38229],
                // Many rows omitted for brevity.
                [new Date(2013, 9, 4), 38177],
                [new Date(2012, 4, 17), 38229],
                [new Date(2013, 9, 5), 38705],
                [new Date(2013, 9, 12), 38210],
                [new Date(2013, 9, 13), 38029],
                [new Date(2013, 9, 19), 38823],
                [new Date(2013, 9, 23), 38345],
                [new Date(2013, 9, 24), 38436],
                [new Date(2013, 9, 30), 38447]
            ]);

            var chart = new google.visualization.Calendar(document.querySelector('#calendar_basic'));

            var options = {
                title: "Red Sox Attendance",
                height: 350,
            };

            chart.draw(dataTable, options);
        }
        );

}