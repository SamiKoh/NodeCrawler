# -*- coding: utf-8 -*-
"""
Created on Sat Jan 19 15:18:00 2019

@author: Sami
"""

import time
start = time.time()

import re
from bs4 import BeautifulSoup 
import requests
import urllib
from collections import deque 

wiki = 'en'

wikipath = 'https://' + wiki + '.wikipedia.org/wiki/'

def getLinks(url, final):
    page = requests.get(wikipath + url)    
    soup = BeautifulSoup(page.text)
    
    links = []
    
    for link in soup.find_all('a'):
        l = link.get('href')
        try:    
            if re.match(r'^\/wiki\/[A-z()%0-9.-]*$',l):
                links.append(l.replace('/wiki/', ''))
        except AttributeError:
            pass
        except TypeError:
            pass

    return links

first = urllib.parse.quote('Finland')
final = urllib.parse.quote('Orangutan')

path = {}
path[first] = [first]
Q = deque([first])

cont = True

while len(Q) != 0 and cont:
    page = Q.popleft()
    print("page " + page)
    links = getLinks(page, final)
    for link in links:
        if link.lower() == final.lower():
            print(" -> ".join(path[page]) + " -> " + link)
            cont = False
            break
        elif (link not in path) and (link != page):
            path[link] = path[page] + [link]
            Q.append(link)

end = time.time()

print("It took %d seconds.\n" %(end - start))