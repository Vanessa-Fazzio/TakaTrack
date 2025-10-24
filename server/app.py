from flask import Flask, jsonify, request
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt
from flask_restful import Api, Resource
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import  timedelta
from flask_jwt_extended import  JWTManager
from flask_socketio import SocketIO, emit
from model import CollectionPoint, Collector, db


app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///TakaTrack.db"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS']=False

jwt = JWTManager(app)

db.init_app(app)
migrate=Migrate(app,db)

CORS(app)
bcrypt=Bcrypt(app)
api = Api(app)

CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

class CollectionPointsResource(Resource):
    def get(self):
        points = CollectionPoint.query.all()
        points_dict = [p.serialize() for p in points]
        return jsonify(points_dict)

    def post(self):
        data = request.get_json()
        name = data.get("name")
        latitude = data.get("latitude")
        longitude = data.get("longitude")

        if not all([name, latitude, longitude]):
            return {"message": "Missing name or coordinates"}, 400

        new_point = CollectionPoint(name=name, latitude=latitude, longitude=longitude)
        db.session.add(new_point)
        db.session.commit()
        return new_point.serialize(), 201


# Collector current location
class CollectorResource(Resource):
    def get(self):
        collector = Collector.query.first()
        if not collector:
            return jsonify([])
        return jsonify([collector.serialize()])

    def post(self):
        data = request.get_json()
        latitude = data.get("latitude")
        longitude = data.get("longitude")

        if latitude is None or longitude is None:
            return {"message": "Missing latitude or longitude"}, 400

        collector = Collector.query.first()
        if collector:
            collector.latitude = latitude
            collector.longitude = longitude
        else:
            collector = Collector(latitude=latitude, longitude=longitude)
            db.session.add(collector)
        db.session.commit()

        # Broadcast new location to all connected clients
        socketio.emit("collector_update", collector.serialize(), broadcast=True)

        return {
            "message": "Collector location updated",
            "data": collector.serialize()
        }, 200



@socketio.on("connect")
def handle_connect():
    print("Client connected")
    collector = Collector.query.first()
    if collector:
        emit("collector_update", collector.serialize())


@socketio.on("disconnect")
def handle_disconnect():
    print("Client disconnected")


api.add_resource(CollectionPointsResource, "/collection_points")
api.add_resource(CollectorResource, "/collector")

if __name__ == "__main__":
    socketio.run(app, debug=True, host="0.0.0.0", port=5555)