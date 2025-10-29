from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, verify_jwt_in_request
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy.exc import IntegrityError
from datetime import datetime
from functools import wraps
from app import db
from app.models import User, WasteBin, CollectionSchedule, RecyclingRecord
from app.schemas import UserSchema, WasteBinSchema, ScheduleSchema, RecyclingSchema

main = Blueprint('main', __name__)

user_schema = UserSchema()
users_schema = UserSchema(many=True)
bin_schema = WasteBinSchema()
bins_schema = WasteBinSchema(many=True)
schedule_schema = ScheduleSchema()
schedules_schema = ScheduleSchema(many=True)
recycle_schema = RecyclingSchema()
recycles_schema = RecyclingSchema(many=True)

def optional_jwt_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        try:
            verify_jwt_in_request(optional=True)
        except Exception:
            return jsonify({"error": "Invalid or missing Authorization header. Include 'Bearer <token>' in headers."}), 401
        return f(*args, **kwargs)
    return decorated_function

@main.route("/api/register", methods=["POST"])
def register_user():
    """Register a new user"""
    data = request.get_json()

    if not data.get("email") or not data.get("password"):
        return jsonify({"error": "Email and password are required"}), 400

    if User.query.filter_by(email=data["email"]).first():
        return jsonify({"error": "User already exists"}), 409

    hashed_pw = generate_password_hash(data["password"])

    new_user = User(
        name=data.get("name", "Anonymous"),
        email=data["email"],
        password=hashed_pw,
        role=data.get("role", "resident")
    )

    db.session.add(new_user)
    db.session.commit()

    return jsonify({
        "message": "User registered successfully",
        "user": user_schema.dump(new_user)
    }), 201

@main.route("/api/login", methods=["POST"])
def login_user():
    """Authenticate user and return JWT"""
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    user = User.query.filter_by(email=email).first()

    if not user or not check_password_hash(user.password, password):
        return jsonify({"error": "Invalid email or password"}), 401

    access_token = create_access_token(identity=user.id)

    return jsonify({
        "message": "Login successful",
        "token": access_token,
        "user": user_schema.dump(user)
    }), 200

@main.route('/api/users', methods=['POST'])
@optional_jwt_required
def add_user():
    """Add a new user (protected)"""
    try:
        data = request.get_json()
        
        if not data.get('name') or not data.get('email'):
            return jsonify({"error": "Name and email are required"}), 400
            
        if User.query.filter_by(email=data['email']).first():
            return jsonify({"error": "User already exists"}), 409
            
        new_user = User(
            name=data['name'],
            email=data['email'],
            role=data.get('role', 'resident'),
            password=generate_password_hash(data.get('password', 'default123'))
        )
        db.session.add(new_user)
        db.session.commit()
        return user_schema.jsonify(new_user), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to create user"}), 500

@main.route('/api/users', methods=['GET'])
@optional_jwt_required
def get_users():
    """Get all users (protected)"""
    users = User.query.all()
    return users_schema.jsonify(users)

@main.route('/api/users/<int:id>', methods=['PUT'])
@optional_jwt_required
def update_user(id):
    """Update a user (protected)"""
    try:
        user = User.query.get_or_404(id)
        data = request.get_json()

        if data.get('email') and data['email'] != user.email:
            if User.query.filter_by(email=data['email']).first():
                return jsonify({"error": "Email already exists"}), 409

        user.name = data.get('name', user.name)
        user.email = data.get('email', user.email)
        user.role = data.get('role', user.role)
        if data.get('password'):
            user.password = generate_password_hash(data['password'])

        db.session.commit()
        return user_schema.jsonify(user)
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to update user"}), 500

@main.route('/api/users/<int:id>', methods=['DELETE'])
@optional_jwt_required
def delete_user(id):
    """Delete a user (protected)"""
    try:
        user = User.query.get_or_404(id)
        db.session.delete(user)
        db.session.commit()
        return jsonify({"message": "User deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to delete user"}), 500

@main.route('/api/bins', methods=['POST'])
@optional_jwt_required
def add_bin():
    try:
        data = request.get_json()
        
        if not data.get('location') or not data.get('capacity'):
            return jsonify({"error": "Location and capacity are required"}), 400
            
        new_bin = WasteBin(location=data['location'], capacity=data['capacity'])
        db.session.add(new_bin)
        db.session.commit()
        return bin_schema.jsonify(new_bin), 201
    except IntegrityError:
        db.session.rollback()
        return jsonify({"error": "Bin already exists at this location"}), 409
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to create bin"}), 500

