from flask import Flask
from flask_cors import CORS
from .routes.scan import scan_route
from .routes.dashboard import dashboard
from .routes.auth import auth

def create_app():
    app = Flask(__name__)
    app.secret_key = 'your-secret-key'
    CORS(app)

    app.register_blueprint(scan_route)
    app.register_blueprint(dashboard)
    app.register_blueprint(auth)

    return app