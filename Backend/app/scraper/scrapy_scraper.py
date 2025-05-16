# This file will configure a Scrapy spider
# import scrapy
# from scrapy.crawler import CrawlerProcess

# class JobSpider(scrapy.Spider):
#     name = 'job_spider'
#     start_urls = []

#     def parse(self, response):
#         jobs = []
#         for job in response.css('.job-listing'):  # Replace with the actual CSS selector
#             jobs.append({
#                 'title': job.css('.job-title::text').get(),
#                 'company': job.css('.company-name::text').get(),
#                 'location': job.css('.location::text').get(),
#             })
#         return jobs

# def scrape_jobs_scrapy(url):
#     process = CrawlerProcess(settings={
#         "LOG_LEVEL": "ERROR",
#     })
#     JobSpider.start_urls = [url]
#     jobs = []

#     def collect_results(item, response, spider):
#         jobs.extend(item)

#     process.crawl(JobSpider)
#     process.start()
#     return jobs
