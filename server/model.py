from flask_sqlalchemy import SQLAlchemy
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import validates
db=SQLAlchemy()


class CollectionPoint(db.Model, SerializerMixin):
    __tablename__ = 'collection_points'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    latitude = db.Column(db.Float, nullable=False)
    longitude = db.Column(db.Float, nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "latitude": self.latitude,
            "longitude": self.longitude
        }


class Collector(db.Model, SerializerMixin):
    __tablename__ = 'collectors'
    id = db.Column(db.Integer, primary_key=True)
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)

    def serialize(self):
        return {
            "id": self.id,
            "latitude": self.latitude,
            "longitude": self.longitude
        }