import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

cred = credentials.Certificate('/Firmament/firmament-a19df-34806282babc.json')
try:
  app = firebase_admin.initialize_app(cred)
except:
  print("firebase app already initialized!")
db = firestore.client()

from snownlp import SnowNLP
from datetime import datetime
from pytz import timezone
tz = timezone('Asia/Hong_Kong')
today = datetime.now(tz).strftime('%Y-%m-%d')
print(today)

collections = db.collection(u'news').document(today).collections()

for collection in collections:
  for doc in collection.stream():
    print("title: ", doc.id)
    #print("srcUrl: ", doc.get('srcUrl'))
    #print("imgUrl: ", doc.get('imgUrl'))
    print("news: ", collection.id)
    doc.reference.update({"snowNLPScore" : SnowNLP(doc.id).sentiments})

