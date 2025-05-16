# 7. run.py
from app import create_app
# from app.scraper.Scraping_Hireme import scrape_jobs
import requests
from flask import Flask
from flask_pymongo import PyMongo
from flask_cors import CORS




# Create the Flask app instance using the factory function
def main():
    app = create_app()
    
    # Run the Flask development server
    app.run(host='0.0.0.0', port=5000, debug=True)
    
    print("app has run")
if __name__ == "__main__":
    main()

