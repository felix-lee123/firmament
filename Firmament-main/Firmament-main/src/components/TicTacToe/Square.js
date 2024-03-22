import React, { HTMLProps } from "react";
import { clsx } from "clsx";  

const indexesWithoutBorderRight = [2, 5, 8];

function Square(props) {
  console.log(props.color);
  return (
    <button
      className={clsx(
        "w-24 h-24 font-bold text-4xl disabled:cursor-not-allowed",
        {
          "border-b border-blue-1000":
            indexesWithoutBorderRight.includes(props.index) && props.index < 8,
        },
        {
          "border-r border-blue-1000": props.index > 5 && props.index < 8,
        },
        {
          "border-r border-b border-blue-1000":
            !indexesWithoutBorderRight.includes(props.index) && props.index <= 5,
        }
      )}
      onClick={() => props.handleChooseSquare(props.index)}
      type="button"
      style={{color:props.color}}
      aria-label={String(props.index)}
    >
    {props.value}
    </button>
  );
}

export default Square;