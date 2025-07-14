from flask import Blueprint, request, jsonify

email_analyzer_bp = Blueprint('email_analyzer_bp', __name__)

@email_analyzer_bp.route('/analyze-email', methods=['POST'])
def analyze_email():
    header = request.json.get('header')
    if not header:
        return jsonify({'error': 'Header is required'}), 400

    # Basic parsing (mock logic)
    results = {
        'received_lines': [line for line in header.split('\n') if line.lower().startswith('received')],
        'x_origination': [line for line in header.split('\n') if 'x-originating-ip' in line.lower()]
    }
    return jsonify({'analysis': results})