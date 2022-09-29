'use strict'

function DashboardContainer() {
    const [numOrders, setNumOrders] = React.useState(0);
    const [numCountries, setNumCountries] = React.useState(0);
    const [totalSales, setTotalSales] = React.useState(0);
    const [avgValue, setAvgValue] = React.useState(0);
    const [startDate, setStartDate] = React.useState();
    const [endDate, setEndDate] = React.useState();

    React.useEffect(() => {
        fetch('/api/shop')
            .then(res => res.json())
            .then(orders => {

                // Number of orders
                const numOrder = orders.length;
                setNumOrders(numOrder);

                // Sort orders by date
                const sortedOrder = orders.sort((a, b) => new Date(a.date) - new Date(b.date));

                const countries = new Set();
                const totalOrderValue = [];

                for (let i in sortedOrder) {
                    countries.add(sortedOrder[i].country);
                    totalOrderValue.push(sortedOrder[i].total);
                }

                // Number of countries
                setNumCountries(countries.size);

                // Average order value and total order value
                let totalValue = 0;
                for (let val of totalOrderValue) {
                    totalValue += val;
                }
                setAvgValue((totalValue / numOrder).toFixed(2));
                setTotalSales((totalValue).toFixed(2));

                // Timespan from first to last order
                const firstDate = new Date(sortedOrder[0].date);
                const endDate = new Date(sortedOrder[numOrder - 1].date);

                setStartDate(firstDate.toDateString());
                setEndDate(endDate.toDateString());

                const numDays = (endDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24);
                const numYears = (numDays / 365).toFixed(2);

            });
    }, []);
    return (
        <div>
            <div>
                Number of orders: {numOrders}
            </div>
            <div>
                Number of countries: {numCountries}
            </div>
            <div>
                Total order value: {totalSales}
            </div>
            <div>
                Average order value: {avgValue}
            </div>
            <div>
                From {startDate} to {endDate}
            </div>
            <button type="button" onClick={ }></button>

        </div>
    )
}



ReactDOM.render(<DashboardContainer />, document.querySelector('#dashboard'));