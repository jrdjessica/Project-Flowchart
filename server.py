"""Server for running app."""

from datetime import datetime
from flask import Flask, render_template, redirect, request, flash, session, jsonify
from model import db, connect_to_db, Customer
from werkzeug.utils import secure_filename

import crud
import seed
import os
import requests

from jinja2 import StrictUndefined

app = Flask(__name__)
app.secret_key = "dev"
app.jinja_env.undefined = StrictUndefined


@app.route('/')
def show_homepage():
    """Displays homepage."""

    return render_template('homepage.html')


@app.route('/demo')
def show_demo():
    """Users view demo data."""

    session['user_id'] = 1

    return redirect('/dashboard')


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


@app.route('/delete')
def delete_user_account():
    """Delete user account data."""

    flash('Your account was successfully deleted.')

    return redirect('/')


@app.route('/file')
def show_upload_file():
    """Show page for user to upload file."""

    return render_template('upload.html')


@app.route('/upload', methods=['POST'])
def upload_file():
    """User uploads csv file that is parsed."""

    uploaded_files = request.files.getlist("file")

    # Iterate through upload files
    for file in uploaded_files:
        if file:
            filename = secure_filename(file.filename)
            file_type = filename.split('.')[1].lower()
        else:
            flash('Error. No selected file')
            return render_template('upload.html')

        if file_type == 'csv':
            seed.get_orders(file, filename)
            flash('Success')
            if file == uploaded_files[-1]:
                return redirect('/dashboard')
        elif file_type != 'csv':
            flash('Error. Incorrect file type')
            return render_template('upload.html')
        else:
            flash('Error')
            return render_template('upload.html')


@app.route('/api/shop')
def shop_info():
    """Return JSON of shop data."""

    user_id = session['user_id']

    orders = [
        {
            'fname': customer.fname,
            'lname': customer.lname,
            'city': customer.city,
            'state': customer.state,
            'country': customer.country,
            'address': customer.address,
            'latitude': customer.latitude,
            'longitude': customer.longitude,
            'num_items': customer.order[0].num_items,
            'date': customer.order[0].date,
            'total': customer.order[0].total,
            'net': customer.order[0].net,
        }
        for customer in Customer.query.filter(Customer.user_id == user_id).all()
    ]

    return jsonify(orders)


@app.route('/dashboard')
def show_dashboard():
    """Show dashboard."""

    return render_template('dashboard.html')


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

    thumbnail_url1 = search_results['value'][0]['thumbnailUrl']
    thumbnail_url2 = search_results['value'][1]['thumbnailUrl']
    thumbnail_url3 = search_results['value'][2]['thumbnailUrl']
    thumbnail_url4 = search_results['value'][3]['thumbnailUrl']
    thumbnail_url5 = search_results['value'][4]['thumbnailUrl']
    thumbnail_url6 = search_results['value'][5]['thumbnailUrl']
    thumbnail_url7 = search_results['value'][6]['thumbnailUrl']
    thumbnail_url8 = search_results['value'][7]['thumbnailUrl']
    thumbnail_url9 = search_results['value'][8]['thumbnailUrl']

    return render_template('inspiration.html',
                           thumbnail_url1=thumbnail_url1,
                           thumbnail_url2=thumbnail_url2,
                           thumbnail_url3=thumbnail_url3,
                           thumbnail_url4=thumbnail_url4,
                           thumbnail_url5=thumbnail_url5,
                           thumbnail_url6=thumbnail_url6,
                           thumbnail_url7=thumbnail_url7,
                           thumbnail_url8=thumbnail_url8,
                           thumbnail_url9=thumbnail_url9)


if __name__ == "__main__":
    connect_to_db(app)
    app.run(debug=True, host="0.0.0.0")
