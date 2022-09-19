'use strict';

google.charts.load('current', { 'packages': ['line'] });
google.charts.setOnLoadCallback(drawChart);

function drawChart() {

    var data = new google.visualization.DataTable();

    fetch('/api/shop')
        .then(res => res.json())
        .then(orders => {

            const dateOrder = [];
            const netOrder = [];
            const totalOrder = [];

            let net_total = 0;
            let order_total = 0;

            // Reverse loop through array for correct date order
            for (let i = orders.length - 1; i >= 0; i--) {
                order_total += orders[i].total;
                net_total += orders[i].net;

                dateOrder.push(orders[i].date);
                totalOrder.push(order_total);
                netOrder.push(net_total);

            }


            // data.addColumn('datetime', 'Day');
            // data.addColumn('number', 'Order Total');
            // data.addColumn('number', 'Net Total');

            // data.addRows([
            //     [new Date(date), total],
            // ]);


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