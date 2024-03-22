import React, { useState } from 'react';
import firmamentJPG from '@site/static/img/firmament.jpg';
import Select , { OnChangeValue } from 'react-select'
import { db } from '@site/src/components/FireBase/Wrapper';
import { doc, setDoc, deleteDoc } from "firebase/firestore"; 
import { newsOptions , getLastDayOfAMonth } from '@site/src/components/HKNewsChannels/NewsOptions';

const sleep = ms => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function fetchNews(url) {
  const res = await fetch(`https://cors-anywhere.herokuapp.com/${url}`);
  if (res.ok) return await res.text();
  else {
    throw new Error('Response is not okay! Need to request access at https://cors-anywhere.herokuapp.com/corsdemo');
  }
}

function addPostName(data, options) {
  for (let i = 0; i < data.length; i++) {
    data[i]['srcName'] = options['label'];
  }
  return data;
}

function GetOldString(offset) {
  var date = new Date();
  let day = date.getDate() - offset;
  let month = date.getMonth();
  let year = date.getFullYear();
  if (day <= 0) {
    month = month - 1;
    if (month == -1) {
      month = 11;
      year = year - 1;
    }
    day = getLastDayOfAMonth(month) + day;
  }
  day = day.toString();
  if (day.length < 2) day = "0" + day;
  month = (month + 1).toString();
  if (month.length < 2) month = "0" + month;
  year = year.toString();
  return year + '-' + month + '-' + day;
}

function NewsScreen() {
  const [data, setData] = useState([]);
  const [cors, setCORS] = useState(true);
  const [channel, setChannel] = useState(null);
  
  const handleChange = ( newOption ) => {
    //event.preventDefault();
    const fetchData = async () => {
      try {          
        const msg = await fetchNews(newOption['url']+newOption['path']);        
        let newsData = [];
        newsData = await newOption['parser'](msg);
        newsData = addPostName(newsData, newOption);
        if (newOption['postProcess']) {
          for (let i = 0; i < newOption['postProcess'].length; i++) {
            newsData = newOption['postProcess'][i](newsData, newOption);
          }
        }
        setData(newsData);
        let oldday = GetOldString(3);
        deleteDoc(doc(db, "news", oldday));
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
        newsData.forEach(function({ title, imgUrl, srcUrl, desc, srcName }, index) {
          if (typeof title !== 'undefined' && title.length != 0) {
            setDoc(doc(db, "news", today, srcName, title), {
              imgUrl: imgUrl,
              srcUrl: srcUrl,
              lastUpdated: date.getTime().toString(),
              snowNLPScore: 0
            }).catch((e) => {
              console.error("Error adding document: ", e);
            });
          }
          else {
            console.log(title);
          }
        });
      }
      catch (err) {
        // TODO: find a way to set the temp access of for cors
        setCORS(false);
        console.error(err);
      }
    };
    fetchData();
    setChannel(newOption);
  };
  
  const handlePrevious = (e) => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    e.preventDefault();
    let currentIdx = newsOptions.indexOf(channel);
    handleChange(newsOptions[currentIdx-1]);
  };
  
  const handleNext = (e) => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    e.preventDefault();
    let currentIdx = newsOptions.indexOf(channel);
    handleChange(newsOptions[currentIdx+1]);
  };
  
  const filterOption = (option, inputValue) => {
    const { label, value , data } = option;
    return !data.isHidden && (value.toLowerCase().includes(inputValue.toLowerCase()) || label.toLowerCase().includes(inputValue.toLowerCase()));
  };
  
  if (!data) {
    return (
      <div align="center">
        Loading!
      </div>
    );
  }
  else {
    if (cors) {
      let renderedTags = data.map(( { title, imgUrl, srcUrl, desc, srcName }, index) => 
        <div key={index}>
          <a href={srcUrl} target="_blank">
          <img src={imgUrl} alt=""></img>
          </a>
          <h3>{title}</h3>
          <p>{desc} ... <b>Read more from/細閲 <a href={srcUrl} target="_blank">{srcName}</a></b></p>
        </div>
      )
      if (data.length == 0) {
        if (channel) renderedTags = <h4>Fetching or no news today!</h4>;
        else renderedTags = <h4>Please select a news channel!</h4>;
      }
      let prevNav;
      let nextNav;
      if (channel) {
        let currentIdx = newsOptions.indexOf(channel);
        if (currentIdx < newsOptions.length - 1) {
          nextNav = <a class="pagination-nav__link pagination-nav__link--next " onClick={handleNext} href="" ><div class="pagination-nav__sublabel">Next</div><div class="pagination-nav__label">{newsOptions[currentIdx + 1]['label']}</div></a>
        }
        if (currentIdx > 0) {
          prevNav = <a class="pagination-nav__link pagination-nav__link--prev" onClick={handlePrevious} href=""><div class="pagination-nav__sublabel">Previous</div><div class="pagination-nav__label">{newsOptions[currentIdx - 1]['label']}</div></a>
        }
      }
      return (
        <div align="center">
          <h2>Live News from 
            <Select 
              value={channel}
              options={newsOptions} 
              onChange={handleChange} 
              isOptionDisabled={(option) => option.isDisabled} 
              filterOption={filterOption}
            />
          </h2>
          {renderedTags}
          <nav class="pagination-nav docusaurus-mt-lg" aria-label="Docs pages navigation">{prevNav}{nextNav}</nav>
          
        </div>
      );
    }
    else {
      return (
        <div align="center">
          <h4>Please get temporarily cors access from <a href={"https://cors-anywhere.herokuapp.com/corsdemo"}>here</a></h4>
        </div>
      );
    }
  }
}

export default NewsScreen;