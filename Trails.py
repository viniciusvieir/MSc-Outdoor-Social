# -*- coding: utf-8 -*-
"""
Created on Thu Oct 15 22:18:11 2020

@author: Puja
"""

import pymongo
import os
import csv
import json


client = pymongo.MongoClient('#########')

db = client['#######']
collections = db.list_collection_names()
print(collections)
db['trails'].drop()
collection_tm = db['trails']

count = 1
#print(count)

file_match_count = 0

my_path = os.getcwd()
#print('program path ',my_path)

geo_file_path = '#######'

with open('Ireland_trail_New_Final_img_updated.csv', newline='\n') as csvfile:
    csv_content = csv.reader(csvfile, delimiter=',')
    #print(csv_content)
    os.chdir(geo_file_path)
    #print('changed working directory ',os.getcwd())
    for row in csv_content:
        file_match = 'No'
        if count == 1:
            #print("In IF")
            #print(type(row))
            columns_headings_list = row
            print('columns_headings_list', columns_headings_list)
            count += 1
        else:
            #print("In Else")
            name = row[1]
            if name.find(': ') != -1:
                name = name.replace(': ', '_ ')
            #print('name-',name)
            for (dirpath, dirnames, filenames) in os.walk(geo_file_path):
                for filename in filenames:
                    #print('filename ',filename)
                    if name.strip() == filename.split('.js')[0].strip():
                        file_match = 'Yes'
                        file_match_count+=1
                        with open(filename) as dataFile:
                            data = dataFile.read()
                            obj = data[data.find('{') : data.rfind('}')+1]
                            jsonObj = json.loads(obj)
                        
                            geoLoc_val = jsonObj['features'][len(jsonObj['features'])-1]['geometry']
                            #print('geoLoc_val ',geoLoc_val)
                            row[len(row)-1] = geoLoc_val
                            #print('update_row ', row)
                                        
                            row_dict = dict(zip(columns_headings_list, row))
                            #print('row_dict old', row_dict)
                            row_dict['id'] = int(row_dict['id'])
                            row_dict['length_km'] = float(row_dict['length_km'])
                            row_dict['elevationGain_ft'] = int(row_dict['elevationGain_ft'])
                            row_dict['avgRating'] = float(row_dict['avgRating'])
                            row_dict['no_of_ratings'] = int(row_dict['no_of_ratings'])
                            
                            #print('row_dict new', row_dict)
                            collection_tm.insert_one(row_dict)
                            
            if file_match == 'No':
                print('name Not match:',name.strip())
                print('filename Not match:',filename.split('.')[0].strip())               

print('file_match_count ', file_match_count)
print('End')    
# os.chdir()
            
# =============================================================================
# import json
# 
# with open('Howth Loop Trail.js') as dataFile:
#     data = dataFile.read()
#     obj = data[data.find('{') : data.rfind('}')+1]
#     jsonObj = json.loads(obj)
# 
# print(type(jsonObj['features'][len(jsonObj['features'])-1]))
# print(len(jsonObj['features']))
# print(jsonObj['features'][len(jsonObj['features'])-1]['geometry'])
#     
# for entry in os.listdir(basepath):
#     if os.path.isfile(os.path.join(basepath, entry)):
#         print(entry)
# =============================================================================
