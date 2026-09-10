from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def my_existing_logic():
    return {"status": "success", "message": "Backend code executed"}

@app.route('/api/run', methods=['GET', 'POST'])
def handle_request():
    result = my_existing_logic()
    return jsonify(result)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
