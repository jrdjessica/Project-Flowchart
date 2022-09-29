function DashboardContainer() {
    React.useEffect(() => {
        fetch('/api/shop')
            .then(res => res.json())
            .then(orders => {
                console.log(orders);
            });
    }, []);
    return (
        <div></div>
    )
}



ReactDOM.render(<DashboardContainer />, document.querySelector('#dashboard'));