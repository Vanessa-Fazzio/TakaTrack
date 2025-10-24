from flask import Flask 
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt
from flask_restful import Api
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import  timedelta
from flask_jwt_extended import  JWTManager

db = SQLAlchemy()
app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///TakaTrack.db"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS']=False

jwt = JWTManager(app)

db.init_app(app)
migrate=Migrate(app,db)

CORS(app)
bcrypt=Bcrypt(app)
api = Api(app)

if __name__ == "__main__":
    app.run(port=5555, debug=True)