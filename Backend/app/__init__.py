# 1. __init__.py
from flask import Flask
from flask_cors import CORS
from app.extensions import mongo
from app.routes.jobpost import job_post_routes
from app.routes.jobs import jobs_routes
from app.routes.auth import authenticate
from app.routes.profiles import profilefetch
from app.routes.job_apply import job_apply
from app.routes.job_applications import jobseekerprofilesfetch
# from app.routes.auth import authenticate, init_mongo
# from app.routes.scraper_routes import scraper_routes

def create_app():
    app = Flask(__name__)

    # Enable CORS
    CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)

    # Configuring MongoDB
    app.config['MONGO_URI'] = 'mongodb://localhost:27017/jobDatabase'

    # Initialize Extensions
    mongo.init_app(app)

    # Register Blueprints
    app.register_blueprint(job_post_routes)
    app.register_blueprint(jobs_routes)
    # app.register_blueprint(authenticate, url_prefix='/auth')
    app.register_blueprint(authenticate)
    app.register_blueprint(profilefetch)
    app.register_blueprint(job_apply)
    app.register_blueprint(jobseekerprofilesfetch)

    # app.register_blueprint(scraper_routes)

    return app
