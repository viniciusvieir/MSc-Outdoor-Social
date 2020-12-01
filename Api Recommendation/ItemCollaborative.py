import pandas as pd
from scipy.sparse import csr_matrix
from sklearn.neighbors import NearestNeighbors
import pymongo
from dotenv import load_dotenv
from pathlib import Path
import os
import sys
import json
######### Changing API file
class ItemCollaborative:
    
    def __init__(self, user_id):
        self.user_id = user_id
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

    def getUserSpecDetails(self, user_spec_data):
        # get list of trail IDs the user has already attended:
        self.list_user_spec_data = list(user_spec_data['trailID'])
        # fetch latest 5 trails user has attended:     
        user_spec_data.loc[:, 'timestamp'] = pd.to_datetime(user_spec_data.loc[:, 'timestamp'])
        #pd.to_datetime(user_spec_data["timestamp"])
        #user_spec_data.loc[:, 'timestamp']
        user_spec_data.sort_values(by='timestamp', ascending=False, kind='quicksort', inplace=True)
        
        user_spec_data = user_spec_data[user_spec_data.rating >=3]
        
        if len(user_spec_data) > 5:
            user_spec_data = list(user_spec_data['trailID'].head(5))
        else:
            user_spec_data = list(user_spec_data['trailID'])
        #print('top 5 trailIDs', user_spec_data)
        
        return user_spec_data

    
    def kNNModel(self,user_spec_data,user_review_df):
        # Convert data into matrix for KNN model:
        user_trail_table = user_review_df.pivot_table(index = ["trailID"],columns = ["userID"],values = "rating").fillna(0)
        
        # get index of latest 5 trail IDs user has attended: 
        query_index = []
        
        for i in range(0,len(user_spec_data)):
            for j in range(0,len(list(user_trail_table.index))):
                if user_spec_data[i] == user_trail_table.index[j]:
                    query_index.append(j)
                    break
            
        #print("Choosen user's trail is: ",user_trail_table.index[query_index])
        # Train model on matrix and get list of similar trails with distance to the trails the user has attended:
        user_trail_table_matrix = csr_matrix(user_trail_table.values)
        
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

#function that will make recomms
def get_recommendation(user_id):
    try:
        
        ITcoll = ItemCollaborative(int(user_id))
    except IndexError:
        raise Exception("Error Occured: Cause 'No Input'")
        
    user_review_df = ITcoll.fetchMongoDBData()

    user_spec_data = user_review_df[user_review_df['userID']==ITcoll.user_id]
    #print('data for selected user ', len(user_spec_data))
    if len(user_spec_data) == 0:
        recommendations = ['5fa17e268f4d258042edf4be','5fa17e268f4d258042edf4bb','5fa17e268f4d258042edf4bc','5fa17e268f4d258042edf4b6','5fa17e268f4d258042edf4b9','5fa17e268f4d258042edf4c3','5fa17e268f4d258042edf4b8', '5fa17e268f4d258042edf4b7', '5fa17e268f4d258042edf4bf', '5fa17e268f4d258042edf4bd']
    else:
        
        user_spec_data = ITcoll.getUserSpecDetails(user_spec_data)
        
        recommend = ITcoll.kNNModel(user_spec_data,user_review_df)
        # Get nearest trails, remove duplicates and remove trails user has already attended from recommended trails:       
        recommend = recommend.sort_values('distance',ascending=True)
                
        recommend = recommend.drop_duplicates(subset ="trail") 
        
        recommend = recommend[~recommend.trail.isin(ITcoll.list_user_spec_data)]
        
        recommend_idx = recommend['trail'].values
        recommendations = []
        count = 1
        for idx, id in enumerate(recommend_idx):
            if count > 10:
                break
            recommendations.append(str(recommend_idx[idx]))
            count= count + 1
    print(recommendations)
    return recommendations

