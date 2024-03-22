import React, { useEffect , useRef } from "react";
import { shuffleArray } from '@site/src/components/Utilities/Shuffle'

const RADIUS = 600;

const NewsSentiment = (props) => {
  const el = useRef(null);
  const bk = useRef(null);
  const img = useRef(null);
  const lk = useRef(null);
  const animId = useRef(0);
  let rid;
  useEffect(() => {
    const items = el.current.children;
    if (items.length == 0) return;
    // Setup and distribute items in correct positions
    for (let k = 0; k < items.length; ++k) {
      const item = items[k];
      let x = ((item.dataset.pos / (props.pos + 1e-16) - 0.5) * 2);
      let y = ((1-(item.dataset.snow / (props.snownlp + 1e-16)) - 0.5) * 2);
      let z = 0;
      let xp = x * RADIUS;
      let yp = y * RADIUS;
      let zp = z * RADIUS;
      item.className = 'newssentiment-item';
      item.style.transform = `translateY(${yp}px) translateX(${xp}px) translateZ(${zp}px)`;
      // Save item data
      item.dataset.xp = xp.toString();
      item.dataset.yp = yp.toString();
      item.dataset.zp = zp.toString();
    }
  }, [props.imageData]);
  const pickImage = (title, imgUrl, srcUrl) => {
    img.current.src = `${imgUrl}`;
    img.current.style.transform = 'scale(1, 1)';
    bk.current.style.backgroundColor = document.querySelectorAll('[data-theme]')[0].getAttribute('data-theme') == 'light' ? 'white' : '#1b1b1d';
    bk.current.style.transform = 'scale(1, 1)';
    lk.current.text = `${title}`;
    lk.current.href = `${srcUrl}`;
  };
  
  return (
    <div className="newssentiment_container">
      <div className="newssentiment" ref={el}>
        {props.imageData.map(( { title, imgUrl, srcUrl, pos, neg, snownlp}, index) => 
          <div 
            onClick={() => pickImage(title, imgUrl, srcUrl)}
            key={index}
            data-pos={pos}
            data-neg={neg}
            data-snow={snownlp}
            style={{backgroundImage:`url(${imgUrl})`}}
            className='newssentiment-item'>
          </div>
          )
        }
      </div>
      <div 
        onClick={() => {img.current.style.transform = 'scale(0.0, 0.0)'; bk.current.style.transform = 'scale(0.0, 0.0)'}}
        className='image-display_photo'
        ref={bk}>
        <a ref={lk} target="_blank"></a>
        <br></br>
        <img ref={img} style={{maxHeight:'100%', maxWidth:'100%'}}></img>
      </div>
    </div>
  )
};

export default NewsSentiment;
