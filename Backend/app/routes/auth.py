from flask import Flask, request, jsonify, Blueprint
from flask_pymongo import PyMongo
from flask_cors import CORS
from app.extensions import mongo
from werkzeug.security import generate_password_hash, check_password_hash
from app.models import create_user
import uuid

authenticate = Blueprint('authenticate', __name__)

CORS(authenticate, resources={r"/*": {"origins": "http://localhost:3000"}})

@authenticate.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    confirm_password = data.get('cpassword')
    print(data)
        # Basic validation
    if not all([name, email, password, confirm_password]):
        return jsonify({"error": "All fields are required"}), 400

    if password != confirm_password:
        return jsonify({"error": "Passwords do not match"}), 400

        # Check if user already exists
    if mongo.db.users.find_one({'email': data['email']}):
    # if users_collection.find_one({"email": email}):
        return jsonify({"error": "User with this email already exists"}), 400

        # Hash password and store
    hashed_password = generate_password_hash(password)
    user = {
            "name": name,
            "email": email,
            "password": hashed_password
    }
    # mongo.db.users.insert_one(user).inserted_id
    # users_collection.insert_one(user_data)

    user_id = mongo.db.users.insert_one(user).inserted_id
    return jsonify({'message': 'User registered successfully', 'user_id': str(user_id)}), 201

    # return jsonify({"message": "User registered successfully"}), 201


    # data = request.get_json
    # # required_fields = ['name', 'email', 'password', 'user_type', 'phone', 'address', 'userName']
    # required_fields = ['name', 'email', 'password','cpassword']
    # if not all(field in data for field in required_fields):
    #     return jsonify({'error': 'Missing required fields'}), 400

    # if mongo.db.users.find_one({'email': data['email']}):
    #     return jsonify({'error': 'Email already exists'}), 400

    # hashed_password = generate_password_hash(data['password'])

    

    # user = {
    #     'name': data['name'],
    #     'email': data['email'],
    #     'password': hashed_password,
    #     # 'user_type': data['user_type'],
    #     # 'phone' : data['phone'],
    #     # 'address' : data['address'],
    #     # 'userName' : data['userName']
    # }


   

    # user_id = mongo.db.users.insert_one(user).inserted_id
    # return jsonify({'message': 'User registered successfully', 'user_id': str(user_id)}), 201

# User Login Route
@authenticate.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = mongo.db.users.find_one({'email': data['email']})
    
    
    if user and check_password_hash(user['password'], data['password']):
        # Generate a random session key
        session_key = str(uuid.uuid4())
        print("Sessoin key "+session_key)
        # You could optionally store session_key in the database if you want to validate it later
        mongo.db.users.update_one(
            {'_id': user['_id']},
            {'$set': {'session_key': session_key}}
        )
        id = str(user['_id'])
        return jsonify({
            'name': user['name'],
            'message': 'Login successful',
            # 'user_type': user['user_type'],
            'email': user['email'],
            # 'username': user.get('username', ''),  # assuming username field exists,
            # 'userName' : user['userName'],
            # 'phone':user['phone'],
            # 'address': user['address'],
            'sessionKey': session_key,
            'Id': id,
        }), 200
    return jsonify({'error': 'Invalid email or password'}), 401
