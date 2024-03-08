import React, { useState, useEffect } from 'react';
import { socket } from './socket';
import { ConnectionManager } from './components/ConnectionManager';
import { MyForm } from './components/MyForm';
import { Login } from './components/Login';
import { GlobalChatWindow } from './components/GlobalChatWindow';
import { GameQueueManager } from './components/GameQueueManager';

export default function App() {
  const [isConnected, setIsConnected] = useState();
  const [userid, setUserid] = useState();

  const handleUserid = (newState) => {
    setUserid(newState);
  };

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, []);

  if (!isConnected) {
    if (userid) {
      setUserid();
    }
    return (
      <div className="App">
        <p>Connected: { '' + isConnected }</p>
        <ConnectionManager/>
      </div>
    );
  }

  if (!userid) {
    return <Login onGetUserid={handleUserid}/>
  }

  return (
    <div className="App">
      <p>{userid}</p>
      <GameQueueManager />
      <GlobalChatWindow />
      <MyForm />
    </div>
  );
}