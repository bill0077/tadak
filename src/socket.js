import { io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
// const URL = process.env.NODE_ENV === 'production' ? undefined : process.env.REACT_APP_SERVER_ADDRESS;
const URL = process.env.REACT_APP_SERVER_ADDRESS;

export const socket = io(URL);