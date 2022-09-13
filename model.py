"""Models for etsy dashboard app."""

from datetime import datetime
from flask_sqlalchemy import SQLAlchemy


db = SQLAlchemy()


class User(db.Model):
    """A user."""

    __tablename__ = 'users'

    user_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    email = db.Column(db.String, unique=True, nullable=False)
    password = db.Column(db.String, nullable=False)

    customer = db.relationship('Customer', back_populates='user')

    def __repr__(self):

        return f'<User user_id={self.user_id} email={self.email}>'


class Customer(db.Model):
    """A customer."""

    __tablename__ = 'customers'

    customer_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'))
    fname = db.Column(db.String)
    lname = db.Column(db.String)
    city = db.Column(db.String)
    state = db.Column(db.String)
    country = db.Column(db.String)

    user = db.relationship('User', back_populates='customer')
    order = db.relationship('Order', back_populates='customer')

    def __repr__(self):

        return f'<Customer customer_id={self.customer_id} fname={self.fname}>'


class Order(db.Model):
    """An order."""

    __tablename__ = 'orders'

    order_id = db.Column(db.String, primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.customer_id'))
    num_items = db.Column(db.Integer)
    date = db.Column(db.DateTime)
    total = db.Column(db.Float)
    net = db.Column(db.Float)

    customer = db.relationship('Customer', back_populates='order')

    def __repr__(self):

        return f'<Order order_id={self.order_id} date={self.date} total={self.total}>'


def example_data():
    """Sample data."""

    user1 = User(email='email1@test.com', password='test')
    user2 = User(email='email2@test.com', password='test')

    customers = [
        Customer(user=user1, fname='Joe', state='CA'),
        Customer(user=user1, fname='Jane', state='OR'),
        Customer(user=user2, fname='Barbie', state='CA'),
        Customer(user=user2, fname='Bill', state='WA'),
    ]

    orders = [
        Order(order_id='2329087707',
              customer=customers[0], num_items=1, date=datetime.strptime('12/31/2021', "%m/%d/%Y"), net=1.80, total=1.5),
        Order(order_id='2322080584',
              customer=customers[1], num_items=1, date=datetime.strptime('12/11/2021', "%m/%d/%Y"), net=2.80, total=1.8)
    ]

    db.session.add_all(orders)
    db.session.commit()


def connect_to_db(flask_app, db_uri="postgresql:///customers", echo=True):
    """Connect the database to the Flask app."""

    flask_app.config["SQLALCHEMY_DATABASE_URI"] = db_uri
    flask_app.config["SQLALCHEMY_ECHO"] = echo
    flask_app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    db.app = flask_app
    db.init_app(flask_app)


if __name__ == "__main__":
    from server import app

    connect_to_db(app)

    # creates tables and sample data
    db.create_all()
    example_data()

    print("Connected to the db!")
