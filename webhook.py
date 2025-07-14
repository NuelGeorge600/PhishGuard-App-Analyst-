from flask import Blueprint, request, jsonify

webhook_bp = Blueprint('webhook_bp', __name__)

@webhook_bp.route('/webhook', methods=['POST'])
def flutterwave_webhook():
    data = request.json
    # Log or verify payment here (mock response)
    return jsonify({'message': 'Webhook received', 'data': data}), 200