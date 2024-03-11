import React, { useState, useEffect } from 'react';
import { SubmitChat } from './SubmitChat'
import { socket } from '../socket';

export function GlobalChatWindow() {
  const [message, setMessage] = useState([]);

  useEffect(() => {
    function onMsgRecieved(value) {
      setMessage(previous => [...previous, value]);
    }

    socket.on('msgRecieved', onMsgRecieved);

    return () => {
      socket.off('msgRecieved', onMsgRecieved);
    };
  });

  return (
    <>
      <ul>
        {
          message.map((event, index) =>
            <li key={ index }>{ event.userid }: { event.data }</li>
          )
        }
      </ul>
      <SubmitChat />
    </>
  );
}