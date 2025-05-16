# 3. routes/jobs.py
from flask import Blueprint, jsonify
from app.models import fetch_all_jobs

jobs_routes = Blueprint('jobs_routes', __name__)

# Endpoint to get all jobs
@jobs_routes.route('/jobs', methods=['GET'])
def get_jobs():
    try:
        job_list = fetch_all_jobs()
        return jsonify(job_list), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500