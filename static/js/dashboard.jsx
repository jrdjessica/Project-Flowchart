function DashboardContainer() {
    React.useEffect(() => {
        fetch('/api/shop')
            .then(res => res.json())
            .then(orders => {
                console.log(orders);

                // Number of orders
                const numOrders = orders.length;


                const countries = new Set();
                const totalOrderValue = [];

                for (let i in orders) {
                    countries.add(orders[i].country);
                    totalOrderValue.push(orders[i].total);
                }

                // Number of countries
                const numCountries = countries.size;

                // Average order value and total order value
                let totalValue = 0;
                for (let val of totalOrderValue) {
                    totalValue += val;
                }
                const avgValue = totalValue / numOrders




            });
    }, []);
    return (
        <div></div>
    )
}



ReactDOM.render(<DashboardContainer />, document.querySelector('#dashboard'));