@main.route('/api/bins', methods=['GET'])
@optional_jwt_required
def get_bins():
    bins = WasteBin.query.all()
    return bins_schema.jsonify(bins)

@main.route('/api/bins/<int:id>', methods=['PUT'])
@optional_jwt_required
def update_bin(id):
    try:
        bin = WasteBin.query.get_or_404(id)
        data = request.get_json()
        
        bin.location = data.get('location', bin.location)
        bin.capacity = data.get('capacity', bin.capacity)
        bin.current_level = data.get('current_level', bin.current_level)
        
        db.session.commit()
        return bin_schema.jsonify(bin)
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to update bin"}), 500

@main.route('/api/bins/<int:id>', methods=['DELETE'])
@optional_jwt_required
def delete_bin(id):
    try:
        bin = WasteBin.query.get_or_404(id)
        db.session.delete(bin)
        db.session.commit()
        return jsonify({"message": "Bin deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to delete bin"}), 500

@main.route('/api/schedules', methods=['POST'])
@optional_jwt_required
def add_schedule():
    try:
        data = request.get_json()
        
        if not all([data.get('bin_id'), data.get('driver_id'), data.get('collection_date')]):
            return jsonify({"error": "Bin ID, driver ID, and collection date are required"}), 400
            
        new_schedule = CollectionSchedule(
            bin_id=data['bin_id'],
            driver_id=data['driver_id'],
            collection_date=data['collection_date']
        )
        db.session.add(new_schedule)
        db.session.commit()
        return schedule_schema.jsonify(new_schedule), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to create schedule"}), 500

@main.route('/api/schedules', methods=['GET'])
@optional_jwt_required
def get_schedules():
    schedules = CollectionSchedule.query.all()
    return schedules_schema.jsonify(schedules)

@main.route('/api/schedules/<int:id>', methods=['PUT'])
@optional_jwt_required
def update_schedule(id):
    try:
        schedule = CollectionSchedule.query.get_or_404(id)
        data = request.get_json()
        
        schedule.bin_id = data.get('bin_id', schedule.bin_id)
        schedule.driver_id = data.get('driver_id', schedule.driver_id)
        schedule.collection_date = data.get('collection_date', schedule.collection_date)
        schedule.status = data.get('status', schedule.status)
        
        db.session.commit()
        return schedule_schema.jsonify(schedule)
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to update schedule"}), 500

@main.route('/api/schedules/<int:id>', methods=['DELETE'])
@optional_jwt_required
def delete_schedule(id):
    try:
        schedule = CollectionSchedule.query.get_or_404(id)
        db.session.delete(schedule)
        db.session.commit()
        return jsonify({"message": "Schedule deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to delete schedule"}), 500

@main.route('/api/recycling', methods=['POST'])
@optional_jwt_required
def add_recycling():
    try:
        data = request.get_json()
        
        if not all([data.get('type'), data.get('weight'), data.get('date'), data.get('collected_by')]):
            return jsonify({"error": "Type, weight, date, and collected_by are required"}), 400
            
        new_record = RecyclingRecord(
            type=data['type'],
            weight=data['weight'],
            date=data['date'],
            collected_by=data['collected_by']
        )
        db.session.add(new_record)
        db.session.commit()
        return recycle_schema.jsonify(new_record), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to create recycling record"}), 500

@main.route('/api/recycling', methods=['GET'])
@optional_jwt_required
def get_recycling():
    records = RecyclingRecord.query.all()
    return recycles_schema.jsonify(records)

@main.route('/api/recycling/<int:id>', methods=['PUT'])
@optional_jwt_required
def update_recycling(id):
    try:
        record = RecyclingRecord.query.get_or_404(id)
        data = request.get_json()
        
        record.type = data.get('type', record.type)
        record.weight = data.get('weight', record.weight)
        record.date = data.get('date', record.date)
        record.collected_by = data.get('collected_by', record.collected_by)
        
        db.session.commit()
        return recycle_schema.jsonify(record)
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to update recycling record"}), 500

@main.route('/api/recycling/<int:id>', methods=['DELETE'])
@optional_jwt_required
def delete_recycling(id):
    try:
        record = RecyclingRecord.query.get_or_404(id)
        db.session.delete(record)
        db.session.commit()
        return jsonify({"message": "Recycling record deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to delete recycling record"}), 500
