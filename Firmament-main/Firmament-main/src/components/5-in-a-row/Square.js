import React, { HTMLProps } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid, regular, brands, icon } from '@fortawesome/fontawesome-svg-core/import.macro' // <-- import styles to be used


function Square(props) {
  return (
    <button
      className={
        "w-6 h-6 font-bold text-1xl disabled:cursor-not-allowed border border-blue-1000"
      }
      onClick={() => props.handleChooseSquare(props.index)}
      type="button"
      style={{color:props.color}}
      aria-label={String(props.index)}
    >
    {props.value == "O" ? <FontAwesomeIcon icon={icon({name: 'face-smile-beam', style: 'regular'})} style={{"display":"block", "margin":"auto"}}/> : props.value == "X" ? <FontAwesomeIcon icon={icon({name: 'face-smile-beam', style: 'solid'})} style={{"display":"block", "margin":"auto"}} /> : ""}
    </button>
  );
}

export default Square;