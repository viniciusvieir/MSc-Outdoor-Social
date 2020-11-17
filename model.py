import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.metrics import pairwise_distances
import pickle
import preprocessing as preproc

#trails data 

trails=pd.read_excel('Ireland_trail_New.xlsx')

#calling new data 

check = pd.read_pickle("data/check.pkl")
sim_user_30_m = pd.read_pickle("data/sim_user_30_u.pkl")
Trail_user = pd.read_pickle("data/Trail_user.pkl")
Mean = pd.read_pickle("data/Mean.pkl")
final_trail = pd.read_pickle("data/final_trail.pkl")
similarity_with_trail= pd.read_pickle("data/similarity_with_trail.pkl")


 # recom function in this first version we will run the hole file to get recoms in an updated version we need to split the file and store 
 # preprocessing data so that we don t run the file every time the api is called

def User_item_score1(user):
    Trail_seen_by_user = check.columns[check[check.index==user].notna().any()].tolist()
    a = sim_user_30_m[sim_user_30_m.index==user].values
    b = a.squeeze().tolist()
    d = Trail_user[Trail_user.index.isin(b)]
    l = ','.join(d.values)
    Trail_seen_by_similar_users = l.split(',')
    Trail_under_consideration = list(set(Trail_seen_by_similar_users)-set(list(map(str, Trail_seen_by_user))))
    Trail_under_consideration = list(map(int, Trail_under_consideration))
    score = []
    for item in Trail_under_consideration:
        c = final_trail.loc[:,item]
        d = c[c.index.isin(b)]
        f = d[d.notnull()]
        avg_user = Mean.loc[Mean['userId'] == user,'rating'].values[0]
        index = f.index.values.squeeze().tolist()
        corr = similarity_with_trail.loc[user,index]
        fin = pd.concat([f, corr], axis=1)
        fin.columns = ['adg_score','correlation']
        fin['score']=fin.apply(lambda x:x['adg_score'] * x['correlation'],axis=1)
        nume = fin['score'].sum()
        deno = fin['correlation'].sum()
        final_score = avg_user + (nume/deno)
        score.append(final_score)
    data = pd.DataFrame({'Trail_id':Trail_under_consideration,'score':score})
    top_5_recommendation = data.sort_values(by='score',ascending=False).head(10)
    Trail_Name = top_5_recommendation.merge(trails, how='inner', on='Trail_id')
    Trail_Names = Trail_Name.Trail_id.values.tolist()
    return Trail_Names

if __name__ == "__main__":
    print(User_item_score1(600))