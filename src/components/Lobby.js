import React, { useState } from 'react';
import { GameBoard } from './GameBoard';
import { GameQueueManager } from './GameQueueManager'
import { GlobalChatWindow } from './GlobalChatWindow';

export function Lobby({ userid }) {
  const [matchInfo, setMatchInfo] = useState();
  const [isMatchFinished, setMatchFinished] = useState(false);

  if (matchInfo && !isMatchFinished) {
    return (
      <GameBoard userid={userid} matchInfo={matchInfo} onMatchFinished={setMatchFinished}/>
    );
  }

  if (matchInfo && isMatchFinished) {
    setMatchInfo()
    setMatchFinished(false)
  }

  return (
    <>
      <GameQueueManager userid={userid} onGetMatchInfo={setMatchInfo}/>
      <GlobalChatWindow />
    </>
  );
  
}