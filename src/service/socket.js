import { io } from 'socket.io-client';
import { BASE_URL } from './api';

let socket = null;

export const getSocket = () => {
    if (!socket) {
        socket = io(BASE_URL, {
            autoConnect: false,
        });
    }
    return socket;
};

export const connectSocket = () => {
    const s = getSocket();
    if (!s.connected) {
        s.connect();
    }
    return s;
};

export const disconnectSocket = () => {
    if (socket && socket.connected) {
        socket.disconnect();
    }
};
