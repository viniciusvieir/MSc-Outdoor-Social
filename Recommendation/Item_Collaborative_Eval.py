# -*- coding: utf-8 -*-
"""
Created on Tue Nov 3 16:02:20 2020

@author: Puja
"""

import pandas as pd 
from scipy.sparse import csr_matrix
from sklearn.neighbors import NearestNeighbors
import pymongo
from dotenv import load_dotenv
from pathlib import Path
import os


from sklearn.model_selection import train_test_split
from sklearn.metrics import recall_score
#pd.options.mode.chained_assignment = None  # default='warn'

class itemCollaborative:
    
    def __init__(self, user_id):
        self.user_id = user_id
        load_dotenv(dotenv_path = Path('\.env'))
        
        mongo_url = os.getenv('MONGO_URL')
        client = pymongo.MongoClient(mongo_url)
        
        self.db = client['trailseek']
    
    def fetchMongoDBData(self):
        
        collection = self.db['user_rating']
        # fetch userID, trailID, rating, timestamp from database:
        user_review = collection.find({},{"userID":1, "reviews.trailID": 1, "reviews.rating": 1, "reviews.timestamp": 1, "_id": 0})
        # Convert data fetched from database to dataframe:    
        user_review_df = pd.DataFrame()
        for doc in user_review:
            df = pd.DataFrame(doc['reviews'])
            df2 = df.assign(userID = doc['userID'])
            user_review_df = user_review_df.append(df2, sort=True)
        return user_review_df

    
    def kNNModel(self,user_spec_data,user_review_df):
        # Convert data into matrix for KNN model:
        user_trail_table = user_review_df.pivot_table(index = ["trailID"],columns = ["userID"],values = "rating").fillna(0)

        query_index = []
        
        for i in range(0,len(user_spec_data)):
            for j in range(0,len(list(user_trail_table.index))):
                #print(i, " " , j)
                if user_spec_data[i] == user_trail_table.index[j]:
                    #print(user_spec_data[i], " ", user_trail_table.index[j])
                    query_index.append(j)
                    break
        
        
        user_trail_table_matrix = csr_matrix(user_trail_table.values)
        #print(user_trail_table_matrix)
        model_knn = NearestNeighbors(metric = 'cosine', algorithm = 'brute')
        model_knn.fit(user_trail_table_matrix)
        
        distances, indices = model_knn.kneighbors(user_trail_table.iloc[query_index,:].values, n_neighbors = 10)
        
        trail = []
        distance = []
        
        for i in range(0, len(distances.flatten())):
            if i != 0:
                trail.append(user_trail_table.index[indices.flatten()[i]])
                distance.append(distances.flatten()[i])    
        
        
        t=pd.Series(trail,name='trail')
        d=pd.Series(distance,name='distance')
        recommend = pd.concat([t,d], axis=1)
        return recommend
    
    
if __name__ == '__main__':
    try:
        #arg = sys.argv
        
        ITcoll = itemCollaborative(389)
    except IndexError:
        print("Error Occured: Cause 'No Input'")
        raise
        
    user_review_df = ITcoll.fetchMongoDBData()
    
    rs_list =[]
    
    # split the data into train and test set
    train, test = train_test_split(user_review_df, test_size=0.3, random_state=42, shuffle=True)
    
    usid = list(train['userID'])
    for i in range(0,200):
        
        print(usid[i])
        
        user_spec_data = train[train['userID']==usid[i]]
        
        user_spec_data = list(user_spec_data['trailID'])
        
       
        recommend = ITcoll.kNNModel(user_spec_data,train)
        #print(type(recommend))
        recommend = recommend.sort_values('distance',ascending=True)
                   
        recommend = recommend.drop_duplicates(subset ="trail") 
            
        recommend = recommend[~recommend.trail.isin(user_spec_data)]
        
        recommend_idx = recommend['trail'].values
        recommendations = []
        
        for idx, id in enumerate(recommend_idx):
            recommendations.append(str(recommend_idx[idx]))
   
        print('Recommended for User: ',recommendations)
        
        test_user = test[test['userID']==usid[i]]
      
        test_user_idx = test_user['trailID'].values
        test_user_list = []
        
        for idx, id in enumerate(test_user_idx):
            test_user_list.append(str(test_user_idx[idx]))
            
        print('test_user_list', test_user_list)
        
     
        rs = set(recommendations) & set(test_user_list)
        print(len(rs))
        rs_list.append(len(rs)/len(recommendations))    

    
avg = sum(rs_list)/len(rs_list)
print("The Recall value is ", round(avg,2))    
  
