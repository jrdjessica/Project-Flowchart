"""CRUD operations."""


import csv
from flask import session
from model import User, Customer, Order, connect_to_db
import os

import json
import ssl

import urllib.request
import urllib.parse
import urllib.error


ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE


def create_user(email, password):
    """Create a user."""

    user = User(email=email, password=password)

    return user


def get_user_by_email(email):
    """Return a user by email."""

    user = User.query.filter(User.email == email).first()

    return user


def create_customer(line):
    """Create a customer."""

    user_id = session['user_id']

    # create address
    address_components = ['Street 1', 'Street 2', 'Ship City',
                          'Ship State', 'Ship Zipcode', 'Ship Country']

    address = ''

    for comp in address_components:
        if comp == 'Ship Country':
            address += line[comp]
        elif line[comp] != '':
            address += f'{line[comp]}, '

    # create latitude and longitude
    parms = dict()
    parms['address'] = address
    key = os.environ['GEO_KEY']
    parms['key'] = key
    url = 'https://maps.googleapis.com/maps/api/geocode/json?' + \
        urllib.parse.urlencode(parms)
    print(url)

    uh = urllib.request.urlopen(url, context=ctx)
    data = uh.read().decode()

    js = json.loads(data)

    if js['status'] != 'OK':
        print(f'js["status"]')

    lat = js['results'][0]['geometry']['location']['lat']
    lng = js['results'][0]['geometry']['location']['lng']

    # create instance
    customer = Customer(user_id=user_id, fname=line['First Name'], lname=line['Last Name'], street=line['Street 1'], street2=line['Street 2'],
                        city=line['Ship City'], state=line['Ship State'], zipcode=line['Ship Zipcode'], country=line['Ship Country'], address=address, latitude=lat, longitude=lng)

    return customer


def add_to_database(file):
    """Parse through csv file and add data to database."""

    with open(file, newline='') as csvFile:
        reader = csv.DictReader(csvFile)
        for row in reader:
            print(row['date'])


def create_order(line):
    """Create an order."""

    customer_id = session['customer_id']

    order = Order(order_id=line['Order ID'], customer_id=customer_id, num_items=line['Number of Items'], date=line['Sale Date'],
                  total=line['Order Total'], net=line['Order Net'])

    return order


if __name__ == "__main__":
    from server import app

    connect_to_db(app)
