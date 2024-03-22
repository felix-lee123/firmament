import React, { useEffect, useState, useRef } from 'react';
import SearchNews, { readNews } from './SearchNews';
import NewsSentiment from './NewsSentiment';
import Slider from '@mui/material/Slider';
import Stack from '@mui/material/Stack';

function SentimentNews() {
  const [data, setData] = useState([]);
  const [displayData, setDisplayData] = useState([]);
  const [snowNLPScore, setSnowNLPScore] = useState(1);
  const [posScore, setPosScore] = useState(1);
  
  const setDisplay = (data) => {
    var d = [];
    for (var i = 0; i < data.length; ++i) {
      if (data[i]['pos'] <= posScore && data[i]['snownlp'] <= snowNLPScore) {
        d.push(data[i]);
      }
    }
    setDisplayData(d);
  }
  
  const setNewsData = (d) => {
    setData(d);
    setDisplay(d);
  };
  
  if (data.length == 0) {
    let initData = { setNewsData : setNewsData };
    readNews("", initData);
  } 
  
  const setNewSnowNLPScore = (event, newValue) => {
    setSnowNLPScore(newValue);
    setDisplay(data);
  }
  
  const setNewPosScore = (event, newValue) => {
    setPosScore(newValue);
    setDisplay(data);
  }
  
  return (
    <div align="center">
      <SearchNews setNewsData={setNewsData} />
      <Stack sx={{ height: 750 }} spacing={0} direction="row">
      <Slider
        sx={{
          '& input[type="range"]': {
            WebkitAppearance: 'slider-vertical',
          },
        }}
        orientation="vertical"
        onChange={setNewSnowNLPScore}
        valueLabelDisplay="auto"
        value={snowNLPScore}
        step={0.01}
        min={0}
        max={1}
      />
      <NewsSentiment imageData={displayData} snownlp={snowNLPScore} pos={posScore} ></NewsSentiment>
      </Stack>
      <Slider
        getAriaLabel={() => "Range"}
        value={posScore}
        onChange={setNewPosScore}
        valueLabelDisplay="auto"
        step={0.01}
        min={0}
        max={1}
      />
    </div>
  )
}

export default SentimentNews;