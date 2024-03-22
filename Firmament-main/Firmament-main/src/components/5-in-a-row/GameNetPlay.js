import React, { useState, useEffect } from "react";
import RenderIf from "@site/src/components/Utilities/RenderIf";
import Square from "./Square";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid, regular, brands, icon } from '@fortawesome/fontawesome-svg-core/import.macro' // <-- import styles to be used
import { rtdb } from '@site/src/components/FireBase/Wrapper';
import firebase from 'firebase/compat/app';
import { ref, set, child, get, remove, update } from "firebase/database";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';



const boardSize = 15
var arr = [];
const dbRef = ref(rtdb);
const lastBoardIndex = boardSize * boardSize
  
for (var i = 0; i < lastBoardIndex; i++) {
  arr.push("");
}
arr.push("O");// to indicate the current turn
arr.push(""); // to indicate the winner
for (var i = 0; i < 5; ++i) {
  arr.push(-1); // the winner indices
}

function GameNetPlay() {
  const [player, setPlayer] = useState("");
  const [boardId, setBoardId] = useState("");
  const [board, setBoard] = useState(arr);
  const [roomData, setRoomData] = useState({});
  const [selectedRoom, setSelectedRoom] = useState("")
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const handleClose = () => {
    setOpen(false);
  };
  
  useEffect(() => {
    const interval = setInterval((boardId) => {
      if (boardId === "") {
        // update room list
        get(child(dbRef, `gomoku`)).then((snapshot) => {
          if (snapshot.exists()) {
            setRoomData(snapshot.val());
            //console.log('Room lists are reloaded every second');
          }
          else setRoomData({});
        }).catch((error) => {
          console.error(error);
        });
      }
      else {
        // update game status
        get(ref(rtdb, 'gomoku/' + boardId + "/board")).then((snapshot) => {
          if (snapshot.exists()) {
            setBoard(snapshot.val());
            //console.log('Board is reloaded every second');
          }
          else {
            handleQuitGame();
          }
        }).catch((error) => {
          console.error(error);
        });
      }
    }, 500, boardId);
    return () => clearInterval(interval);
  }, [boardId]);
  
  var currentRooms = "";
  if (roomData) {
    currentRooms = Object.keys(roomData).map( (value, index) => {
      return <option key={index}>{value}</option>
    });
  }
  
  const handleRoomSelect = (event) => {
    setSelectedRoom(event.target.value);
  }
  
  const handleSubmit = (event) => {
    event.preventDefault();
    if (event.nativeEvent.submitter.name === "new") {
      // create new room
      var letters = "room";
      var digits = 0;
      if (currentRooms.length) {
        var lastRoom = currentRooms[currentRooms.length-1].props.children;
        var patt1 = /[0-9]/g;
        var patt2 = /[a-zA-Z]/g;
        letters = lastRoom.match(patt2).join('');
        if (letters === null) letters = "room";
        digits = lastRoom.match(patt1);
        if (digits === null) digits = 0;
        else digits = Number(digits.join('')) + 1;
      }
      var roomId = letters + digits.toString().padStart(4, "0");
      set(ref(rtdb, 'gomoku/' + roomId), {
        player0: "O",
        player1: "",
        board: board,
      }).then(() => {
        // Data saved successfully!
        //console.log("created");
        //console.log(roomId);
        setBoardId(roomId);
        setPlayer("O");
      }).catch((e) => {
        console.error("Error adding to database: ", e);
      });
    }
    else if (event.nativeEvent.submitter.name === "join") {
      if (selectedRoom !== "") {
        update(ref(rtdb, 'gomoku/' + selectedRoom), {
          player1: "X"
        }).then(() => {
          // Data saved successfully!
          //console.log("created");
          //console.log(selectedRoom);
          setBoardId(selectedRoom);
          setPlayer("X");
        }).catch((e) => {
          console.error("Error adding to database: ", e);
        });
      }else{
        setOpen(true);
      }
    }
  };
  
  function handleChooseSquare(index) {
    if (player !== board[lastBoardIndex]) return;
    
    if (board[index] === "" && board[lastBoardIndex + 1] === ""  ) {
      board[index]=player;
      // check if there is a winner
      // for each row, check if there is a winner
      var noWinner = 1;
      for (var r = 0; r < lastBoardIndex; ++r) {
        if (r%boardSize<(r + 1)%boardSize && r%boardSize<(r + 2)%boardSize && r%boardSize<(r + 3)%boardSize && r%boardSize<(r + 4)%boardSize && board[r] === player && board[r + 1] === player && board[r + 2] === player && board[r + 3] === player && board[r + 4] === player ) {
          noWinner = 0;
          board[lastBoardIndex + 1] = player;
          board[lastBoardIndex + 2] = r;
          board[lastBoardIndex + 3] = r + 1;
          board[lastBoardIndex + 4] = r + 2;
          board[lastBoardIndex + 5] = r + 3;
          board[lastBoardIndex + 6] = r + 4;
          break;
        }
        if (r%boardSize>(r + boardSize-1)%boardSize && r%boardSize>(r + (boardSize-1)*2)%boardSize && r%boardSize>(r + (boardSize-1)*3)%boardSize && r%boardSize>(r + (boardSize-1)*4)%boardSize && board[r] === player && board[r + boardSize -1] === player && board[r + (boardSize - 1) * 2] === player && board[r + (boardSize - 1) * 3] === player && board[r + (boardSize - 1) * 4] === player) {
          noWinner = 0;
          board[lastBoardIndex + 1] = player;
          board[lastBoardIndex + 2] = r;
          board[lastBoardIndex + 3] = r + (boardSize - 1);
          board[lastBoardIndex + 4] = r + (boardSize - 1) * 2;
          board[lastBoardIndex + 5] = r + (boardSize - 1) * 3;
          board[lastBoardIndex + 6] = r + (boardSize - 1) * 4;
          break;
        }
        if ((r+boardSize) <boardSize*boardSize && (r+boardSize*2) <boardSize*boardSize && (r+boardSize*3) <boardSize*boardSize && (r+boardSize*4) <boardSize*boardSize && board[r] === player && board[r + boardSize] === player && board[r + (boardSize * 2)] === player && board[r + (boardSize * 3)] === player && board[r + (boardSize * 4)] === player) {
          noWinner = 0;
          board[lastBoardIndex + 1] = player;
          board[lastBoardIndex + 2] = r;
          board[lastBoardIndex + 3] = r + (boardSize);
          board[lastBoardIndex + 4] = r + (boardSize) * 2;
          board[lastBoardIndex + 5] = r + (boardSize) * 3;
          board[lastBoardIndex + 6] = r + (boardSize) * 4;
          break;
        }
        if (r%boardSize<(r + boardSize + 1)%boardSize && r%boardSize<(r + (boardSize + 1) * 2)%boardSize && r%boardSize<(r + (boardSize + 1) * 3)%boardSize && r%boardSize<(r + (boardSize + 1) * 3)%boardSize && board[r] === player && board[r + boardSize + 1] === player && board[r + (boardSize + 1) * 2] === player && board[r + (boardSize + 1) * 3] === player && board[r + (boardSize + 1) * 4] === player) {
          noWinner = 0;
          board[lastBoardIndex + 1] = player;
          board[lastBoardIndex + 2] = r;
          board[lastBoardIndex + 3] = r + (boardSize + 1);
          board[lastBoardIndex + 4] = r + (boardSize + 1) * 2;
          board[lastBoardIndex + 5] = r + (boardSize + 1) * 3;
          board[lastBoardIndex + 6] = r + (boardSize + 1) * 4;
          break;
        }
      }
      
      // check if it is a tie
      if (noWinner) {
        var empty=0;
        for (var i = 0; i < lastBoardIndex; ++i) if (board[i] === "") ++empty;
        if (board[lastBoardIndex + 1] === "" && empty == 0) board[lastBoardIndex + 1] = "T";
      }
    }
    
    // change turn
    if (board[lastBoardIndex] === "O") board[lastBoardIndex] = "X";
    else board[lastBoardIndex] = "O";
    
    // database update    
    update(ref(rtdb, 'gomoku/' + boardId), {
      board: board
    }).then(() => {
      // Data saved successfully!
      //console.log("updated board");
      //console.log(board);
      setBoard(board);
    }).catch((e) => {
      console.error("Error adding to database: ", e);
    });
  }
  
  function handleQuitGame() {
    if (boardId !== "") {
      remove(ref(rtdb, 'gomoku/' + boardId)).then(() => {
        // Data saved successfully!
      }).catch((e) => {
        console.error("Error remove database: ", e);
      }); 
      setBoardId("");
      setPlayer("");
      for (var i = 0; i < lastBoardIndex; i++) {
        arr[i] = "";
      }
      arr[lastBoardIndex] = "O";
      arr[lastBoardIndex + 1] = "";
      arr[lastBoardIndex + 2] = -1;
      arr[lastBoardIndex + 3] = -1;
      arr[lastBoardIndex + 4] = -1;
      arr[lastBoardIndex + 5] = -1;
      arr[lastBoardIndex + 6] = -1;
      setBoard(arr);
    }
  }
  
  useEffect(function mount() {
    function onUnload() {
      if (boardId !== "") {
        remove(ref(rtdb, 'gomoku/' + boardId)).then(() => {
          // Data saved successfully!
        }).catch((e) => {
          console.error("Error remove database: ", e);
        }); 
        setBoardId("");
        setPlayer("");
        for (var i = 0; i < lastBoardIndex; i++) {
          arr[i] = "";
        }
        arr[lastBoardIndex] = "O";
        arr[lastBoardIndex + 1] = "";
        arr[lastBoardIndex + 2] = -1;
        arr[lastBoardIndex + 3] = -1;
        arr[lastBoardIndex + 4] = -1;
        arr[lastBoardIndex + 5] = -1;
        arr[lastBoardIndex + 6] = -1;
        setBoard(arr);
      }
    }

    window.onbeforeunload = onUnload;

    return function unMount() {
      window.onbeforeunload = null;
    };
  }, [boardId,lastBoardIndex,arr]);
  
  var formatString="grid grid-cols-15 grid-rows-15 relative";
  if (boardId === "") {
    return (
      <form onSubmit={handleSubmit}>
        <div>
        <select size="10" style={{"max-width":"70%", "width":"400px"}} onChange={handleRoomSelect}> 
          {currentRooms}
        </select>
        </div>
        <div>
        <button type="submit" name="new">New Room</button>
        <button type="submit" name="join">Join Room</button>
        <Dialog
          fullScreen={fullScreen}
          open={open}
          onClose={handleClose}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title">
            Nonono
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please choose a room
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={handleClose}>
              Ok
            </Button>
          </DialogActions>
        </Dialog>
        </div>
      </form>
      
    );
  }
  else {
    return (
      <div className="tailwind">
        <div className="flex flex-col items-center gap-8">
          <section>
            <RenderIf condition={board[lastBoardIndex + 1] === "T"}>
              <h1 className="text-center text-2xl font-bold mb-8">Tie!</h1>
            </RenderIf>
            <RenderIf condition={board[lastBoardIndex + 1] === "X"}>
              <h1 className="text-center text-2xl font-bold mb-8">The winner is <FontAwesomeIcon icon={icon({name: 'face-smile-beam', style: 'solid'})} style={{"display":"inline-block", "margin":"auto"}}/>! {board[lastBoardIndex+1] === player ? " (You)" : " (Your Opponent)"} </h1>
            </RenderIf>
            <RenderIf condition={board[lastBoardIndex + 1] === "O"}>
              <h1 className="text-center text-2xl font-bold mb-8">The winner is <FontAwesomeIcon icon={icon({name: 'face-smile-beam', style: 'regular'})} style={{"display":"inline-block", "margin":"auto"}}/>! {board[lastBoardIndex+1] === player ? " (You)" : " (Your Opponent)"} </h1>
            </RenderIf>
            <RenderIf condition={board[lastBoardIndex + 1] === ""}>
              <h1 className="text-center text-2xl font-bold mb-8">
                <span>
                {board[lastBoardIndex] == "O" ? <FontAwesomeIcon icon={icon({name: 'face-smile-beam', style: 'regular'})} style={{"display":"inline-block", "margin":"auto"}}/> : <FontAwesomeIcon icon={icon({name: 'face-smile-beam', style: 'solid'})} style={{"display":"inline-block", "margin":"auto"}}/>}
                's Turn {board[lastBoardIndex] === player ? " (You)" : " (Your Opponent)"}
                </span>
              </h1>
            </RenderIf>
            <div className={formatString}>
              {
                board.map((value, index) => 
                  (index < lastBoardIndex) 
                  ? 
                  <Square key={index} value={value} index={index} handleChooseSquare={handleChooseSquare} 
                    color={board[lastBoardIndex + 1] === "T" ? "grey" : (index == board[lastBoardIndex + 2] || index == board[lastBoardIndex + 3] || index == board[lastBoardIndex + 4] || index == board[lastBoardIndex + 5] || index == board[lastBoardIndex + 6]) ? "red" : "black"}
                  />
                  :
                  <div></div>
                )
              }
            </div>
          </section>
          <button type="button" onClick={handleQuitGame} style={{color:"var(--ifm-color-content-secondary)", fontSize:"var(--ifm-h5-font-size)", fontWeight:"var(--ifm-font-weight-semibold)"}}>
            Quit
          </button>
        </div>
      </div>
    );
  }
}

export default GameNetPlay;