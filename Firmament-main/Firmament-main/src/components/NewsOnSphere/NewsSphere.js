import React, { useEffect , useRef } from "react";
import { getSpherePoint } from '@site/src/components/Sphere/FibSphere'
import { shuffleArray } from '@site/src/components/Utilities/Shuffle'

const MAX_COUNT = 100;
const RADIUS = 600;

const NewsSphere = (props) => {
  const el = useRef(null);
  const bk = useRef(null);
  const img = useRef(null);
  const lk = useRef(null);
  const animId = useRef(0);
  let rid;
  let mouseShiftX = 0;
  let mouseShiftY = 0;
  useEffect(() => {
    const items = el.current.children;
    if (items.length == 0) return;
    // Setup and distribute items in correct positions
    let maxItem = items.length < MAX_COUNT ? items.length : MAX_COUNT;
    for (let k = 0; k < maxItem; ++k) {
      let spherePoint = getSpherePoint(k, maxItem);
      let xp = spherePoint['y'] * RADIUS;
      let yp = spherePoint['x'] * RADIUS;
      let zp = spherePoint['z'] * RADIUS;
      const item = items[k];
      item.className = 'newssphere-item';
      item.style.transform = `translateY(${yp}px) translateX(${xp}px) translateZ(${zp}px)`;
      // Save item data
      item.dataset.xp = xp.toString();
      item.dataset.yp = yp.toString();
      item.dataset.zp = zp.toString();
    }
    // Update animation
    try {
      if (!!animId) cancelAnimationFrame(animId.current);
    } 
    catch (e) {
      //consolelog(e);
    }
    const updateFrame = () => {
      animId.current = requestAnimationFrame(updateFrame);
      try {
        const items = el.current.children;
        if (items.length == 0) return;
        let maxItem = items.length < MAX_COUNT ? items.length : MAX_COUNT;
        for (let i = 0; i < maxItem; i++) {
          const item = items[i];
          let xp = parseFloat(item.dataset.xp);
          let yp = parseFloat(item.dataset.yp);
          let zp = parseFloat(item.dataset.zp);
          //angle += mouseShiftX;
          let cx = Math.cos(mouseShiftX);
          let sx = Math.sin(mouseShiftX);
          let nxp = cx * xp - sx * zp;
          let nzp = sx * xp + cx * zp;
          let cy = Math.cos(mouseShiftY);
          let sy = Math.sin(mouseShiftY);
          let nyp = cy * yp - sy * nzp;
          let nnzp = sy * yp + cy * nzp;
          item.style.transform = `translateY(${nyp}px) translateX(${nxp}px) translateZ(${nnzp}px)`;
          // Save item data
          item.dataset.xp = nxp.toString();
          item.dataset.yp = nyp.toString();
          item.dataset.zp = nnzp.toString();
        }
      }
      catch (e) {
        //console.log(e);
      }
    };
    updateFrame();
    // Calculate mouse shift
    const onMouseMove = (e) => {
      mouseShiftX = (e.clientX / innerWidth - 0.5) * 0.05;
      mouseShiftY = (e.clientY/ innerHeight - 0.5) * 0.05;
    };
    document.body.addEventListener('mousemove', onMouseMove);
  }, [props.imageData]);
  const pickImage = (title, imgUrl, srcUrl) => {
    img.current.src = `${imgUrl}`;
    img.current.style.transform = 'scale(1, 1)';
    bk.current.style.backgroundColor = document.querySelectorAll('[data-theme]')[0].getAttribute('data-theme') == 'light' ? 'white' : '#1b1b1d';
    bk.current.style.transform = 'scale(1, 1)';
    lk.current.text = `${title}`;
    lk.current.href = `${srcUrl}`;
  };
  
  let imageData = shuffleArray(props.imageData);
  return (
    <div className="newssphere_container">
      <div className="newssphere" ref={el}>
        {imageData.map(( { title, imgUrl, srcUrl }, index) => 
          (index < MAX_COUNT) 
          ?
            <div 
              onClick={() => pickImage(title, imgUrl, srcUrl)}
              key={index} 
              style={{backgroundImage:`url(${imgUrl})`}}
              className='newssphere-item'>
            </div>
          :
            <div key={index} title={title} ></div>
          )
        }
      </div>
      <div 
        onClick={() => {img.current.style.transform = 'scale(0.0, 0.0)'; bk.current.style.transform = 'scale(0.0, 0.0)'}}
        className='image-display_photo'
        ref={bk}>
        <img ref={img} style={{maxHeight:'100%', maxWidth:'100%'}}></img>
        <br></br>
        <a ref={lk} target="_blank"></a>
      </div>
    </div>
  )
};

export default NewsSphere;
