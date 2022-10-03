'use strict'

function DashboardContainer() {
    const [numOrders, setNumOrders] = React.useState(0);
    const [numCountries, setNumCountries] = React.useState(0);
    const [totalSales, setTotalSales] = React.useState(0);
    const [avgValue, setAvgValue] = React.useState(0);
    const [startDate, setStartDate] = React.useState();
    const [endDate, setEndDate] = React.useState();

    const [numberDays, setNumberDays] = React.useState();
    const [countries, setCountries] = React.useState();


    function Button() {
        const [showText, setShowText] = React.useState(false);
        const [showDays, setShowDays] = React.useState(false);

        function onClick(state, fx) {
            if (state === false) {
                fx(true);
            } else if (state === true) {
                fx(false);
            }
        }

        return (
            <div>
                <div>
                    <button type="button" onClick={() => onClick(showText, setShowText)}>Reveal countries</button>
                    {showText ? <DisplayInfo evt={countries} location="countries" /> : null}
                </div>
                <div>
                    <button type="button" onClick={() => onClick(showDays, setShowDays)}>Reveal days</button>
                    {showDays ? <DisplayInfo evt={numberDays} location="num-days" /> : null}
                </div>
            </div>
        );
    }


    function DisplayInfo(props) {
        return (
            <div id={props.location}>
                {props.evt}
            </div>
        )
    };


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
                setCountries(Array.from(countries).join(', '));

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

                setNumberDays((new Date(endDate).getTime() - new Date(firstDate).getTime()) / (1000 * 60 * 60 * 24))
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
            {/* <div onMouseEnter={() => setNumberDays((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))}
                onMouseLeave={() => setNumberDays('?')}>
                <br />
                This data is for {numberDays} days
            </div> */}
            {/* <div>
                <button type="button" onClick={onClick}>Reveal days</button>
                {showText ? <DisplayInfo evt={numberDays} location="num-days" /> : null}
            </div> */}


            <Button />
        </div>
    )
}



ReactDOM.render(<DashboardContainer />, document.querySelector('#dashboard'));
