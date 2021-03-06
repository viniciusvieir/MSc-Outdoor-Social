# -*- coding: utf-8 -*-
"""
Created on Sun Oct 25 15:33:51 2020

@author: Puja
"""

import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
import pymongo
from dotenv import load_dotenv
from pathlib import Path
import os
import sys
from sklearn import preprocessing

class itemContentSimilarity:
    
    
    hike_ids = "" 
    
    def __init__(self, user_clicked_id):
        self.user_clicked_id = user_clicked_id
        
        load_dotenv(dotenv_path = Path('../server/.env'))
        
        mongo_url = os.getenv('MONGO_URL')
        client = pymongo.MongoClient(mongo_url)
        
        self.db = client['trailseek']
        

    def cosSimilarity(self,hike_idx, df, indexed_hike_id, n):
        hike = df.iloc[hike_idx]
        cs = cosine_similarity(np.array(hike).reshape(1, -1), df)
        #print(np.argsort(cs)[0][-(n+1):][::-1])
        rec_index = np.argsort(cs)[0][-(n+1):][::-1][1:]
        #print(rec_index)
        recommendations = []
        for rec in rec_index:
            #print(rec)
            recommendations.append(str(indexed_hike_id[rec]))
            #print(recommendations)
        
        return recommendations

    def fetchDB(self):
        trails_col = self.db['trails']
        trails_data = trails_col.find({},{"_id":1,"difficulty": 1, "activity_type": 1, "no_of_ratings": 1, "avg_rating": 1, "estimate_time_min": 1, "length_km": 1, "county":1})
        df = pd.DataFrame(list(trails_data))
                      
        df['estimate_time_min'] = df['estimate_time_min'].fillna(0)
        df = pd.get_dummies(df, columns=["difficulty", "activity_type", "county"])      

        df['no_of_ratings'] = df['no_of_ratings'].fillna(0)
        df['avg_rating'] = df['avg_rating'].fillna(0)
        self.hike_ids = df['_id'].values
        
        df.drop('_id', axis=1, inplace=True)
        
        x = df.values #returns a numpy array
        min_max_scaler = preprocessing.MinMaxScaler()
        x_scaled = min_max_scaler.fit_transform(x)
        df = pd.DataFrame(x_scaled)
        return df

if __name__ == '__main__':
    try:
        args = sys.argv
    #print(type(args[1]))
        
        ITCont = itemContentSimilarity(args[1])
    except IndexError:
        raise Exception("Error Occured: Cause 'No Input'")
    
    df = ITCont.fetchDB()
    
    try:
        for idx, id in enumerate(ITCont.hike_ids):
            #print(idx," ",id)
            
            if str(id) == ITCont.user_clicked_id:
                #print('Match')
                hike_idx = idx
                break   
        recommendations = ITCont.cosSimilarity(hike_idx, df, ITCont.hike_ids, n=10)
    except NameError: 
        raise Exception("Error Occured: Cause 'Trail Object ID not found'")
    
    print(','.join(recommendations))

    
    
