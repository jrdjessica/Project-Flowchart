from model import connect_to_db, db
from flask import session

import csv
import os
import crud


def get_orders(file, filename):
    """Reads csv and loads data into database."""

    user_id = session['user_id']

    # Create user input folder if it does not exist
    if not os.path.exists(f'input/{user_id}/'):
        os.makedirs(f'input/{user_id}/')

    # Path to user file
    path = f'input/{user_id}/{filename}'

    # If file does not exist, save and add to database
    if not os.path.exists(path):
        file.save(os.path.join(f'input/{user_id}/', filename))

        with open(f'input/{user_id}/{filename}', 'r') as csvfile:

            csv_read = csv.DictReader(csvfile)
            print('*******************88read')

            for line in csv_read:
                customer = crud.create_customer(line)

                db.session.add(customer)
                db.session.commit()

                session['customer_id'] = customer.customer_id

                order = crud.create_order(line)

                db.session.add(order)
                db.session.commit()


if __name__ == "__main__":
    from server import app

    connect_to_db(app)
