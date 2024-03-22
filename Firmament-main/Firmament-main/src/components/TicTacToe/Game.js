import React, { useState } from "react";
import RenderIf from "@site/src/components/Utilities/RenderIf";
import Square from "./Square";

function Game() {
  const [board, setBoard] = useState(["","","","","","","","",""]);
  const [player, setPlayer] = useState("O");
  const [winner, setWinner] = useState("");
  const [wIndex, setWIndex] = useState([-1, -1, -1]);
  
  function handleChooseSquare(index) {
    if (board[index] === "" && winner === ""  ) {
      board[index]=player;
      setBoard(board);
      // check if there is a winner
      // for each row, check if there is a winner
      var noWinner = 1;
      for (var r = 0; r < 3; ++r) {
        if (board[r * 3] === player && board[r * 3 + 1] === player && board[r * 3 + 2] === player) {
          noWinner = 0;
          setWinner(player);
          setWIndex([r * 3, r * 3 + 1, r * 3 + 2]);
          break;
        }
      }
      if (noWinner) {
        // for each column, check if there is a winner
        for (var c = 0; c < 3; ++c) {
          if (board[c] === player && board[c + 3] === player && board[c + 6] === player) {
            noWinner = 0;
            setWinner(board[c]);
            setWIndex([c, c + 3,c + 6]);
            break;
          }
        }
        if (noWinner) {
          // check if there is a winner in the diagonals
          if (board[0] === player && board[4] === player && board[8] === player) {
            noWinner = 0
            setWinner(board[0]);
            setWIndex([0, 4, 8]);
          }
          else if (board[2] === player && board[4] === player && board[6] === player) {
            noWinner = 0
            setWinner(board[2]);
            setWIndex([2, 4, 6])
          }
          // check if it is a tie
          if (noWinner) {
            var empty=0;
            for (var i = 0; i < 9; ++i) if (board[i] === "") ++empty;
            if (winner === "" && empty == 0) setWinner("T");
          }
        }
      }
      if (player === "O") setPlayer("X");
      else setPlayer("O");
    }
  }
  
  function handleRestartGame() {
    setBoard(["","","","","","","","",""]);
    setWinner("");
    setPlayer("O");
    setWIndex([-1,-1,-1])
  }
  
  return (
    <div className="tailwind">
      <div className="flex flex-col items-center gap-8">
        <section>
          <RenderIf condition={winner === "T"}>
            <h1 className="text-center text-2xl font-bold mb-8">Tie!</h1>
          </RenderIf>
          <RenderIf condition={winner === "X"}>
            <h1 className="text-center text-2xl font-bold mb-8">The winner is X!</h1>
          </RenderIf>
          <RenderIf condition={winner === "O"}>
            <h1 className="text-center text-2xl font-bold mb-8">The winner is O!</h1>
          </RenderIf>
          <RenderIf condition={winner === ""}>
            <h1 className="text-center text-2xl font-bold mb-8">
              {player}'s turn
            </h1>
          </RenderIf>
          <div className="grid grid-cols-3 grid-rows-3 relative">
            {
              board.map((value, index) => 
                <Square key={index} value={value} index={index} handleChooseSquare={handleChooseSquare} 
                  color={winner === "T" ? "grey" : (index == wIndex[0] || index == wIndex[1] || index == wIndex[2]) ? "red" : "black"}
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