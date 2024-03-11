import React, { useState, useEffect } from 'react';
import { socket } from '../socket';

export function GameQueueManager({ userid, onGetMatchInfo }) {
  const [isLoading, setIsLoading] = useState(false);
  const [joinedQueue, setJoinedQueue] = useState(false);
  const [isMatched, setIsMatched] = useState(false);

  useEffect(() => {
    function onGameMatched(value) {
      setIsMatched(true);
      onGetMatchInfo(value);
    }

    socket.on('gameMatched', onGameMatched);

    return () => {
      socket.off('gameMatched', onGameMatched);
    };
  });
  
  function joinGameQueue(event) {
    event.preventDefault();
    setIsLoading(true);

    socket.timeout(5000).emit('joinGameQueue', {'user_id': userid}, () => {
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
    return <p>Game Matched!</p>
  } else {
    return <p>Game Matching...</p>
  }
}