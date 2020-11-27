# -*- coding: utf-8 -*-
"""
Created on Mon Nov 16 16:02:20 2020

@author: Puja
"""

import numpy as np # linear algebra
import pandas as pd # data processing, CSV file I/O (e.g. pd.read_csv)

# Libraries for Recommendation System
from scipy.sparse import csr_matrix
from sklearn.neighbors import NearestNeighbors


data_trail = pd.read_csv("D:/Masters/Semester3/Project/Code/Ireland_trail_User_Test_Collaborative.csv")
#data_rating = pd.read_csv("D:/Masters/Semester3/Project/Code/ItemCollaborative/ratings_10.csv")

trail = data_trail.loc[:,{"user_id","hike_id", "name", "rating"}]
#print(trail)
#rating = data_rating.loc[:,{"userId","movieId","rating"}]
user_spec_hike_name = trail[trail['user_id']==1002]
#print("selected user's trail name: ",list(user_spec_hike_name['name']))
user_spec_hike_name = list(user_spec_hike_name['name'])
#print(len(user_spec_hike_name))
#data = pd.merge(movie,rating)
user_trail_table = trail.pivot_table(index = ["name"],columns = ["user_id"],values = "rating").fillna(0)
print(user_trail_table)
#print(len(list(user_trail_table.index)))

query_index = []

for i in range(0,len(user_spec_hike_name)):
    for j in range(0,len(list(user_trail_table.index))):
        if user_spec_hike_name[i] == user_trail_table.index[j]:
            query_index.append(j)
            break
    

            # We choose random movie.
            #query_index = np.random.choice(user_trail_table.shape[0])
            #query_index = [5,6,9]
print('query_index ',query_index)
print("Choosen user's trail is: ",user_trail_table.index[query_index])

user_movie_table_matrix = csr_matrix(user_trail_table.values)
#print('user_movie_table_matrix ', user_movie_table_matrix)
model_knn = NearestNeighbors(metric = 'cosine', algorithm = 'brute')
model_knn.fit(user_movie_table_matrix)
print("user_trail_table.iloc[query_index,:].values.reshape(1,-1)", user_trail_table.iloc[query_index,:].values)
distances, indices = model_knn.kneighbors(user_trail_table.iloc[query_index,:].values, n_neighbors = 6)
print("distances, indices: ",distances," ", indices)

# =============================================================================
# trail = []
# #distance = []
# print(distances.flatten()[0])
# for i in range(0, len(distances.flatten())):
#     if i != 0:
#         trail.append(user_trail_table.index[indices.flatten()[i]])
#         #distance.append(distances.flatten()[i])    
# 
# 
# #print('recommend trail1: ', trail)
# 
# trail = list(dict.fromkeys(trail))
# #print('recommend trail2: ', trail)
# 
# trail = [ x for x in trail if not x in user_spec_hike_name] 
# print('recommend trails: ', trail)
# =============================================================================

trail = []
distance = []
print(distances.flatten()[0])
for i in range(0, len(distances.flatten())):
    if i != 0:
         trail.append(user_trail_table.index[indices.flatten()[i]])
         distance.append(distances.flatten()[i])  
t=pd.Series(trail,name='trail')
d=pd.Series(distance,name='distance')
recommend = pd.concat([t,d], axis=1)
print('type recommend ', type(recommend))
recommend = recommend.sort_values('distance',ascending=True)
is_dist_zero = recommend['distance'] != 0.000000
recommend = recommend[is_dist_zero]
recommend = recommend.drop_duplicates(subset=['trail'])
print(recommend)

print('Recommendations for {0}:\n'.format(user_trail_table.index[query_index]))
for i in range(0,recommend.shape[0]):
    print('{0}: {1}, with distance of {2}'.format(i, recommend["trail"].iloc[i], recommend["distance"].iloc[i]))
    

