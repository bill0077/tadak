import React, { useState } from 'react';
import { socket } from '../socket';

export function Login() {
  const [value, setValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  function onSubmit(event) {
    event.preventDefault();
    setIsLoading(true);

    socket.timeout(5000).emit('useridInput', value, () => {
      setIsLoading(false);
    });
  }

  return (
    <form onSubmit={ onSubmit }>
      <input placeholder="your name please" onChange={ e => setValue(e.target.value) } />

      <button type="submit" disabled={ isLoading }>Join</button>
    </form>
  );
}