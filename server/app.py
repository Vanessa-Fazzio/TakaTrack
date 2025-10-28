from flask import Flask, jsonify, request
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt
from flask_restful import Api, Resource
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timedelta
from flask_jwt_extended import JWTManager
from flask_socketio import SocketIO, emit
from flask_mail import Mail, Message
from flask_apscheduler import APScheduler
from dotenv import load_dotenv
import os
from model import CollectionPoint, Collector, CollectionSchedule, db


load_dotenv()
app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///TakaTrack.db"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False


app.config['MAIL_SERVER'] = os.getenv('MAIL_SERVER')
app.config['MAIL_PORT'] = int(os.getenv('MAIL_PORT'))
app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USE_SSL'] = False


db.init_app(app)
migrate = Migrate(app, db)
bcrypt = Bcrypt(app)
CORS(app)
api = Api(app)
jwt = JWTManager(app)
socketio = SocketIO(app, cors_allowed_origins="*")
mail = Mail(app)
scheduler = APScheduler()
scheduler.init_app(app)
scheduler.start()


@app.route('/send')
def send():
    message = Message(
        subject="Hello from TakaTrack",
        recipients=["test.mailtrap1234@gmail.com"],
        sender=('Peter from TakaTrack', 'peter@mailtrap.club')
    )
    message.body = "This is a test email sent from the TakaTrack Flask application using Mailtrap."
    mail.send(message)
    return "Email sent successfully!"


def assign_collection_days():
    points = CollectionPoint.query.all()
    today = datetime.now()

    for p in points:
        next_date = today + timedelta(days=3)
        existing_schedule = CollectionSchedule.query.filter_by(
            point_id=p.id,
            collection_date=next_date.date()
        ).first()

        if not existing_schedule:
            schedule = CollectionSchedule(point_id=p.id, collection_date=next_date)
            db.session.add(schedule)
            db.session.commit()

            socketio.emit("new_schedule", schedule.serialize())

    print("Automated collection schedules updated.")


@scheduler.task('cron', id='auto_schedule', hour=0)
def daily_schedule_task():
    with app.app_context():
        assign_collection_days()


@app.route("/assign_days", methods=["POST"])
def assign_days():
    assign_collection_days()
    return jsonify({"message": "Collection days assigned successfully"}), 200


class CollectionPointsResource(Resource):
    def get(self):
        points = CollectionPoint.query.all()
        return jsonify([p.serialize() for p in points])

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

        
        assign_collection_days()

        return new_point.serialize(), 201

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
            collector.last_updated = datetime.utcnow()
        else:
            collector = Collector(latitude=latitude, longitude=longitude)
            db.session.add(collector)
        db.session.commit()

        
        socketio.emit("collector_update", collector.serialize)

        return {
            "message": "Collector location updated",
            "data": collector.serialize()
        }, 200

#
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
