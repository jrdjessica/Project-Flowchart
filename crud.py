"""CRUD operations."""

from model import db, User, Customer, Order, connect_to_db


def create_user(email, password):
    """Create a user."""

    user = User(email=email, password=password)

    return user


def get_user_by_email(email):
    """Return a user by email."""

    user = User.query.filter(User.email == email).first()

    return user


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
