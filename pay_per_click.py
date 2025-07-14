from flask import Blueprint, request, jsonify

pay_click_bp = Blueprint('pay_click_bp', __name__)

# Mock balance tracker
user_balances = {}

@pay_click_bp.route('/event', methods=['POST'])
def track_event():
    data = request.json
    user_id = data.get('user_id')
    event_type = data.get('event_type')  # visit, signup, login, reuse

    if not user_id or not event_type:
        return jsonify({'error': 'Missing user_id or event_type'}), 400

    credit = 50000  # ₦50,000 per event
    user_balances[user_id] = user_balances.get(user_id, 0) + credit

    return jsonify({'message': f'Credited ₦{credit} for {event_type}', 'total': user_balances[user_id]})