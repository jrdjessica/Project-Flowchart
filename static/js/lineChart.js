'use strict';

google.charts.load('current', { 'packages': ['line'] });
google.charts.setOnLoadCallback(drawChart);

function drawChart() {

    var data = new google.visualization.DataTable();

    fetch('/api/shop')
        .then(res => res.json())
        .then(orders => {

            data.addColumn('datetime', 'Day');
            data.addColumn('number', 'Order Total');
            // data.addColumn('number', 'Net Total');

            let total = 0;
            console.log(orders.length)

            // Reverse loop through array for correct date order
            for (let i = orders.length; i >= 0; i--) {
                // console.log(order.date);
                // console.log(order.total);
                // console.log(order.net);
                console.log(orders[i]);

                // total += order.total;
                // console.log(total);

                // data.addRows([
                //     [new Date(order.date), total],
                // ]);
            }

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