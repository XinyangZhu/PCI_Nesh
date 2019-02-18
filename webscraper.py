from requests import get
from requests.exceptions import RequestException
from contextlib import closing
from bs4 import BeautifulSoup

# from selenium import webdriver
# from selenium.webdriver.common.keys import Keys
# import re
# import pandas as pd
# import os

import sys

# from flask import Flask, render_template, request, redirect, Response
import json
import sched, time
from collections import defaultdict

def simple_get(url):
	try:
		with closing(get(url)) as resp: 
			if is_good_response(resp):
				return resp.text
			# else: 
				# print("bad response")
	except Exception as e:
		# print('Error during requests to {0} : {1}'.format(url, str(e)))
		return

def is_good_response(resp):
	content_type = resp.headers['Content-Type'].lower()
	return (resp.status_code == 200 
		and content_type is not None 
		and content_type.find('html') > -1)

def name2info(name):
	print("Getting info for " + name.upper())
	url = "https://nasdaq.com/symbol/" + name.lower()
	raw_html = simple_get(url)
	if raw_html:
		html = BeautifulSoup(raw_html, 'html.parser')

		# Company Ticker
		for div in html.select('#qwidget_quote > div.qwidget-symbol'):
			comp_ticker = div.text.replace('\xa0', '')
		# print(comp_ticker)

		# Last known stock price and stock price trend
		for div in html.select('#qwidget_lastsale'):
			stock_price = div.text.replace('\xa0', '')
		# print(last_trade)
		trend = "DOWN"
		for div in html.select('.arrow-green'):
			trend = "UP"
		# print(trend)
		for div in html.select('#qwidget_percent'):
			percent = div.text.replace('\xa0', '')
		# print(percent)

		# Articles
		articles = []
		hrefs = []
		for a in html.select('#CompanyNewsCommentary > ul > li > a'):
			articles.append(a.text.strip().replace('\xa0', ''))
			hrefs.append(a['href'])
		# print(articles)

		# Market Data
		data = {}
		for row in html.select('#left-column-div > div.row.overview-results.relativeP > div > div > div'): 
			cells = row.find_all('div', class_="table-cell")
			data[cells[0].text.strip().replace('\xa0', '')] = cells[1].text.strip().replace('\xa0', '')
		# print(data)

		# Call Transcript
		transcripts_url = "https://seekingalpha.com/symbol/" + name.upper() + "/earnings/transcripts"
		transcripts_raw_html = simple_get(transcripts_url)
		request_num_counter = 0
		call_transcript_result = {}
		while not transcripts_raw_html and request_num_counter < 20:
			request_num_counter += 1
			print("Trying to get transcripts...")
			transcripts_raw_html = simple_get(transcripts_url)
		if transcripts_raw_html:
			transcripts_html = BeautifulSoup(transcripts_raw_html, 'html.parser')
			transcript_links = transcripts_html.select('#headlines_transcripts > div > ul > li > div.content > div > a')
			for link in transcript_links:
				if "Earnings Call Transcript" in link.text:
					transcript_link = link['href']
					break
			call_transcript_url = "https://seekingalpha.com" + transcript_link
			call_transcript_raw_html = simple_get(call_transcript_url)
			while not call_transcript_raw_html and request_num_counter < 20:
				request_num_counter += 1
				print("Trying to get target earnings call transcript...")
				call_transcript_raw_html = simple_get(call_transcript_url)
			if call_transcript_raw_html:
				call_transcript_html = BeautifulSoup(call_transcript_raw_html, 'html.parser')
				call_transcript_result = processCallTranscript(call_transcript_html)

		result = {"ticker": comp_ticker, 
			"stock_price": stock_price, 
			"trend": trend + " " + percent, 
			"articles": articles, 
			"hrefs": hrefs, 
			"market_data": data, 
			"call_transcript": call_transcript_result}
		return result
	else: 
		# print("An error occurred. ")
		return

def processCallTranscript(html):
	article_div = html.select('#a-body')[0]
	title = ""
	company_parts = False
	call_parts = False
	body = False
	caller = ""
	speech_len = defaultdict(int)
	for p in article_div.select('p'): 
		if not title:
			title = p.text
			continue
		if company_parts == False:
			# print(1)
			# print(p.text)
			company_parts = []
			continue			
		if company_parts != False and not p.select('strong') and call_parts == False:
			# print(2)
			# print(p.text)
			company_parts.append(p.text)
			continue
		if call_parts == False and p.select('strong'):
			# print(3)
			# print(p.text)
			call_parts = []
			continue
		if call_parts != False and body == False and (not p.select('strong') or len(caller) > 0):
			# print(4)
			# print(p.text)
			call_parts.append(p.text)
			continue
		if p.select('strong') and call_parts != False and body == False:
			# print(5)
			# print(p.text)
			body = True
			caller = p.text
			continue
		if body: 
			if p.select('strong'):
				caller = p.text
			else: 
				speech_len[caller] += len(p.text)
	maxLen = 0
	minLen = float('inf')
	topCaller = ""
	ntCaller = ""
	for caller in speech_len:
		if speech_len[caller] > maxLen:
			maxLen = speech_len[caller]
			topCaller = caller
		if speech_len[caller] < minLen:
			minLen = speech_len[caller]
			ntCaller = caller
	result = {"title": title, 
		"company_parts": company_parts, 
		"call_parts": call_parts, 
		"speech_len": speech_len, 
		"top_caller": topCaller, 
		"nt_caller": ntCaller}
	return result

def setInterval(func, time):
	e = threading.Event()
	while not e.wait(time):
		func()

def updateData():
	print('Updating data...')
	data = {}
	companies = []
	with open('src/assets/companies.json') as f: 
		companies = json.load(f)
	for company in companies: 
		data[company] = name2info(company)
	with open('src/assets/data.json', 'w') as f: 
		json.dump(data, f)
	print('Finished updating.')

if __name__ == '__main__':
	while True:
		updateData()
		time.sleep(60)


# app = Flask(__name__)

# @app.route('/')
# def getInfo():
# 	# ticker = request.get_json()
# 	return render_template('index.html', info = "hello")

# if __name__ == '__main__':
# 	app.run(debug=True)





# name2info('apc')

# url = "https://seekingalpha.com/symbol/PXD?s=pxd"
# driver = webdriver.Chrome('/Users/zhuxinyang/Downloads/chromedriver')
# driver.implicitly_wait(3)
# driver.get(url)

# html = BeautifulSoup(driver.page_source, 'lxml')
# # Company Ticker
# for div in html.select('#main_content > div.tab-content-header > div.symbol_title > div.ticker-title'):
# 	ticker = div.text
# 	print(ticker)

# # Last known stock price and stock price trend
# for div in html.select('#symbol_last_trade'):
# 	last_trade = div.text
# 	print(last_trade)

# for div in html.select('#symbol_change'):
# 	trend = div.text
# 	print(trend)

# # Articles
# articles = []
# for a in html.select('.symbol_article > a'):
# 	articles.append(a.text)
# 	if "Earnings Call Transcript" in a.text: 
# 		driver.find_element_by_link_text(a.text).click()
# 		# Earnings Call Transcript
# 		transcript = {}
# 		transcript_html = BeautifulSoup(driver.page_source, 'lxml')
# 		for div in transcript_html.select('#a-body'): 
# 			title = ""
# 			company_parts = False
# 			other_parts = False
# 			for p in transcript_html.select('#a-body > p'): 
# 				if not (company_parts or other_parts):
# 					title = p.text
# 				elif company_parts and (not other_parts): 


# print(articles)


