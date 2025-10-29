from app import ma
from app.models import User, WasteBin, CollectionSchedule, RecyclingRecord

class UserSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = User
        load_instance = True

class WasteBinSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = WasteBin
        load_instance = True

class ScheduleSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = CollectionSchedule
        load_instance = True

class RecyclingSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = RecyclingRecord
        load_instance = True
