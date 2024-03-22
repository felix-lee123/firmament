import React, { useEffect, useState, useRef } from 'react';
import SearchNews, { readNews } from '@site/src/components/NewsOnSphere/SearchNews';

function NewScreen2() {
  const [data, setData] = useState([]);
  
  const setNewsData = (d) => {
    setData(d);
  };
  
  if (data.length == 0) {
    let initData = { setNewsData : setNewsData };
    readNews("", initData);
  }
  
  let renderedTags = data.map(( { title, imgUrl, srcUrl }, index) => 
    <div key={index}>
      <a href={srcUrl} target="_blank">
      <img src={imgUrl} alt=""></img>
      </a>
      <a href={srcUrl} target="_blank">
      <h3>{title}</h3>
      </a>
    </div>
  )
  
  return (
    <div align="center">
      <SearchNews setNewsData={setNewsData} />
      { renderedTags }
    </div>
  )
}

export default NewScreen2;