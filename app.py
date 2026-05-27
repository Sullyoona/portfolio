from flask import Flask, send_from_directory
import os

app = Flask(__name__, static_folder='static', static_url_path='/static')

@app.route('/')
def index():
    return send_from_directory('templates', 'index.html')

@app.route('/script.js')
def serve_script():
    return send_from_directory('script', 'script.js')

@app.route('/static/<path:path>')
def serve_static(path):
    return send_from_directory('static', path)

if __name__ == '__main__':
    app.run(debug=True)