import os
import requests
from flask import Blueprint, request, jsonify

scan_url_bp = Blueprint('scan_url_bp', __name__)
VIRUSTOTAL_API_KEY = os.getenv('VIRUSTOTAL_API_KEY')
INTERNAL_API_KEY = os.getenv('INTERNAL_API_KEY')

@scan_url_bp.route('/scan-url', methods=['POST'])
def scan_url():
    data = request.json
    url = data.get('url')
    api_key = data.get('api_key')

    if api_key != INTERNAL_API_KEY:
        return jsonify({'error': 'Unauthorized'}), 403

    headers = {'x-apikey': VIRUSTOTAL_API_KEY}
    response = requests.get(f"https://www.virustotal.com/api/v3/urls", headers=headers)
    return jsonify({'message': 'Scan initiated (mock)', 'url': url})