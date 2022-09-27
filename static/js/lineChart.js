'use strict';


google.charts.load('current', { 'packages': ['line'] });
google.charts.setOnLoadCallback(drawChart);


function drawChart() {
    fetch('/api/shop')
        .then(res => res.json())
        .then(orders => {

            // Create chart
            const data = new google.visualization.DataTable();

            // Contains data for chart
            const chartRow = [];

            // Initialize net and total
            let net_total = 0;
            let order_total = 0;

            // Sort orders by date
            const sortedOrder = orders.sort((a, b) => new Date(a.date) - new Date(b.date));

            // Loop through orders to create rows with date, net, and total
            for (let i = 0; i < sortedOrder.length; i++) {
                order_total += sortedOrder[i].total;
                net_total += sortedOrder[i].net;

                let addRow = [new Date(sortedOrder[i].date), net_total, order_total];

                chartRow.push(addRow);
            }

            // Add columns to chart
            data.addColumn('datetime', 'Time');
            data.addColumn('number', 'Net Order in Dollars');
            data.addColumn('number', 'Total Order in Dollars');

            // Add rows to chart
            for (let row of chartRow) {
                data.addRows([
                    row
                ]);
            }

            var options = {
                chart: {
                    title: 'Net Order vs Total Order',
                },
                width: 900,
                height: 500
            };

            const chart = new google.charts.Line(document.querySelector('#linechart-material'));

            chart.draw(data, google.charts.Line.convertOptions(options));

            google.visualization.events.addListener(chart, 'select', selectHandler);

            function selectHandler(e) {
                const selection = chart.getSelection();
                for (let i = 0; i < selection.length; i++) {
                    const item = selection[i];
                    const value = data.getValue(item['row'], item['column']).toFixed(2);

                    console.log(value);
                    document.querySelector('#enter-num').value = value;
                }
            }

        }
        )
}