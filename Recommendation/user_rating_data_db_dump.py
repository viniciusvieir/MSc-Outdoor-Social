

from dotenv import load_dotenv
from pathlib import Path
import pandas as pd
import pymongo
import os

## Connect to database:
load_dotenv(dotenv_path = Path('/.env'))
mongo_url = os.getenv('MONGO_URL')
client = pymongo.MongoClient(mongo_url)

db = client['trailseek']
db['user_rating'].drop()
collection = db['user_rating']


rating_csv = pd.read_csv(r"D:\Masters\Semester3\Project\Dataset\Cleaned_Data\User_rating_final.csv")

user_ids = rating_csv.userID.unique()


for user_id in user_ids:
    
    print(user_id)
    user_id_df = rating_csv[(rating_csv.userID == user_id)]

    user_dict = {'userID' : int(user_id), 'userName' : "", 'userProfile' : ""} ## Create dictionary for user
    user_id_df = user_id_df.drop(['userID','userName','userProfile'], axis = 1)
    
    user_trail_dict = user_id_df.to_dict('records') ## Dict for trails
    user_dict['reviews'] = user_trail_dict ## Add trails dict to users dict

    collection.insert_one(user_dict)  

print("END")

