# from flask import Flask, request, jsonify
# from flask_pymongo import PyMongo
# from bson.objectid import ObjectId
# from flask_cors import CORS
# from app.routes.auth import authenticate  # your /login blueprint
# # from app.routes.job_post import job_post_routes

# app = Flask(__name__)

# # Enable CORS
# # CORS(app)


# # Configuring MongoDB
# app.config['MONGO_URI'] = 'mongodb://localhost:27017/jobDatabase'
# mongo = PyMongo(app)



# # ✅ Correct CORS config
# CORS(app, origins="http://localhost:3000", supports_credentials=True)

# # Register Blueprints
# app.register_blueprint(authenticate)
# # app.register_blueprint(job_post_routes)






# # Endpoint to post a job
# @app.route('/post-job', methods=['POST'])
# def post_job():
#     data = request.get_json()

#     required_fields = ['title', 'category', 'description', 'eligibility', 'requirements', 'salary', 'work_details', 'job_type', 'timing']
#     if not all(key in data for key in required_fields):
#         return jsonify({'error': 'Missing required fields'}), 400

#     job = {
#         'title': data['title'],
#         'category': data['category'],
#         'description': data['description'],
#         'eligibility': data['eligibility'],
#         'requirements': data['requirements'],
#         'salary': data['salary'],
#         'work_details': data['work_details'],
#         'job_type': data['job_type'],
#         'timing': data['timing']
#     }

#     try:
#         job_id = mongo.db.jobs.insert_one(job).inserted_id
#         job['_id'] = str(job_id)
#         print(f"job data {job}")
#         return jsonify({'message': 'Job posted successfully', 'job': job}), 201
#     except Exception as e:
#         return jsonify({'error': str(e)}), 500

# # Endpoint to get all jobs
# @app.route('/jobs', methods=['GET'])
# def get_jobs():
#     try:
#         jobs = mongo.db.jobs.find()
#         job_list = [{
#             '_id': str(job['_id']),
#             'title': job['title'],
#             'category': job['category'],
#             'description': job['description'],
#             'eligibility': job.get('eligibility', ''),
#             'requirements': job.get('requirements', ''),
#             'salary': job.get('salary', ''),
#             'work_details': job.get('work_details', ''),
#             'job_type': job.get('job_type', ''),
#             'timing': job.get('timing', '')
#         } for job in jobs]
#         return jsonify(job_list), 200
#     except Exception as e:
#         return jsonify({'error': str(e)}), 500

# if __name__ == '__main__':
#     app.run(debug=True)
