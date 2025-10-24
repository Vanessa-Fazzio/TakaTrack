from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
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

@main.route("/api/register", methods=["POST"])
def register_user():
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
@jwt_required()
def add_user():
    current_user_id = get_jwt_identity()
    data = request.get_json()

    new_user = User(
        name=data['name'],
        email=data['email'],
        role=data.get('role', 'resident')
    )
    db.session.add(new_user)
    db.session.commit()
    return user_schema.jsonify(new_user), 201

@main.route('/api/users', methods=['GET'])
@jwt_required()
def get_users():
    users = User.query.all()
    return users_schema.jsonify(users)

@main.route('/api/users/<int:id>', methods=['PUT'])
@jwt_required()
def update_user(id):
    user = User.query.get_or_404(id)
    data = request.get_json()

    user.name = data.get('name', user.name)
    user.email = data.get('email', user.email)
    user.role = data.get('role', user.role)

    db.session.commit()
    return user_schema.jsonify(user)

@main.route('/api/users/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_user(id):
    user = User.query.get_or_404(id)
    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": "User deleted successfully"}), 200

@main.route('/api/bins', methods=['POST'])
@jwt_required()
def add_bin():
    data = request.get_json()
    new_bin = WasteBin(location=data['location'], capacity=data['capacity'])
    db.session.add(new_bin)
    db.session.commit()
    return bin_schema.jsonify(new_bin), 201


@main.route('/api/bins', methods=['GET'])
@jwt_required()
def get_bins():
    bins = WasteBin.query.all()
    return bins_schema.jsonify(bins)

@main.route('/api/schedules', methods=['POST'])
@jwt_required()
def add_schedule():
    data = request.get_json()
    new_schedule = CollectionSchedule(
        bin_id=data['bin_id'],
        driver_id=data['driver_id'],
        collection_date=data['collection_date']
    )
    db.session.add(new_schedule)
    db.session.commit()
    return schedule_schema.jsonify(new_schedule), 201

@main.route('/api/schedules', methods=['GET'])
@jwt_required()
def get_schedules():
    schedules = CollectionSchedule.query.all()
    return schedules_schema.jsonify(schedules)

@main.route('/api/recycling', methods=['POST'])
@jwt_required()
def add_recycling():
    data = request.get_json()
    new_record = RecyclingRecord(
        type=data['type'],
        weight=data['weight'],
        date=data['date'],
        collected_by=data['collected_by']
    )
    db.session.add(new_record)
    db.session.commit()
    return recycle_schema.jsonify(new_record), 201


@main.route('/api/recycling', methods=['GET'])
@jwt_required()
def get_recycling():
    records = RecyclingRecord.query.all()
    return recycles_schema.jsonify(records)
