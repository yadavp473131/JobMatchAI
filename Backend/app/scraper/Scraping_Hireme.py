# from flask import Blueprint, jsonify, request
# # from beautifulsoup_scraper import scrape_jobs_bs4
# # from scrapy_scraper import scrape_jobs_scrapy
# from flask import Flask
# # This file will use BeautifulSoup to scrape job data.
# from bs4 import BeautifulSoup
# import requests
# import json
# from pymongo import MongoClient

# # Connect to MongoDB (Modify connection string if necessary)
# client = MongoClient("mongodb://localhost:27017/")



# app = Flask(__name__)
# scraper_routes = Blueprint('scraper_routes', __name__)

# def scrape_jobs_bs4(url):
#     try:
#         response = requests.get(url, verify=True)
#         response.raise_for_status()
#         soup = BeautifulSoup(response.text, 'html.parser')
        
#         # Example parsing logic (adjust selectors for the target site)
#         jobs = []
#         for job in soup.select('.section'):  # Replace with the actual container class or tag
#             job_data = {}
            
#             # Extract each required field based on its selector
#             job_data['title'] = job.select_one('.events__title').text.strip() if job.select_one('.events__title') else "Job_Title"
#             job_data['category'] = job.select_one('.tags').text.strip() if job.select_one('.tags') else "Job_Category"
#             # job_data['description'] = job.select_one('.events__content').text.strip() if job.select_one('.events__content') else "Radhe Radhe"
#             # Find all elements with the class 'events__area'
#             title = job_data['title']
#             # Split the title based on '-'
#             parts = title.split('-')
            
#             # Extracting the required parts Stripping spaces and newlines
#             before_dash = '-'.join(parts[:2]).strip()  # Join first two parts
#             after_dash = parts[2].strip() if len(parts) > 2 else ""  # Take the remaining part


#             print("Before '-':", before_dash)
#             print("After '-':", after_dash)

#             # try:
#             #     new_url = "https://hiremee.co.in/after_dash"
#             #     response = requests.get(new_url, verify=True)
#             #     response.raise_for_status()
#             #     soup = BeautifulSoup(response.text, 'html.parser')

                


#             # except Exception as e:
#             #     print(f"Error scraping with BeautifulSoup: {e}")
#             #     return []


#             event_areas = job.select('.events__area')

#             # Fetch the second occurrence, if it exists
#             if len(event_areas) >= 2:
#                 # job_data['description'] = event_areas[1].text.strip()

#                 # Find the second 'events__area' section
#                 second_event_area = event_areas[1]

#                 # Search for the nested div with the class 'job-description' inside it
#                 job_description_div = second_event_area.select_one('.job-description')

#                 job_data['description'] = job_description_div.text.strip()


#             else:
#                 job_data['description'] = "Job_description"

#             job_data['eligibility'] = job.select_one('.eligibility-class').text.strip() if job.select_one('.eligibility-class') else "Job_eligibility"
#             job_data['requirements'] = job.select_one('.requirements-class').text.strip() if job.select_one('.requirements-class') else "Job_requirements"
#             job_data['salary'] = job.select_one('.salary-class').text.strip() if job.select_one('.salary-class') else "Job_Salary"
#             job_data['work_details'] = job.select_one('.work-details-class').text.strip() if job.select_one('.work-details-class') else "Work_Details"
#             job_data['job_type'] = job.select_one('.job-type-class').text.strip() if job.select_one('.job-type-class') else "Job_type"
#             job_data['timing'] = job.select_one('.timing-class').text.strip() if job.select_one('.timing-class') else None
            
#             # print(job_data) #object
#             # Add the job data to the jobs list
#             # jobs.append(job_data)
        
#             # return jobs
#             return job_data
#     except Exception as e:
#         print(f"Error scraping with BeautifulSoup: {e}")
#         return []


# def scrape_jobs():
#     # data = request.get_json()
#     # url = data.get('url')
#     url = "https://hiremee.co.in/jobs-list"
#     # method = data.get('method', 'beautifulsoup')
#     method = 'beautifulsoup'

#     if not url:
#         return jsonify({'error': 'URL is required'}), 400

#     try:
#         if method == 'beautifulsoup':
#             jobs = scrape_jobs_bs4(url)
#         # elif method == 'scrapy':
#             # jobs = scrape_jobs_scrapy(url)
#         else:
#             return jsonify({'error': 'Invalid scraping method'}), 400
        
#         # print(jobs)
#         # return jsonify({'jobs': jobs}), 200
#         return jobs
#     except Exception as e:
#         return jsonify({'error': str(e)}), 500


# def store_job_data(job_data):
#     """
#     Stores the scraped job data into MongoDB.
#     :param job_data: Dictionary containing job details.
#     """
#     try:
#         # Insert job data into MongoDB
#         job_collection.insert_one(job_data)
#         print("Job successfully inserted into the database!")
#     except Exception as e:
#         print(f"Error inserting job: {e}")



# with app.app_context():
#     job_data1 = {}
#     job_data1 = scrape_jobs()
    
#     print(job_data1)   #jsonfied job_data for posting
    
#     # saving fetched data into database

#     # Select database
#     db = client["jobDatabase"]
 
#     # Select collection (similar to a table in SQL databases)
#     job_collection = db["jobs"]

#     # Insert jobs into database
#     store_job_data(job_data1)