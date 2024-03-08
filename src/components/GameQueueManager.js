import React, { useState, useEffect } from 'react';
import { socket } from '../socket';
import { GameBoard } from './GameBoard';

export function GameQueueManager() {
  const [isLoading, setIsLoading] = useState(false);
  const [joinedQueue, setJoinedQueue] = useState(false);
  const [isMatched, setIsMatched] = useState(false);
  const [matchInfo, setMatchInfo] = useState();

  useEffect(() => {
    function onGameMatched(value) {
      setIsMatched(true);
      setMatchInfo(value)
    }

    socket.on('gameMatched', onGameMatched);

    return () => {
      socket.off('gameMatched', onGameMatched);
    };
  });
  
  function joinGameQueue(event) {
    event.preventDefault();
    setIsLoading(true);

    socket.timeout(5000).emit('joinGameQueue', () => {
      setIsLoading(false);
      setJoinedQueue(true);
    });
  }

  if (!joinedQueue && !isLoading) {
    return <button onClick={joinGameQueue}>Join Match Making</button>
  } else if (!joinedQueue) {
    return <p>Joining game queue...</p>
  }

  if (isMatched) {
    return <GameBoard matchInfo={matchInfo}/>
  } else {
    return <p>Game Matching...</p>
  }
}