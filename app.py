
from flask import Flask, jsonify, request
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)

@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "PhishGuard backend is live and running securely with Gunicorn."})

@app.route("/api/test", methods=["POST"])
def test_api():
    data = request.json
    return jsonify({"received": data}), 200

# Note: No app.run() here, because Gunicorn will handle app serving.
