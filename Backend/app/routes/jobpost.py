# 2. routes/job_post.py
from flask import Blueprint, request, jsonify
from app.models import create_job


job_post_routes = Blueprint('job_post_routes', __name__)


# Endpoint to post a job
@job_post_routes.route('/post-job', methods=['POST'])
def post_job():
    
    data = request.get_json()
    # print(data)
    try:
        job = create_job(data)
        return jsonify({'message': 'Job posted successfully', 'job': job}), 201
    except ValueError as ve:
        return jsonify({'error': str(ve)}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
