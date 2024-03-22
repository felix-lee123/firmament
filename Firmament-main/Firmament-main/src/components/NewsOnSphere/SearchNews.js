import React, { useEffect , useRef } from "react";
import { db } from '@site/src/components/FireBase/Wrapper';
import { collection, doc, setDoc, getDocs, addDoc, deleteDoc, getFirestore, getDoc } from "firebase/firestore"; 
import { newsOptions } from '@site/src/components/HKNewsChannels/NewsOptions';

var date = new Date();
let day = date.getDate();
let month = date.getMonth();
let year = date.getFullYear();
day = day.toString();
if (day.length < 2) day = "0" + day;
month = (month + 1).toString();
if (month.length < 2) month = "0" + month;
year = year.toString();
let today = year + '-' + month + '-' + day;


export function readNews(input, props) {
/*   let newsData = [];
  var readDB = new Promise( (resolve, reject) => {
    for (var i = 0; i < newsOptions.length; ++i) {
      getDocs(collection(db, "news", today, newsOptions[i]['label'])).then((querySnapshot) => {
        let parentId = "";
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          let include = true;
          if (input.length > 0 ) { // filter news
            include = doc.id.includes(input);
          }
          if (include) newsData.push({title: doc.id, imgUrl: doc.data()['imgUrl'], srcUrl: doc.data()['srcUrl'], pos: doc.data()['pysentiPos'], neg: doc.data()['pysentiNeg'], snownlp: doc.data()['snowNLPScore']});
          parentId = doc.ref.parent.id;
        });
        if (newsOptions[newsOptions.length - 1]['label'] == parentId) resolve();
      });
    }
  });
  readDB.then(() => {
    props.setNewsData(newsData);
  }); */
}

const SearchNews = (props) => {
  const timeout = useRef(0);
  
  const handleChange = (e) => {
    clearTimeout(timeout.current);
    
    timeout.current = setTimeout(() => {
      const input = e.target.value;
      readNews(input, props)
    }, 600);
  };
  
  return (
    <input align="center" onChange={handleChange} ></input>
  )
}

export default SearchNews;