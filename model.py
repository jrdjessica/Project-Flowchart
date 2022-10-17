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
    order = db.relationship('Order', back_populates='user')

    def __repr__(self):

        return f'<User user_id={self.user_id} email={self.email}>'


class Customer(db.Model):
    """A customer."""

    __tablename__ = 'customers'

    customer_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'))
    fname = db.Column(db.String)
    lname = db.Column(db.String)
    street = db.Column(db.String)
    street2 = db.Column(db.String)
    city = db.Column(db.String)
    state = db.Column(db.String)
    zipcode = db.Column(db.String)
    country = db.Column(db.String)
    address = db.Column(db.String)
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)

    user = db.relationship('User', back_populates='customer')
    order = db.relationship('Order', back_populates='customer')

    def __repr__(self):

        return f'<Customer customer_id={self.customer_id} fname={self.fname}>'


class Order(db.Model):
    """An order."""

    __tablename__ = 'orders'

    order_id = db.Column(db.String, primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.customer_id'))
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'))
    num_items = db.Column(db.Integer)
    date = db.Column(db.DateTime)
    total = db.Column(db.Float)
    net = db.Column(db.Float)

    customer = db.relationship('Customer', back_populates='order')
    user = db.relationship('User', back_populates='order')

    def __repr__(self):

        return f'<Order order_id={self.order_id} date={self.date} total={self.total}>'


def example_data():
    """Sample data."""

    user1 = User(user_id=0, email='demo@demo.com', password='demodemo')

    customers = [
        Customer(user=user1, fname='Joe', lname='Lawrence',
                 street='Thousand Oaks Blvd', city='Thousand Oaks', state='CA', zipcode='91362', country='United States',
                 address='Thousand Oaks Blvd, Thousand Oaks, CA, 91362, United States', latitude=34.1747776, longitude=-118.8433763),
        Customer(user=user1, fname='Jane', lname='Cartwright',
                 street='Broadway Blvd', city='Kansas City', state='MO', zipcode='64112', country='United States',
                 address='Broadway Blvd, Kansas City, MO, 64112, United States', latitude=39.0495636, longitude=-94.6177897),
        Customer(user=user1, fname='Michael', lname='Sherman',
                 street='S Jackson St', city='Montgomery', state='AL', zipcode='36104', country='United States',
                 address='S Jackson St, Montgomery, AL, 36104, United States', latitude=32.3695557, longitude=-86.2909703),
        Customer(user=user1, fname='Sarah', lname='Collin',
                 street='E Columbia Ave', city='Champaign', state='IL', zipcode='61820', country='United States',
                 address='E Columbia Ave, Champaign, IL, 61820, United States', latitude=40.1143531, longitude=-88.2532443),
        Customer(user=user1, fname='Heidi', lname='Forte',
                 street='Victoria Dr', city='Vancouver', state='BC', zipcode='V5P 3T7', country='Canada',
                 address='Victoria Dr, Vancouver, BC, V5P 3T7, Canada', latitude=49.227231, longitude=-123.0657206),
        Customer(user=user1, fname='Addi', lname='Walker',
                 street='Euclid Ave', city='Cleveland', state='OH', zipcode='44115', country='United States',
                 address='Euclid Ave, Cleveland, OH, 44115, United States', latitude=41.4918881, longitude=-81.6877121)
    ]

    orders = [
        Order(order_id='2329392707',
              customer=customers[0], user=user1, num_items=1, date=datetime.strptime('1/1/2020', "%m/%d/%Y"), net=6.80, total=7.5),
        Order(order_id='2322000584',
              customer=customers[1], user=user1, num_items=1, date=datetime.strptime('2/1/2020', "%m/%d/%Y"), net=5.80, total=6.8),
        Order(order_id='2329294807',
              customer=customers[2], user=user1, num_items=2, date=datetime.strptime('3/12/2020', "%m/%d/%Y"), net=7.90, total=8.5),
        Order(order_id='2837000584',
              customer=customers[3], user=user1, num_items=3, date=datetime.strptime('5/20/2020', "%m/%d/%Y"), net=10.10, total=12.8),
        Order(order_id='0594392707',
              customer=customers[4], user=user1, num_items=4, date=datetime.strptime('6/12/2020', "%m/%d/%Y"), net=20.20, total=17.5),
        Order(order_id='2339580584',
              customer=customers[5], user=user1, num_items=1, date=datetime.strptime('7/26/2020', "%m/%d/%Y"), net=3.80, total=3.2)
    ]

    db.session.add_all(orders)
    db.session.commit()


def connect_to_db(flask_app, db_uri="postgresql:///shop", echo=True):
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
