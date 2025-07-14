from flask import Flask
from scan_url import scan_url_bp
from pay_per_click import pay_click_bp
from webhook import webhook_bp
from email_analyzer import email_analyzer_bp

def create_app():
    app = Flask(__name__)
    app.register_blueprint(scan_url_bp)
    app.register_blueprint(pay_click_bp)
    app.register_blueprint(webhook_bp)
    app.register_blueprint(email_analyzer_bp)
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, host='0.0.0.0', port=5000)@app.route('/event-stats')
def event_stats():
    total_events = sum(user_balances.values()) // 50000 if user_balances else 0
    return jsonify({'total_events': total_events})