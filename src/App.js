import React, { useState, useEffect } from 'react';
import { socket } from './socket';
import { ConnectionManager } from './components/ConnectionManager';
import { MyForm } from './components/MyForm';
import { Login } from './components/Login';

export default function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [message, setMessage] = useState([]);
  const [usersOnline, setUsersOnline] = useState();
  const [userid, setUserid] = useState();
  const [duplicateUserid, setDuplicateUserid] = useState();

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

    function  onDuplicateUserid(value) {
      setDuplicateUserid(value);
    }
    
    function onUseridRecieved(value) {
      setUserid(value);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    
    socket.on('useridRecieved', onUseridRecieved);
    socket.on('duplicateUserid', onDuplicateUserid);
    socket.on('msgRecieved', onMsgRecieved);
    socket.on('usersOnline', onUsersOnline);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);

      socket.off('useridRecieved', onUseridRecieved);
      socket.off('duplicateUserid', onDuplicateUserid);
      socket.off('msgRecieved', onMsgRecieved);
      socket.off('usersOnline', onUsersOnline);
    };
  }, []);

  if (!isConnected) {
    if (userid) {
      setUserid();
    }
    return (
      <div className="App">
        <p>Connected: { '' + isConnected }</p>
        <ConnectionManager />
      </div>
    );
  }

  if (!userid) {
    if (duplicateUserid) {
      return (
        <div>
          <p>'{duplicateUserid}' already exists</p>
          <Login />
        </div>
      )
    } else {
      return (
        <div>
          <p>Welcome!</p>      
          <Login />
        </div>
      )  
    }
  }

  return (
    <div className="App">
      <p>{userid}</p>
      <p>online: {usersOnline}</p>
      <ul>
      {
        message.map((event, index) =>
          <li key={ index }>{ event.userid }: { event.data }</li>
        )
      }
      </ul>
      <MyForm />
    </div>
  );
}