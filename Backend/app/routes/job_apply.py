from app.extensions import mongo
from flask import Flask, request, jsonify, Blueprint
# from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity
from bson import ObjectId
from datetime import datetime

job_apply = Blueprint('job_apply', __name__)

@job_apply.route('/apply', methods=['POST'])
# @jwt_required()
def apply_to_job():
    
    data = request.get_json()
    job_id = data.get('jobId')
    # applicant_id = ObjectId(get_jwt_identity())
    applicant_id = data.get('applicantId')

    job = mongo.db.jobs.find_one({"_id": ObjectId(job_id)})
    if not job:
        return jsonify({"message": "Job not found"}), 404

    # Prevent duplicate applications
    already_applied = mongo.db.job_applications.find_one({
        "job_id": ObjectId(job_id),
        "applicant_id": applicant_id
    })
    if already_applied:
        return jsonify({"message": "You already applied to this job"}), 400

    application = {
        "job_id": ObjectId(job_id),
        "applicant_id": applicant_id,
        "job_poster_id": job["job_posters_id"],
        "applied_at": datetime.utcnow()
    }

    mongo.db.job_applications.insert_one(application)
    return jsonify({"message": "Application submitted successfully"}), 200
