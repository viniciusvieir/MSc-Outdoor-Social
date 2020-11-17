import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.metrics import pairwise_distances
import pickle



ratings=pd.read_excel('New_users.xlsx')
trails=pd.read_excel('Ireland_trail_New.xlsx')

Mean = ratings.groupby(by="userId",as_index=False)['rating'].mean()


Rating_avg = pd.merge(ratings,Mean,on='userId')
Rating_avg['adg_rating']=Rating_avg['rating_x']-Rating_avg['rating_y']

# Rating_avg.head()

check = pd.pivot_table(Rating_avg,values='rating_x',index='userId',columns='Trail_id')

#check.head()

final = pd.pivot_table(Rating_avg,values='adg_rating',index='userId',columns='Trail_id')

#final.head()

final_trail = final.fillna(final.mean(axis=0))
final_user = final.apply(lambda row: row.fillna(row.mean()), axis=1)

b = cosine_similarity(final_user)
np.fill_diagonal(b, 0 )
similarity_with_user = pd.DataFrame(b,index=final_user.index)
similarity_with_user.columns=final_user.index

# similarity_with_user.head()

cosine = cosine_similarity(final_trail)
np.fill_diagonal(cosine, 0 )
similarity_with_trail = pd.DataFrame(cosine,index=final_trail.index)
similarity_with_trail.columns=final_user.index
similarity_with_trail.head()

def find_n_neighbours(df,n):
    order = np.argsort(df.values, axis=1)[:, :n]
    df = df.apply(lambda x: pd.Series(x.sort_values(ascending=False)
           .iloc[:n].index, 
          index=['top{}'.format(i) for i in range(1, n+1)]), axis=1)
    return df


sim_user_30_u = find_n_neighbours(similarity_with_user,30)

#sim_user_30_u.head()

def get_user_similar_trails( user1, user2 ):
    common_trails = Rating_avg[Rating_avg.userId == user1].merge(
    Rating_avg[Rating_avg.userId == user2],
    on = "Trail_id",
    how = "inner" )
    return common_trails.merge( trails, on = 'Trail_id' )

a = get_user_similar_trails(25,49)
a = a.loc[ : , ['rating_x_x','rating_x_y','Name']]

# a.head()

def User_item_score(user,item):
    #sim_user_m
    a = sim_user_30_u[sim_user_30_u.index==user].values
    b = a.squeeze().tolist()
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
    return final_score

score = User_item_score(320,25)
print("score (u,i) is",score)

Rating_avg = Rating_avg.astype({"Trail_id": str})


Trail_user = Rating_avg.groupby(by = 'userId')['Trail_id'].apply(lambda x:','.join(x))





#storing
Mean.to_pickle("data/Mean.pkl")

similarity_with_trail.to_pickle("data/similarity_with_trail.pkl")

check.to_pickle("data/check.pkl")

final_trail.to_pickle("data/final_trail.pkl")

similarity_with_user.to_pickle("data/similarity_with_user.pkl")

sim_user_30_u.to_pickle("data/sim_user_30_u.pkl")

Trail_user.to_pickle("data/Trail_user.pkl")