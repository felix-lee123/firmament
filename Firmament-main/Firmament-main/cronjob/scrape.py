# connect to firebase
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

cred = credentials.Certificate('/Firmament/firmament-a19df-34806282babc.json')
app = firebase_admin.initialize_app(cred)
db = firestore.client()

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
#from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service

chrome_options = Options()
chrome_options.add_argument("--headless")
chrome_service = Service('/Firmament/cronjob/chromedriver')

driver = webdriver.Chrome(options=chrome_options,service=chrome_service)
#driver = webdriver.Chrome(ChromeDriverManager().install())

# first get cors access
driver.get('https://cors-anywhere.herokuapp.com/corsdemo')
#driver.find_element_by_xpath("//input[contains(@value, 'Request')]").click()
driver.find_element("xpath", "//input[contains(@value, 'Request')]").click()
wait = WebDriverWait(driver, 100).until(
  EC.presence_of_element_located((By.XPATH, "//strong[contains(text(), 'temporary access')]"))
)

# scrape the website
from datetime import datetime
from datetime import timedelta
from pytz import timezone
tz = timezone('Asia/Hong_Kong')
today = datetime.now(tz).strftime('%Y-%m-%d')
oldday = (datetime.now(tz) - timedelta(days = 3)).strftime('%Y-%m-%d')

# Remove all data
while True:
  collections = db.collection(u'news').document(oldday).collections()
  for collection in collections:
    for doc in collection.stream():    
      doc.reference.delete()
  cnt = 0
  collections = db.collection(u'news').document(oldday).collections()
  for collection in collections:
    for doc in collection.stream():
      ++cnt
  if cnt == 0:
    break;
db.collection(u'news').document(oldday).delete()
print('deleted ', oldday)

# Remove today db
collections = db.collection(u'news').document(today).collections()
for collection in collections:
  for doc in collection.stream():
    doc.reference.delete()    

import time
lastUpdate = str(int(round(time.time() * 1000)))
#print(lastUpdate)

for i in range(21): # skip the one that we couldn't parse yet.  
  driver.get('https://firmament-a19df.web.app/docs/NewsViz/Scrape')
  #driver.find_element_by_id('react-select-2-input').click() # select the drop down box
  driver.find_element(By.ID, 'react-select-2-input').click()
  listbox = WebDriverWait(driver, 100).until(
    EC.presence_of_element_located((By.ID, 'react-select-2-listbox'))
  )

  #optiondiv = driver.find_element_by_id('react-select-2-option-'+str(i))
  optiondiv = driver.find_element(By.ID, 'react-select-2-option-'+str(i))
  optiontext = optiondiv.text
  print(optiontext)
  optiondiv.click() # select the drop down box option
  # wait until the drop down list is updated
  selectedbox = WebDriverWait(driver, 100).until(
    EC.presence_of_element_located((By.XPATH, "//div[contains(text(), '"+optiontext+"')]"))
  )
  # wait until the fetching is done
  WebDriverWait(driver, 100).until(
    EC.invisibility_of_element_located((By.XPATH, "//h4[contains(text(), 'Fetching')]"))
  )
  # get the header
  #divTags = driver.find_element_by_xpath('//header/following-sibling::div')
  divTags = driver.find_element("xpath", "//header/following-sibling::div")
  #aTags = divTags.find_elements_by_css_selector('div div p b a')
  aTags = divTags.find_elements(By.CSS_SELECTOR, 'div div p b a')
  #imgTags = divTags.find_elements_by_css_selector('div div a img')
  imgTags = divTags.find_elements(By.CSS_SELECTOR, 'div div a img')
  #hTags = divTags.find_elements_by_css_selector('div div h3')
  hTags = divTags.find_elements(By.CSS_SELECTOR, 'div div h3')
  #pTags = divTags.find_elements_by_css_selector('div div p')
  pTags = divTags.find_elements(By.CSS_SELECTOR, 'div div p')
  for a, img, h, p in zip(aTags, imgTags, hTags, pTags):
    print(a.get_attribute('href'))
    #print(img.get_attribute('src'))
    print(h.text)
    #print(p.text)
    #print("")
    try:
      db.collection(u'news').document(today).collection(optiontext).document(h.text).set({
        u'imgUrl': img.get_attribute('src'),
        u'srcUrl': a.get_attribute('href'),
        u'lastUpdated': lastUpdate,
        u'snowNLPScore': 0,
        u'pysentiPos': 0,
        u'pysentiNeg': 0
      })
    except:
      print("Failed to write to db")

#print(driver.page_source.encode("utf-8"))

driver.quit()
