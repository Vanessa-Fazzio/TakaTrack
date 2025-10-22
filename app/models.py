from app import db

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    role = db.Column(db.String(50), default='resident') 


class WasteBin(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    location = db.Column(db.String(200), nullable=False)
    capacity = db.Column(db.Float, nullable=False)
    fill_level = db.Column(db.Float, default=0)
    status = db.Column(db.String(50), default='active')  


class CollectionSchedule(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    bin_id = db.Column(db.Integer, db.ForeignKey('waste_bin.id'))
    driver_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    collection_date = db.Column(db.String(50))
    status = db.Column(db.String(50), default='pending')  


class RecyclingRecord(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.String(100))
    weight = db.Column(db.Float)
    date = db.Column(db.String(50))
    collected_by = db.Column(db.Integer, db.ForeignKey('user.id'))
