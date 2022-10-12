'use strict'


function DashboardContainer() {
    // Data from fetch request
    const [numOrders, setNumOrders] = React.useState(0);
    const [numCountries, setNumCountries] = React.useState(0);
    const [totalSales, setTotalSales] = React.useState(0);
    const [avgValue, setAvgValue] = React.useState(0);
    const [startDate, setStartDate] = React.useState();
    const [endDate, setEndDate] = React.useState();

    // Data for buttons
    const [numberDays, setNumberDays] = React.useState();
    const [countries, setCountries] = React.useState();
    const [fact, setFact] = React.useState();


    function CreateFact(numDays) {
        // Create fact comparing time to shop duration
        const dieHardTimes = `watch Die Hard ${(numDays * 24 * 60).toFixed(2)} times`;
        const lawAndOrderTimes = `watch ${(numDays * 24 * 60 / 22 / 42).toFixed(2)} seasons of Law And Order`;
        const moonTimes = `travel to the moon and back ${(numDays / 3 / 2).toFixed(2)} times`;
        const marsTimes = `travel to Mars ${(numDays / 30.44 / 9).toFixed(2)} times`;
        const harryPotterTimes = `read the Harry Potter series ${(numDays * 24 / 72.27).toFixed(2)} times`;
        const mayflyTimes = `witness ${numDays} generations of mayflies`;

        const items = [dieHardTimes, lawAndOrderTimes, moonTimes, marsTimes, harryPotterTimes, mayflyTimes];

        // Choose random fact to display from array
        setFact(`During this time, you could ${items[Math.floor(Math.random() * items.length)]}`)
    }

    function Button() {
        // Click button to show and hide text
        const [showText, setShowText] = React.useState(false);
        const [showDays, setShowDays] = React.useState(false);

        function onClick(state, setFx) {
            if (state === false) {
                setFx(true);
            } else if (state === true) {
                setFx(false);
            }
        }

        return (
            <div>
                <div>
                    <button type="button" className="button" onClick={() => onClick(showText, setShowText)}>Reveal countries</button>
                    {showText ? <DisplayInfo evt={countries} location="countries" /> : null}
                </div>
                <div>
                    <button type="button" className="button" onClick={() => onClick(showDays, setShowDays)}>Reveal days</button>
                    {showDays ? <DisplayInfo evt={numberDays} location="num-days" /> : null}
                </div>
                <div>
                    <button type="button" className="button" onClick={() => CreateFact(numberDays)}>Reveal facts</button>
                    {<DisplayInfo evt={fact} location="fact" />}
                </div>
            </div >
        );
    }

    function DisplayInfo(props) {
        // Display information when button is clicked
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

                setNumberDays((new Date(endDate).getTime() - new Date(firstDate).getTime()) / (1000 * 60 * 60 * 24));
            });
    }, []);

    return (
        <div>
            <div class="container">
                <div class="row">
                    <div>
                        <h4>From {startDate} to {endDate}</h4>
                    </div>
                    <div class="col-12 col-sm-6 col-md-3 dashboard">
                        <h4>Number of orders</h4>
                        <br />
                        <h3>{numOrders}</h3>
                    </div>
                    <div class="col-12 col-sm-6 col-md-3 dashboard">
                        <h4>Number of countries</h4>
                        <br />
                        <h3>{numCountries}</h3>
                    </div>
                    <div class="col-12 col-sm-6 col-md-3 dashboard">
                        <h4>Total order value</h4>
                        <br />
                        <h3>{totalSales}</h3>
                    </div>
                    <div class="col-12 col-sm-6 col-md-3 dashboard">
                        <h4>Average order value</h4>
                        <br />
                        <h3>{avgValue}</h3>
                    </div>
                </div>
            </div>
            <Button />
        </div>
    )
}


ReactDOM.render(<DashboardContainer />, document.querySelector('#dashboard'));