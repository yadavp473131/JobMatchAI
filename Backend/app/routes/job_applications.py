from flask import Flask, jsonify, Blueprint
from app.models import fetch_all_seekers
from app.extensions import mongo
from bson import ObjectId

jobseekerprofilesfetch = Blueprint('jobseekersprofilefetch', __name__)

@jobseekerprofilesfetch.route("/jobseekersprofiles", methods=["GET"])
def get_job_seekers_profiles():
    
    try:
        seekers_list = fetch_all_seekers()
        for seeker in seekers_list:
            # Convert _id to str
            seeker['_id'] = str(seeker['_id'])

        return jsonify(seekers_list), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    