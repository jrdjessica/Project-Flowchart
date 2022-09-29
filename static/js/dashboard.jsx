function DashboardContainer() {
    React.useEffect(() => {
        fetch('/api/shop')
            .then(res => res.json())
            .then(orders => {
                console.log(orders);

                const numOrders = orders.length;

                const countries = new Set();
                for (let i in orders) {
                    countries.add(orders[i].country);
                }

            });
    }, []);
    return (
        <div></div>
    )
}



ReactDOM.render(<DashboardContainer />, document.querySelector('#dashboard'));