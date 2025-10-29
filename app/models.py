from app import db

class User(db.Model):
    __tablename__ = "user"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)  
    role = db.Column(db.String(50), default='resident')

    def __repr__(self):
        return f"<User {self.name}>"

class WasteBin(db.Model):
    __tablename__ = "waste_bin"

    id = db.Column(db.Integer, primary_key=True)
    location = db.Column(db.String(200), nullable=False)
    capacity = db.Column(db.Float, nullable=False)
    fill_level = db.Column(db.Float, default=0)
    status = db.Column(db.String(50), default='active')

    def __repr__(self):
        return f"<WasteBin {self.location}>"


class CollectionSchedule(db.Model):
    __tablename__ = "collection_schedule"

    id = db.Column(db.Integer, primary_key=True)
    bin_id = db.Column(db.Integer, db.ForeignKey('waste_bin.id'))
    driver_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    collection_date = db.Column(db.String(50))
    status = db.Column(db.String(50), default='pending')

    def __repr__(self):
        return f"<CollectionSchedule Bin:{self.bin_id} Driver:{self.driver_id}>"

class RecyclingRecord(db.Model):
    __tablename__ = "recycling_record"

    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.String(100))
    weight = db.Column(db.Float)
    date = db.Column(db.String(50))
    collected_by = db.Column(db.Integer, db.ForeignKey('user.id'))

    def __repr__(self):
        return f"<RecyclingRecord {self.type}>"
