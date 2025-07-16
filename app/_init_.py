from flask import Flask
from dotenv import load_dotenv
import os

def create_app():
    load_dotenv()
    app = Flask(__name__)
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')

    from .routes import main
    from .webhook import webhook_bp
    from .admin import admin_bp

    app.register_blueprint(main)
    app.register_blueprint(webhook_bp, url_prefix="/flutterwave")
    app.register_blueprint(admin_bp, url_prefix="/admin")

    return app
