##
## 

from urllib.request import urlopen
from bs4 import BeautifulSoup
import re
import csv
#count_rows = 1
count = 1
final_list = []
with open('Best Trails in Ireland_trail_url.csv', newline='\n') as csvfile:
    csv_content = csv.reader(csvfile, delimiter=',')
    
    for row in csv_content:
        if count == 1:
            #print("In IF")
            #print(type(row))
            columns_headings_list = row
            print('columns_headings_list', columns_headings_list)
            count += 1

        else:

            name = row[0]
            url = row[1]
            if url == "":
                print(name,": ",'null')
                img_url = ""
                
            else:
                html = urlopen(url)
    
                bs = BeautifulSoup(html, 'html.parser')
    
                images = bs.find_all('div', {'content':re.compile('.jpg')})
                
                for image in images: 
                    img_url = image['content']
                    
            one_ele_list = [name,url,img_url]    
            final_list.append(one_ele_list)    
                
print(final_list)
csvfile.close()
          
file2 = open('Best Trails in Ireland_trail_img_url.csv', 'a+', newline ='')
# opening the csv file in 'a+' mode 
#file = open('g4g.csv', 'a+', newline ='') 
  
# writing the data into the file 
with file2:     
    write = csv.writer(file2) 
    write.writerows(final_list) 
    
file2.close()
#### To test code on a single link:
# =============================================================================
# html = urlopen('#####')
#         
# bs = BeautifulSoup(html, 'html.parser')
# #print(bs)
# 
# images = bs.find_all('div', {'content':re.compile('.jpg')})
# 
# for image in images: 
#     print(image['content'])
# 
# =============================================================================

