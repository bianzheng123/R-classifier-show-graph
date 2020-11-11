from flask import request
from flask import Flask, render_template, redirect, url_for, jsonify

app = Flask(__name__, static_url_path='')


@app.route('/views/template_manage.html', methods=['GET'])
def home_page_redirect():
    return app.send_static_file('views/main.html')


@app.route('/index.html', methods=['GET'])
@app.route('/index', methods=['GET'])
@app.route('/', methods=['GET'])
def home_page():
    return redirect(url_for('home_page_redirect'))


if __name__ == '__main__':
    app.run('0.0.0.0', 8080, threaded=True)
