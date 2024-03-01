import React, { useState, useEffect } from 'react';
import { socket } from './socket';
import { ConnectionManager } from './components/ConnectionManager';
import { MyForm } from './components/MyForm';

export default function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [message, setMessage] = useState([]);
  const [usersOnline, setUsersOnline] = useState([]);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onMsgRecieved(value) {
      setMessage(previous => [...previous, value]);
    }

    function onUsersOnline(value) {
      setUsersOnline(value);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('msgRecieved', onMsgRecieved);
    socket.on('usersOnline', onUsersOnline);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('msgRecieved', onMsgRecieved);
      socket.off('usersOnline', onUsersOnline);
    };
  }, []);

  if (isConnected) {
    return (
      <div className="App">
        <p>State: { '' + isConnected }</p>
        <p>online: {usersOnline}</p>
        <ul>
        {
          message.map((event, index) =>
            <li key={ index }>{ event.data }</li>
          )
        }
        </ul>
        <ConnectionManager />
        <MyForm />
      </div>
    );  
  } else {
    return (
      <div className="App">
        <p>State: { '' + isConnected }</p>
        <ConnectionManager />
      </div>
    );
  }
}