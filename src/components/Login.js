import React, { useState, useEffect } from 'react';
import { socket } from '../socket';

export function Login({ onGetUserid }) {
  const [value, setValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [duplicateUserid, setDuplicateUserid] = useState();

  function onUseridRecieved(value) {
    onGetUserid(value);
  }

  function  onDuplicateUserid(value) {
    setDuplicateUserid(value);
  }

  useEffect(() => {
    socket.on('useridRecieved', onUseridRecieved);
    socket.on('duplicateUserid', onDuplicateUserid);
    
    return () => {
      socket.off('useridRecieved', onUseridRecieved);
      socket.off('duplicateUserid', onDuplicateUserid);
    };
  });

  function onSubmit(event) {
    event.preventDefault();
    setIsLoading(true);

    socket.timeout(5000).emit('useridInput', value, () => {
      setIsLoading(false);
    });
  }

  const submit = (
    <form onSubmit={ onSubmit }>
      <input placeholder="your name please" onChange={ e => setValue(e.target.value) } />

      <button type="submit" disabled={ isLoading }>Join</button>
    </form>
  )

  if (duplicateUserid) {
    return (
      <div>
        <p>'{duplicateUserid}' already exists</p>
        {submit}
      </div>
    )
  } else {
    return (
      <div>
        <p>Welcome!</p>      
        {submit}
      </div>
    )  
  }
}