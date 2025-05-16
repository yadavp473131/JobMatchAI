# This file will use BeautifulSoup to scrape job data.
# from bs4 import BeautifulSoup
# import requests

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
#             job_data['title'] = job.select_one('.events__title').text.strip() if job.select_one('.events__title') else "Radhe Radhe"
#             job_data['category'] = job.select_one('.tags').text.strip() if job.select_one('.tags') else "Radhe Radhe"
#             # job_data['description'] = job.select_one('.events__content').text.strip() if job.select_one('.events__content') else "Radhe Radhe"
#             # Find all elements with the class 'events__area'
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
#                 job_data['description'] = "Radhe Radhe"

#             job_data['eligibility'] = job.select_one('.eligibility-class').text.strip() if job.select_one('.eligibility-class') else "Radhe Radhe"
#             job_data['requirements'] = job.select_one('.requirements-class').text.strip() if job.select_one('.requirements-class') else "Radhe Radhe"
#             job_data['salary'] = job.select_one('.salary-class').text.strip() if job.select_one('.salary-class') else "Radhe Radhe"
#             job_data['work_details'] = job.select_one('.work-details-class').text.strip() if job.select_one('.work-details-class') else "Radhe Radhe"
#             job_data['job_type'] = job.select_one('.job-type-class').text.strip() if job.select_one('.job-type-class') else "Radhe Radhe"
#             job_data['timing'] = job.select_one('.timing-class').text.strip() if job.select_one('.timing-class') else None
#             print(job_data)
#             # Add the job data to the jobs list
#             # jobs.append(job_data)
#             # return jobs
#             return job_data
#     except Exception as e:
#         print(f"Error scraping with BeautifulSoup: {e}")
#         return []
