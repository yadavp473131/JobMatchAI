# 4. models.py
from app.extensions import mongo
from werkzeug.security import generate_password_hash, check_password_hash
from flask import Blueprint, request, jsonify
from bson import ObjectId

def store_scraped_jobs(jobs):
    if not jobs:
        return []

    inserted_jobs = []
    for job in jobs:
        job_id = mongo.db.jobs.insert_one(job).inserted_id
        job['_id'] = str(job_id)
        inserted_jobs.append(job)

    return inserted_jobs

def create_job(data):

    required_fields = ['title', 'category', 'description', 'eligibility', 'requirements','location', 'salary', 'work_details', 'job_type', 'timing','job_posters_id']
    if not all(key in data for key in required_fields):
        raise ValueError('Missing required fields')
    
    
    
    
    job = {
        'title': data['title'],
        'category': data['category'],
        'description': data['description'],
        'eligibility': data['eligibility'],
        'requirements': data['requirements'],
        'location': data['location'],
        'salary': data['salary'],
        'work_details': data['work_details'],
        'job_type': data['job_type'],
        'timing': data['timing'],
        'job_posters_id':  data['job_posters_id'],
    }

    job_id = mongo.db.jobs.insert_one(job).inserted_id
    job['_id'] = str(job_id)
    return job

def fetch_all_jobs():
    jobs = mongo.db.jobs.find()
    return [{
        '_id': str(job['_id']),
        'title': job['title'],
        'category': job['category'],
        'description': job['description'],
        'eligibility': job.get('eligibility', ''),
        'requirements': job.get('requirements', ''),
        'location' : job.get('location',''),
        'salary': job.get('salary', ''),
        'work_details': job.get('work_details', ''),
        'job_type': job.get('job_type', ''),
        'timing': job.get('timing', '')
    } for job in jobs]

def fetch_all_seekers():
    seekers = mongo.db.job_applications.find()
    arr = []

    for seeker in seekers:
        applicant_id = seeker['applicant_id']
        if isinstance(applicant_id, str):  # convert to ObjectId only if it's a string
            applicant_id = ObjectId(applicant_id)
        arr.append(mongo.db.users.find_one({"_id": applicant_id}))

    # print(arr)    
    
    # return [{
        # '_id': str(seeker['applicant_id']),
        # 'title': job['title'],
        # 'category': job['category'],
        # 'description': job['description'],
        # 'eligibility': job.get('eligibility', ''),
        # 'requirements': job.get('requirements', ''),
        # 'location' : job.get('location',''),
        # 'salary': job.get('salary', ''),
        # 'work_details': job.get('work_details', ''),
        # 'job_type': job.get('job_type', ''),
        # 'timing': job.get('timing', '')
    # } for seeker in seekers]
    return arr


def create_user(data):
    role = data.get("role")
    name = data.get("name")
    email = data.get("email")
    password = generate_password_hash(data.get("password"))  # hash password

    user_data = {
        "role": role,
        "name": name,
        "email": email,
        "password": password
    }

    # Additional fields based on role
    if role == "jobseeker":
        user_data["skills"] = data.get("skills")
        user_data["experience"] = data.get("experience")
    elif role == "jobposter":
        user_data["company"] = data.get("company")
        user_data["industry"] = data.get("industry")
    elif role == "admin":
        user_data["adminCode"] = data.get("adminCode")

    try:
        if mongo.db.users.find_one({"email": email}):
            return jsonify({"error": "Email already registered"}), 400

        mongo.db.insert_one(user_data)
        return jsonify({"message": "User registered successfully!"}), 201
    except Exception as e:
        print("Error during registration:", e)
        return jsonify({"error": "Registration failed"}), 500
    
def fetch_a_user(key):
    try:
        if mongo.db.users.find_one({"session_key": key}):
            jobs = mongo.db.jobs.find_one({"session_key": key})
            print(jobs)
            return jsonify({"error": "Email already registered"}), 400

        
        # mongo.db.insert_one(user_data)
        return jsonify({"message": "User registered successfully!"}), 201
    except Exception as e:
        print("Error during registration:", e)
        return jsonify({"error": "Registration failed"}), 500
    user = mock_users.get(key)