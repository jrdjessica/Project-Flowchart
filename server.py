"""Server for running app."""

from datetime import datetime
from flask import Flask, render_template, redirect, request, flash, session, jsonify
from model import db, connect_to_db, Order
from werkzeug.utils import secure_filename

import crud
import seed
import os
import requests
import matplotlib.pyplot as plt
from PIL import Image
from io import BytesIO


from jinja2 import StrictUndefined

app = Flask(__name__)
app.secret_key = "dev"
app.jinja_env.undefined = StrictUndefined


@app.route('/')
def show_homepage():
    """Displays homepage."""

    return render_template('homepage.html')


@app.route('/account', methods=['POST'])
def create_user_account():
    """User creates an account."""

    email = request.form.get('email')
    password = request.form.get('password')

    user = crud.get_user_by_email(email)

    if user:
        # checks if user already created an account with this email
        flash('This email already has an account. Try another email or try logging in.')
    else:
        new_user = crud.create_user(email, password)
        db.session.add(new_user)
        db.session.commit()
        flash('Congratulations. Your account was created.')
    return redirect('/')


@app.route('/login', methods=['POST'])
def user_login():
    """User logs in."""

    email = request.form.get('email')
    password = request.form.get('password')

    user = crud.get_user_by_email(email)

    # check if user has an account and if password matches
    if not user or user.password != password:
        flash('Error. Try again.')
        return redirect('/')
    else:
        session['user_id'] = user.user_id
        flash('You are logged in.')
        return redirect('/file')


@app.route('/file')
def show_upload_file():
    """Show page for user to upload file."""

    return render_template('upload.html')


@app.route('/upload', methods=['POST'])
def upload_file():
    """User uploads csv file that is parsed."""

    file = request.files['file']

    if file:
        filename = secure_filename(file.filename)
        file_type = filename.split('.')[1].lower()
    else:
        flash('Error. No selected file')
        return render_template('upload.html')

    if file_type == 'csv':
        seed.get_orders(file, filename)
        flash('Success')
        return redirect('/map')
    elif file_type != 'csv':
        flash('Error. Incorrect file type')
        return render_template('upload.html')
    else:
        flash('Error')
        return render_template('upload.html')


@app.route('/api/shop')
def shop_info():
    """Return JSON of shop data."""

    orders = [
        {
            'customer_id': order.customer.customer_id,
            'fname': order.customer.fname,
            'lname': order.customer.lname,
            'city': order.customer.city,
            'state': order.customer.state,
            'country': order.customer.country,
            'address': order.customer.address,
            'latitude': order.customer.latitude,
            'longitude': order.customer.longitude,
            'order_id': order.order_id,
            'num_items': order.num_items,
            'date': order.date,
            'total': order.total,
            'net': order.net,
        }
        for order in Order.query.all()
    ]

    return jsonify(orders)


@app.route('/map')
def show_map():
    """Show map and tree map."""

    return render_template('map.html')


@app.route('/calendar')
def show_calendar():
    """Show calendar heat map."""

    return render_template('calendar.html')


@app.route('/api/currency', methods=['POST'])
def get_currency_converter_api():
    """Return converted currency."""

    key = os.environ['CUR_KEY']

    base_cur = request.form.get('enter-cur')
    convert_cur = request.form.get('convert-cur')
    currency_input = float(request.form.get('enter-num'))

    url = f'https://v6.exchangerate-api.com/v6/{key}/pair/{base_cur}/{convert_cur}/{currency_input}'

    response = requests.get(url)
    data = response.json()

    converted_currency = crud.convert_currency(data)
    result = round(converted_currency, 2)

    return render_template('sales.html', result=result, base_cur=base_cur, convert_cur=convert_cur, currency_input=currency_input)


@app.route('/sales')
def show_sale_orders():
    """Show net and total orders."""

    return render_template('sales.html')


@app.route('/inspiration')
def show_inspiration():
    """Show inspiration."""

    return render_template('inspiration.html')


@app.route('/api/inspiration')
def get_image_search():
    """Get images from search."""

    key = os.environ['BING_KEY']
    search_url = "https://api.bing.microsoft.com/v7.0/images/search"
    search_term = request.args.get('search-term')

    headers = {"Ocp-Apim-Subscription-Key": key}
    params = {"q": search_term, "license": "public", "imageType": "photo"}

    response = requests.get(search_url, headers=headers, params=params)
    response.raise_for_status()
    search_results = response.json()
    # thumbnail_urls = [img["thumbnailUrl"]
    #                   for img in search_results["value"][:16]]

    thumbnail_url1 = search_results['value'][0]['thumbnailUrl']
    thumbnail_url2 = search_results['value'][1]['thumbnailUrl']
    thumbnail_url3 = search_results['value'][2]['thumbnailUrl']

    print(thumbnail_url1)
    print(thumbnail_url2)
    print(thumbnail_url3)

    return render_template('inspiration.html', thumbnail_url1=thumbnail_url1, thumbnail_url2=thumbnail_url2, thumbnail_url3=thumbnail_url3)


if __name__ == "__main__":
    connect_to_db(app)
    app.run(debug=True, host="0.0.0.0")
