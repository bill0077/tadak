import React, { useState, useEffect } from 'react';
import { socket } from '../socket';

export function GameBoard({ matchInfo }) {
  const [countdown, setCountdown] = useState(5);
  const [targetWord, setTargetWord] = useState();
  const [currTargetIndex, setCurrTargetIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [myWordTower, setMyWordTower] = useState([]);
  const [oppoWordTower, setOppoWordTower] = useState([]);
  const [winner, setWinner] = useState();

  useEffect(() => {
    if (countdown === 5) {    
      socket.timeout(5000).emit('playerReady');
    }

    const delayedFunction = () => {
      setCountdown(countdown-1);
    };

    // Set a timeout for 1 second
    const timeoutId = setTimeout(delayedFunction, 1000);

    function onTargetWord(value) {
      setTargetWord(value)
    }

    function onOppoClearWord(value) {
      setOppoWordTower(previous => [...previous, value.clearWord]);
    }

    function onMatchResult(value) {
      setWinner(value)
    }

    socket.on('targetWord', onTargetWord);
    socket.on('oppoClearWord', onOppoClearWord);
    socket.on('matchResult', onMatchResult);

    return () => {
      socket.off('targetWord', onTargetWord);
      socket.off('oppoClearWord', onOppoClearWord);
      socket.off('matchResult', onMatchResult);
      
      clearTimeout(timeoutId) // Clear the timeout to avoid memory leaks
    };
  });

  function onSubmit(event) {
    event.preventDefault();
    const input = userInput
    setUserInput('')
    if (targetWord.word[currTargetIndex] === input) {
      setMyWordTower(previous => [...previous, input]);

      socket.timeout(5000).emit('wordClear', {"room":matchInfo.room, "clearWord":input});
      setCurrTargetIndex(currTargetIndex+1)
      if (currTargetIndex >= targetWord.length-1) {
        socket.timeout(5000).emit('allClear', {"room":matchInfo.room});
      }
    }
    
  }

  if (winner) {
    return <p>{winner.winnerId} win!</p>
  }

  if (countdown > 0) {
    return (
      <>
        <p>Game Matched!</p>
        <p>{matchInfo.player[0]} VS {matchInfo.player[1]}</p>
        <p>match starts in {countdown}</p>
      </>
    )
  } else if (targetWord) {
    return (
      <>
        <form onSubmit={ onSubmit }>
          <p>{targetWord.word[currTargetIndex]}</p>
          <input onPaste={e => {
            e.preventDefault();
            return false;
          }} value={userInput} onChange={ e => setUserInput(e.target.value) } />
        </form>
        <div style={{display:'flex'}}>
          <ul>
            <p>YOU</p>
            {
              myWordTower.map((word, index) =>
                <li key={ index }>{word}</li>
              )
            }
          </ul>
          <ul>
            <p>OPPONENT</p>
            {
              oppoWordTower.map((word, index) =>
                <li key={ index }>{word}</li>
              )
            }
          </ul>
        </div>
      </>
    );
  } else {
    return <p>error :(</p>
  }
}