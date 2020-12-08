import csv
from lib2to3.pgen2 import driver

import requests
import time
from bs4 import BeautifulSoup
import pandas as pd
import numpy as np
import os
import json
import re
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
import pickle

chromedriver = "/Applications/chromedriver"
os.environ["webdriver.chrome.driver"] = chromedriver

page = requests.get("https://www.alltrails.com/ireland").text
soup = BeautifulSoup(page, 'lxml')

soup.find('div', id='item-info')

review_list = []
for each in soup.findAll(itemprop="reviewBody"):
    review = each.text
    review_list.append(review)

print(review_list)

soup.select('span.distance-icon')[0].text

empty_list = []
for each in soup.find('section', class_='tag-cloud'):
    print(each)

trail_perks = []
trail_stats = {'distance':0,'perks':trail_perks,'reviews':review_list}

for trail in trail_perks:
      url = "https://www.alltrails.com"+trail


def scrape_trails(url):
    page = requests.get("https://www.alltrails.com/ireland").text
    soup = BeautifulSoup(page, 'lxml')
    pass


trail_soup = scrape_trails(url)
    def get_attributes(trail_soup):
        pass


trail_stats, trail_name, user_dict = get_attributes(trail_soup)
    print(trail_stats)
    driver.close();

def get_all_hikes(url):
    '''input: URL
       output: fully loaded webpage with all hike links for URL'''
    driver = webdriver.Chrome(chromedriver)
    driver.get(url)
    # Selects Decline in pop-up
    driver.find_element_by_xpath("//a[contains(text(),'Decline')]").click()
    count = 0
    while count < 60:
        try:
            load_more_hikes = WebDriverWait(driver, 8).until(EC.visibility_of_element_located((By.XPATH,"//div[@id='load_more'] [@class='feed-item load-more trail-load'][//a]")))
            # clicks to load more
            load_more_hikes.click()
            time.sleep(2)
            count += 1
        except:
            break

    soup = BeautifulSoup(driver.page_source, 'lxml')
    return soup
trail_urls = []
hike_soup = get_all_hikes('https://www.alltrails.com/ireland')

for trail in hike_soup.find_all(class_='item-link', itemprop='url'):
    url = trail.get('href')
    trail_urls.append(url)


def scrape_trails(url):
    '''input: hike URL
       output: webpage loaded with all user reviews for trail'''
    driver = webdriver.Chrome(chromedriver)
    driver.get(url)
    finished = False
    count = 0
    while not finished:
        try:
            load_ratings = WebDriverWait(driver, 6).until(EC.visibility_of_element_located(
                (By.XPATH, "//div[@id='load_more'] [@class='feed-item load-more'][//a]")))
            load_ratings.click()
            time.sleep(6)
            newcount = len(driver.find_elements_by_class_name('feed-user-content.rounded'))
            if newcount > count:
                count = newcount
            else:
                finished = True

        except:
            break

    soup = BeautifulSoup(driver.page_source, "lxml")

    return soup


def get_attributes(trail_soup):
    '''input: BeautifulSoup webpage
    output: Returns 3 items - all trail attributes, name of trail, all user reviews'''
    header = trail_soup.find('div', id='title-and-menu-box')
    trail_name = header.findChild('h1').text
    difficulty = header.findChild('span').text
    stars = header.findChild('meta')['content']
    num_reviews = header.find('span', itemprop='reviewCount').text
    area = trail_soup.select('div.trail-rank')
    try:
        hike_region = area[0].findChild('span', itemprop='name').text
    except:
        hike_region = area[0].findChild('a').text
    try:
        distance = trail_soup.select('span.distance-icon')[0].text
        distance = re.search('\\n\\n(.+?)\\n', distance).group(1)
    except:
        distance = None
    try:
        elevation_gain = trail_soup.select('span.elevation-icon')[0].text
        elevation_gain = re.search('\\n\\n(.+?)\\n', elevation_gain).group(1)
    except:
        elevation_gain = None
    try:
        route_type = trail_soup.select('span.route-icon')[0].text
        route_type = re.search(':\\n(.+?)\\n', route_type).group(1)
    except:
        route_type = None
    tags = trail_soup.select('section.tag-cloud')[0].findChildren('h3')
    hike_attributes = []
    for tag in tags:
        hike_attributes.append(tag.text)

    user_dict = {}
    users = trail_soup.select('div.feed-user-content.rounded')
    for user in users:
        if user.find('span', itemprop='author') != None:
            user_name = user.find('span', itemprop='author').text
            user_name = user_name.replace('.', '')
            user_dict[user_name] = {'rating': None, 'review': None}
            try:
                rating = user.find('span', itemprop="reviewRating").findChildren('meta')[0]['content']
                user_dict[user_name]['rating'] = rating
            #                 user_ratings.append({user_name: rating})
            except:
                pass
        if user.find('p', itemprop='reviewBody') != None:
            try:
                review = user.find('p', itemprop='reviewBody').text
                if review != '':
                    user_dict[user_name]['review'] = review
                else:
                    pass
            #                     user_dict[user_name]['review'] = np.nan
            #                 user_reviews.append({user_name: review})
            except:
                pass

    trail_stats = {}
    # create dictionary with all of attributes to turn into dataframe
    trail_stats[trail_name] = {'hike_difficulty': difficulty, 'stars': stars, 'num_reviews': num_reviews,
                               'hike_region': hike_region,
                               'total_distance': distance, 'elevation_gain': elevation_gain, 'route_type': route_type,
                               'hike_attributes': hike_attributes}

    # merge trail dataframe with user dataframe

    return trail_stats, trail_name, user_dict

list(set(trail_urls))

ca_trails = list(set(trail_urls))

user_agg_df = pd.DataFrame()
trail_agg_df = pd.DataFrame()

for trail in ca_trails[1011:]:
    url = "https://www.alltrails.com"+trail
    trail_soup = scrape_trails(url)
    try:
        trail_stats, trail_name, user_dict = get_attributes(trail_soup)
        # convert user dict to dataframe
        user_df = pd.DataFrame(user_dict)
        user_df = user_df.transpose()
        user_df = user_df.reset_index().rename(columns={'index':'username'})
        user_df['trail_name'] = trail_name
        user_agg_df = user_agg_df.append(user_df, ignore_index=True)
        # convert trail stats to dataframe and append
        trail_df = pd.DataFrame(trail_stats)
        trail_df = trail_df.transpose()
        trail_df = trail_df.reset_index().rename(columns={'index':'trail_name'})
        trail_agg_df = trail_agg_df.append(trail_df, ignore_index=True)
    except:
        pass


list(set(trail_urls))
file2 = open('Best Trails in Ireland_trail.csv', 'a+', newline='')
# opening the csv file in 'a+' mode
# file = open('g4g.csv', 'a+', newline ='')

# writing the data into the file
with file2:
    write = csv.writer(file2)
    write.writerows(list)

file2.close()







