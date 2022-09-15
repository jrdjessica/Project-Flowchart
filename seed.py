from model import connect_to_db, db
from flask import session


from werkzeug.utils import secure_filename
import csv
import os
import crud


def get_orders(file):
    """Reads csv and loads data into database."""

    filename = secure_filename(file.filename)
    file.save(os.path.join('input', filename))

    with open(f'input/{filename}', 'r') as csvfile:
        csv_read = csv.DictReader(csvfile)

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
