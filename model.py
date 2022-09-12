"""Models for etsy dashboard app."""

from datetime import datetime
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class User(db.Model):

    __tablename__ = 'users'

    user_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    email = db.Column(db.String, unique=True, nullable=False)
    password = db.Column(db.String, nullable=False)

    def __repr__(self):

        return f'<User user_id={self.user_id} email={self.email}>'


class Customer(db.Model):

    __tablename__ = 'customers'

    customer_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.user_id'))
    fname = db.Column(db.String)
    lname = db.Column(db.String)
    city = db.Column(db.String)
    state = db.Column(db.String)
    country = db.Column(db.String)

    def __repr__(self):

        return f'<Customer customer_id={self.customer_id}> fname={self.fname}'


class Order(db.Model):
    order_id = db.Column(db.String, primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.user_id'))
    num_items = db.Column(db.Integer)
    date = db.Column(db.DateTime)
    total = db.Column(db.Integer)
    net = db.Column(db.Integer)

    def __repr__(self):

        f'<Order order_id={self.order_id} num_items={self.num_items} date={self.date}>'
