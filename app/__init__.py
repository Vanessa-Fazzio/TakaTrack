from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_marshmallow import Marshmallow
from flask_cors import CORS
from app.config import Config

db = SQLAlchemy()
ma = Marshmallow()  
jwt = JWTManager()

def create_app():
    """Flask application factory"""
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    ma.init_app(app)  
    jwt.init_app(app)
    CORS(app)

    from app.routes import main
    app.register_blueprint(main)

    with app.app_context():
        db.create_all()

    return app
