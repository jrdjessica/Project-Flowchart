"""Models for etsy dashboard app."""

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
