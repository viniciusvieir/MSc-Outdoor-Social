# -*- coding: utf-8 -*-
"""
Created on Sun Oct 25 15:33:51 2020

@author: Puja
"""

import os
import sys
import pymongo
import numpy as np
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from dotenv import load_dotenv
from pathlib import Path

load_dotenv(dotenv_path = Path('../server/.env'))

MONGO_URL = os.getenv('MONGO_URL')

class itemContentSimilarity:
    client = pymongo.MongoClient(MONGO_URL)

    db = client['trailseek']
 
    trails_col = db['trail_devs']
    
    hike_ids = ""
    
    
    def __init__(self, user_clicked_id):
        self.user_clicked_id = user_clicked_id

    def cosSimilarity(self,hike_idx, df, indexed_hike_id, n):
        hike = df.iloc[hike_idx]
        cs = cosine_similarity(np.array(hike).reshape(1, -1), df)
        rec_index = np.argsort(cs)[0][-(n+1):][::-1][1:]
        #print(rec_index)
        recommendations = []
        for rec in rec_index:
            #print(rec)
            recommendations.append(str(indexed_hike_id[rec]))
            #print(recommendations)
        
        return recommendations

    def fetchDB(self,trails_col):
        
        trails_data = trails_col.find({},{"_id":1, "difficulty": 1, "activity_type": 1, "no_of_ratings": 1, "avg_rating": 1, "estimate_time_min": 1, "length_km": 1})
        df = pd.DataFrame(list(trails_data))
                      
        df['estimate_time_min'] = df['estimate_time_min'].fillna(0)
        df = pd.get_dummies(df, columns=["difficulty", "activity_type"])      
        
        df['ratings_score'] = round((df['avg_rating']*df['no_of_ratings'])/(df['avg_rating']+df['no_of_ratings']),2)
        df['ratings_score'] = df['ratings_score'].fillna(0)
        
        self.hike_ids = df['_id'].values
        
        df.drop('_id', axis=1, inplace=True)
        df.drop('no_of_ratings', axis=1, inplace=True)
        df.drop('avg_rating', axis=1, inplace=True)
        
        return df

if __name__ == '__main__':
    try:
        args = sys.argv
    #print(type(args[1]))
        
        ITCont = itemContentSimilarity(args[1])
    except IndexError:
        print("Error Occured: Cause 'No Input'")
        raise
    
    df = ITCont.fetchDB(ITCont.trails_col)
    
    try:
        for idx, id in enumerate(ITCont.hike_ids):
            #print(idx," ",id)
            
            if str(id) == ITCont.user_clicked_id:
                #print('Match')
                hike_idx = idx
                break   
        recommendations = ITCont.cosSimilarity(hike_idx, df, ITCont.hike_ids, n=10)
    except NameError: 
        print("Error Occured: Cause 'Trail Object ID not found'")
        raise
    
    print(','.join(recommendations))

    
    
