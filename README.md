# Etsy Insider


## Project Description
Etsy Insider provides Etsy shop owners a tool to visualize and analyze their shop's performance. Once logged in, users upload their shop data which the app utilizes to dynamically generate a dashboard of their business's performance stats. Users are also able to view additional measures of performance, such as a graph of net and total orders as well as a map of customer purchase locations using the Google Maps API and Google Geocoding API.



## Tech Stack
- Python
- Javascript (AJAX/JQuery)
- Flask
- React
- PostgreSQL
- SQL
- SQLAlchemy
- HTML
- CSS
- Bootstrap



## Features
- Upload csv data file
- Dashboard of shop's performance stats
- Map of customer purchase locations
- Calendar heat map of customer orders
- Chart displaying net and total orders
- Currency converter
- Image search



## Installation
In order to run the app locally on your machine:

Create and activate a Python virtual enrivonment and install dependencies
```sh
virtualenv env
source env/bin/activate
pip3 install -r requirements.txt
```

API utilization
Obtain an exchange rate API key at https://www.exchangerate-api.com/ and input the following in your terminal:
```sh
export CUR_KEY='YOUR_API_KEY_HERE'
```

Create a microsoft account at https://www.microsoft.com/en-us/ and generate a Bing Search API key. Input the following in your terminal:
```sh
export BING_KEY='YOUR_API_KEY_HERE'
```

Create a google account at https://www.google.com/. Next, generate a Maps JavaScript API key (API_KEY) and Geocoding API key(GEO_KEY). Input the following in your terminal:
```sh
export API_KEY='YOUR_API_KEY_HERE'
export GEO_KEY='YOUR_API_KEY_HERE'
```

Run the server file
```sh
python3 server.py
```

Verify the deployment by navigating to your server address in your preferred browser
```sh
localhost:5000
```



## Screenshots
![Homepage](/static/img/Homepage.png "Homepage")

![Dashboard](/static/img/Dashboard.png "Dashboard")

![Sales Page](/static/img/Sales.png "Sales")

![Calendar Page](/static/img/Calendar.png "Calendar")

![Inspiration Page](/static/img/Inspiration.png "Inspiration")