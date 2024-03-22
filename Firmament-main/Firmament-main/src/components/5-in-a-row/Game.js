import React, { useState } from "react";
import RenderIf from "@site/src/components/Utilities/RenderIf";
import Square from "./Square";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid, regular, brands, icon } from '@fortawesome/fontawesome-svg-core/import.macro' // <-- import styles to be used

const boardSize = 15
var arr = [];
  
for (var i = 0; i < boardSize * boardSize; i++) {
  arr.push("");
}

function Game() {
  const [board, setBoard] = useState(arr);
  const [player, setPlayer] = useState("O");
  const [winner, setWinner] = useState("");
  const [wIndex, setWIndex] = useState([-1, -1, -1, -1, -1]);


  function handleChooseSquare(index) {
    if (board[index] === "" && winner === ""  ) {
      board[index]=player;
      setBoard(board);
      // check if there is a winner
      // for each row, check if there is a winner
      var noWinner = 1;
      for (var r = 0; r < boardSize * boardSize; ++r) {
        if (r%boardSize<(r + 1)%boardSize && r%boardSize<(r + 2)%boardSize && r%boardSize<(r + 3)%boardSize && r%boardSize<(r + 4)%boardSize && board[r] === player && board[r + 1] === player && board[r + 2] === player && board[r + 3] === player && board[r + 4] === player ) {
          noWinner = 0;
          setWinner(player);
          setWIndex([r, r + 1, r + 2, r + 3, r + 4]);
          break;
        }
        if (r%boardSize>(r + boardSize-1)%boardSize && r%boardSize>(r + (boardSize-1)*2)%boardSize && r%boardSize>(r + (boardSize-1)*3)%boardSize && r%boardSize>(r + (boardSize-1)*4)%boardSize && board[r] === player && board[r + boardSize -1] === player && board[r + (boardSize - 1) * 2] === player && board[r + (boardSize - 1) * 3] === player && board[r + (boardSize - 1) * 4] === player) {
          noWinner = 0;
          setWinner(player);
          setWIndex([r, r + (boardSize - 1), r + (boardSize - 1) * 2, r + (boardSize - 1) * 3, r + (boardSize - 1) * 4]);
          break;
        }
        if ((r+boardSize) <boardSize*boardSize && (r+boardSize*2) <boardSize*boardSize && (r+boardSize*3) <boardSize*boardSize && (r+boardSize*4) <boardSize*boardSize && board[r] === player && board[r + boardSize] === player && board[r + (boardSize * 2)] === player && board[r + (boardSize * 3)] === player && board[r + (boardSize * 4)] === player) {
          noWinner = 0;
          setWinner(player);
          setWIndex([r, r + boardSize, r + boardSize * 2, r + boardSize * 3, r + boardSize * 4]);
          break;
        }
        if (r%boardSize<(r + boardSize + 1)%boardSize && r%boardSize<(r + (boardSize + 1) * 2)%boardSize && r%boardSize<(r + (boardSize + 1) * 3)%boardSize && r%boardSize<(r + (boardSize + 1) * 3)%boardSize && board[r] === player && board[r + boardSize + 1] === player && board[r + (boardSize + 1) * 2] === player && board[r + (boardSize + 1) * 3] === player && board[r + (boardSize + 1) * 4] === player) {
          noWinner = 0;
          setWinner(player);
          setWIndex([r, r + boardSize + 1, r + (boardSize + 1) * 2, r + (boardSize + 1) * 3, r + (boardSize + 1) * 4]);
          break;
        }
      }
      
        // check if it is a tie
      if (noWinner) {
        var empty=0;
        for (var i = 0; i < boardSize * boardSize; ++i) if (board[i] === "") ++empty;
        if (winner === "" && empty == 0) setWinner("T");
      }
        
      
      if (player === "O") setPlayer("X");
      else setPlayer("O");
    }
  }
  
  function handleRestartGame() {
    for (var i = 0; i < boardSize * boardSize; i++) {
      arr[i] = "";
    }
    setBoard(arr);
    setWinner("");
    setPlayer("O");
    setWIndex([-1,-1,-1,-1,-1])
  }
  
  var formatString="grid grid-cols-15 grid-rows-15 relative";
  return (
    <div className="tailwind">
      <div className="flex flex-col items-center gap-8">
        <section>
          <RenderIf condition={winner === "T"}>
            <h1 className="text-center text-2xl font-bold mb-8">Tie!</h1>
          </RenderIf>
          <RenderIf condition={winner === "X"}>
            <h1 className="text-center text-2xl font-bold mb-8">The winner is <FontAwesomeIcon icon={icon({name: 'face-smile-beam', style: 'solid'})} style={{"display":"inline-block", "margin":"auto"}}/>!</h1>
          </RenderIf>
          <RenderIf condition={winner === "O"}>
            <h1 className="text-center text-2xl font-bold mb-8">The winner is <FontAwesomeIcon icon={icon({name: 'face-smile-beam', style: 'regular'})} style={{"display":"inline-block", "margin":"auto"}}/>!</h1>
          </RenderIf>
          <RenderIf condition={winner === ""}>
            <h1 className="text-center text-2xl font-bold mb-8">
              <span>
              {player == "O" ? <FontAwesomeIcon icon={icon({name: 'face-smile-beam', style: 'regular'})} style={{"display":"inline-block", "margin":"auto"}}/> : <FontAwesomeIcon icon={icon({name: 'face-smile-beam', style: 'solid'})} style={{"display":"inline-block", "margin":"auto"}}/>}
              's Turn
              </span>
            </h1>
          </RenderIf>
          <div className={formatString}>
            {
              board.map((value, index) => 
                <Square key={index} value={value} index={index} handleChooseSquare={handleChooseSquare} 
                  color={winner === "T" ? "grey" : (index == wIndex[0] || index == wIndex[1] || index == wIndex[2] || index == wIndex[3] || index == wIndex[4]) ? "red" : "black"}
                />
              )
            }
          </div>
        </section>
        <button type="button" onClick={handleRestartGame} style={{color:"var(--ifm-color-content-secondary)", fontSize:"var(--ifm-h5-font-size)", fontWeight:"var(--ifm-font-weight-semibold)"}}>
          New Game
        </button>
      </div>
    </div>
  );
}

export default Game;