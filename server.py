"""Server for running app."""

from collections import deque
from datetime import datetime
from flask import Flask, render_template, redirect, request, flash, session, jsonify
from model import db, connect_to_db, Order
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

    user_id = session['user_id']

    crud.delete_account(user_id)

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
            'fname': order.customer.fname,
            'lname': order.customer.lname,
            'city': order.customer.city,
            'state': order.customer.state,
            'country': order.customer.country,
            'address': order.customer.address,
            'latitude': order.customer.latitude,
            'longitude': order.customer.longitude,
            'num_items': order.num_items,
            'date': order.date,
            'total': order.total,
            'net': order.net,
        }
        for order in Order.query.filter(Order.user_id == user_id).all()
    ]

    return jsonify(orders)


@app.route('/dashboard')
def show_dashboard():
    """Show dashboard."""

    return render_template('dashboard.html')


@app.route('/map')
def show_map():
    """Show map and tree map."""

    key = os.environ['API_KEY']

    return render_template('map.html', key=key)


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

    session['result'] = result
    session['base_cur'] = base_cur
    session['convert_cur'] = convert_cur
    session['currency_input'] = currency_input

    return redirect('/sales')


@app.route('/sales')
def show_sale_orders():
    """Show net and total orders."""

    if session.get('result'):
        result = session['result']
        base_cur = session['base_cur']
        convert_cur = session['convert_cur']
        currency_input = session['currency_input']
    else:
        result = ''
        base_cur = ''
        convert_cur = ''
        currency_input = ''

    return render_template('sales.html', result=result, base_cur=base_cur, convert_cur=convert_cur, currency_input=currency_input)


@app.route('/inspiration')
def show_inspiration():
    """Show inspiration."""

    if session.get('searches'):
        searches = session['searches']
        thumbnail_url1 = session['thumbnail_url1']
        thumbnail_url2 = session['thumbnail_url2']
        thumbnail_url3 = session['thumbnail_url3']
        thumbnail_url4 = session['thumbnail_url4']
        thumbnail_url5 = session['thumbnail_url5']
        thumbnail_url6 = session['thumbnail_url6']
        thumbnail_url7 = session['thumbnail_url7']
        thumbnail_url8 = session['thumbnail_url8']
        thumbnail_url9 = session['thumbnail_url9']
        thumbnail_url10 = session['thumbnail_url10']
        thumbnail_url11 = session['thumbnail_url11']
        thumbnail_url12 = session['thumbnail_url12']
        thumbnail_url13 = session['thumbnail_url13']
        thumbnail_url14 = session['thumbnail_url14']
        thumbnail_url15 = session['thumbnail_url15']
    else:
        searches = ''
        thumbnail_url1 = ''
        thumbnail_url2 = ''
        thumbnail_url3 = ''
        thumbnail_url4 = ''
        thumbnail_url5 = ''
        thumbnail_url6 = ''
        thumbnail_url7 = ''
        thumbnail_url8 = ''
        thumbnail_url9 = ''
        thumbnail_url10 = ''
        thumbnail_url11 = ''
        thumbnail_url12 = ''
        thumbnail_url13 = ''
        thumbnail_url14 = ''
        thumbnail_url15 = ''

    return render_template('inspiration.html',
                           searches=searches,
                           thumbnail_url1=thumbnail_url1,
                           thumbnail_url2=thumbnail_url2,
                           thumbnail_url3=thumbnail_url3,
                           thumbnail_url4=thumbnail_url4,
                           thumbnail_url5=thumbnail_url5,
                           thumbnail_url6=thumbnail_url6,
                           thumbnail_url7=thumbnail_url7,
                           thumbnail_url8=thumbnail_url8,
                           thumbnail_url9=thumbnail_url9,
                           thumbnail_url10=thumbnail_url10,
                           thumbnail_url11=thumbnail_url11,
                           thumbnail_url12=thumbnail_url12,
                           thumbnail_url13=thumbnail_url13,
                           thumbnail_url14=thumbnail_url14,
                           thumbnail_url15=thumbnail_url15)


@app.route('/api/searches')
def get_recent_searches():
    """Get recent searches."""

    searches = session["searches"]

    return jsonify(searches)


@app.route('/api/inspiration')
def get_image_search():
    """Get images from search."""

    key = os.environ['BING_KEY']
    search_url = "https://api.bing.microsoft.com/v7.0/images/search"
    search_term = request.args.get('search-term')

    if session.get("searches") is None:
        session["searches"] = []
        session['searches'].append(search_term)
    else:
        searches = session['searches']
        searches.append(search_term)
        session['searches'] = searches

    headers = {"Ocp-Apim-Subscription-Key": key}
    params = {"q": search_term, "license": "public", "imageType": "photo"}

    response = requests.get(search_url, headers=headers, params=params)
    response.raise_for_status()
    search_results = response.json()

    session['thumbnail_url1'] = search_results['value'][0]['thumbnailUrl']
    session['thumbnail_url2'] = search_results['value'][1]['thumbnailUrl']
    session['thumbnail_url3'] = search_results['value'][2]['thumbnailUrl']
    session['thumbnail_url4'] = search_results['value'][3]['thumbnailUrl']
    session['thumbnail_url5'] = search_results['value'][4]['thumbnailUrl']
    session['thumbnail_url6'] = search_results['value'][5]['thumbnailUrl']
    session['thumbnail_url7'] = search_results['value'][6]['thumbnailUrl']
    session['thumbnail_url8'] = search_results['value'][7]['thumbnailUrl']
    session['thumbnail_url9'] = search_results['value'][8]['thumbnailUrl']
    session['thumbnail_url10'] = search_results['value'][9]['thumbnailUrl']
    session['thumbnail_url11'] = search_results['value'][10]['thumbnailUrl']
    session['thumbnail_url12'] = search_results['value'][11]['thumbnailUrl']
    session['thumbnail_url13'] = search_results['value'][12]['thumbnailUrl']
    session['thumbnail_url14'] = search_results['value'][13]['thumbnailUrl']
    session['thumbnail_url15'] = search_results['value'][14]['thumbnailUrl']

    if len(session['searches']) > 5:
        searches.pop(0)

    return redirect('/inspiration')


if __name__ == "__main__":
    connect_to_db(app)
    app.run(debug=True, host="0.0.0.0")
