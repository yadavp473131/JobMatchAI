# from flask import Blueprint, jsonify, request
# from app.scraper.beautifulsoup_scraper import scrape_jobs_bs4
# from app.scraper.scrapy_scraper import scrape_jobs_scrapy


# scraper_routes = Blueprint('scraper_routes', __name__)

# @scraper_routes.route('/scrape-jobs', methods=['POST'])
# def scrape_jobs():
#     data = request.get_json()
#     url = data.get('url')
#     method = data.get('method', 'beautifulsoup')

#     if not url:
#         return jsonify({'error': 'URL is required'}), 400

#     try:
#         if method == 'beautifulsoup':
#             jobs = scrape_jobs_bs4(url)
#         elif method == 'scrapy':
#             jobs = scrape_jobs_scrapy(url)
#         else:
#             return jsonify({'error': 'Invalid scraping method'}), 400
        
#         return jsonify({'jobs': jobs}), 200
#     except Exception as e:
#         return jsonify({'error': str(e)}), 500
