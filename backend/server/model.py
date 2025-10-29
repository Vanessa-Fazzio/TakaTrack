from flask_sqlalchemy import SQLAlchemy
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import validates
from datetime import datetime, timedelta

db = SQLAlchemy()

class CollectionPoint(db.Model, SerializerMixin):
    __tablename__ = 'collection_points'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    latitude = db.Column(db.Float, nullable=False)
    longitude = db.Column(db.Float, nullable=False)

    schedules = db.relationship("CollectionSchedule", backref="collection_point", cascade="all, delete-orphan")

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "latitude": self.latitude,
            "longitude": self.longitude,
            "schedules": [s.serialize() for s in self.schedules] if self.schedules else []
        }

class Collector(db.Model, SerializerMixin):
    __tablename__ = 'collectors'

    id = db.Column(db.Integer, primary_key=True)
    latitude = db.Column(db.Float, nullable=True)
    longitude = db.Column(db.Float, nullable=True)
    last_updated = db.Column(db.DateTime, default=datetime.utcnow)

    def serialize(self):
        return {
            "id": self.id,
            "latitude": self.latitude,
            "longitude": self.longitude,
            "last_updated": self.last_updated.isoformat() if self.last_updated else None
        }


class CollectionSchedule(db.Model, SerializerMixin):
    __tablename__ = "collection_schedules"

    id = db.Column(db.Integer, primary_key=True)
    point_id = db.Column(db.Integer, db.ForeignKey("collection_points.id"), nullable=False)
    collection_date = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String(50), default="scheduled")

    def serialize(self):
        return {
            "id": self.id,
            "point_id": self.point_id,
            "collection_date": self.collection_date.isoformat(),
            "status": self.status
        }
