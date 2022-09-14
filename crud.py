"""CRUD operations."""

import csv
from model import db, User, Customer, Order, connect_to_db


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

    customer = Customer(fname=line['First Name'], lname=line['Last Name'],
                        city=line['Ship City'], state=line['Ship State'], country=line['Ship Country'])

    return customer


def add_to_database(file):
    """Parse through csv file and add data to database."""

    with open(file, newline='') as csvFile:
        reader = csv.DictReader(csvFile)
        for row in reader:
            print(row['date'])


def get_location(customer_id):

    customer = Customer.query.filter(
        Customer.customer_id == customer_id).first()
    city = customer.city
    state = customer.state
    country = customer.country

    if state:
        location = city
    else:
        location = country

    return location


if __name__ == "__main__":
    from server import app

    connect_to_db(app)
