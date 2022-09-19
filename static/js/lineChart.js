'use strict';

google.charts.load('current', { 'packages': ['line'] });
google.charts.setOnLoadCallback(drawChart);

function drawChart() {

    var data = new google.visualization.DataTable();

    fetch('/api/shop')
        .then(res => res.json())
        .then(orders => {

            // data.addColumn('datetime', 'Day');
            // data.addColumn('number', 'Order Total');
            // data.addColumn('number', 'Net Total');

            // data.addRows([
            //     [new Date(orders[i].date), total],
            // ]);

            // data.addRows([
            //     [new Date(date), total],
            // ]);

            let rows = [];

            let total = 0;

            // Reverse loop through array for correct date order
            for (let i = orders.length - 1; i >= 0; i--) {
                total += orders[i].total;
                console.log(total);


                let date = orders[i].date;
                // console.log(date);
                let addRow = [date, total]
                rows.push(addRow);
            }
            console.log(rows)

        }
        )

    var options = {
        chart: {
            title: 'Order Total vs Net',
        },
        width: 900,
        height: 500
    };

    var chart = new google.charts.Line(document.querySelector('#linechart_material'));

    chart.draw(data, google.charts.Line.convertOptions(options));
}