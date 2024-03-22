import React, { useEffect, useState, useRef } from 'react';
import SearchNews, { readNews } from './SearchNews';
import NewsSphere from './NewsSphere';

function SphereNews() {
  const [data, setData] = useState([]);
  
  const setNewsData = (d) => {
    setData(d);
  };
  
  if (data.length == 0) {
    let initData = { setNewsData : setNewsData };
    readNews("", initData);
  } 
  
  return (
    <div align="center">
      <SearchNews setNewsData={setNewsData} />
      <NewsSphere imageData={data}></NewsSphere>
    </div>
  )
}

export default SphereNews;