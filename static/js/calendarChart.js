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
                        break
                    }
                    else if (row == lastItem) {
                        let addRow = { date: new Date(orders[i].date), dateValue: new Date(orders[i].date).getTime(), numItems: orders[i].num_items };
                        chartRows.push(addRow);
                        break
                    }
                }

            }
            console.log(chartRows);

            dataTable.addColumn({ type: 'date', id: 'Date' });
            dataTable.addColumn({ type: 'number', id: 'Won/Loss' });


            // console.log(chartRows);

            for (let row of chartRows) {
                dataTable.addRows([
                    [row['date'], row['numItems']]
                ]);
            }
            // let addrow = [];
            // for (let row of chartRows) {

            //     let rows = [row['date'], row['numItems']];
            //     addrow.push(rows);


            // }
            // console.log(addrow);


            var chart = new google.visualization.Calendar(document.querySelector('#calendar_basic'));

            var options = {
                title: "Red Sox Attendance",
                height: 350,
            };

            chart.draw(dataTable, options);
        }
        );

}