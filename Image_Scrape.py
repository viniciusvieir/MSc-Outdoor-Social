
## 

from urllib.request import urlopen
from bs4 import BeautifulSoup
import re
import csv
count_rows = 1
count = 1
with open('Best Trails in Ireland _ AllTrails.csv', newline='\n') as csvfile:
    csv_content = csv.reader(csvfile, delimiter=',')
    for row in csv_content:
        if count == 1:
            #print("In IF")
            #print(type(row))
            columns_headings_list = row
            print('columns_headings_list', columns_headings_list)
            count += 1
            count_rows += 1
        else:
            count_rows += 1
            if count_rows > 616:
            #print("In Else")
                name = row[0]
                url = row[1]
                if url == "":
                    print(name,": ",'null')
                else:
                    html = urlopen(url)
        
                    bs = BeautifulSoup(html, 'html.parser')
        
                    images = bs.find_all('div', {'content':re.compile('.jpg')})
        
                    for image in images: 
                        print(name,": ",image['content'])
                

#### To test code on a single link:
# =============================================================================
# html = urlopen('https://www.alltrails.com/trail/ireland/county-meath/royal-canal-way-enfield-to-moyvalley?ref=result-card')
#         
# bs = BeautifulSoup(html, 'html.parser')
# 
# images = bs.find_all('div', {'content':re.compile('.jpg')})
# 
# for image in images: 
#     print(image['content'])
# =============================================================================

