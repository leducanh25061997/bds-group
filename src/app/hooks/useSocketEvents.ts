import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { EventSocketListen } from 'types/Enum';

export interface EventSocket {
  name: EventSocketListen;
  handler(...args: any[]): any;
}

const useSocketEvents = (events: EventSocket[]) => {
  const socket = io(
    process.env.REACT_APP_SOCKET_URL ?? 'ws://14.238.85.117:3006',
  );

  useEffect(() => {
    for (const event of events) {
      socket.on(event.name, event.handler);
    }

    return () => {
      for (const event of events) {
        socket.off(event.name);
      }
      socket.removeAllListeners();
    };
  }, []);
};

export default useSocketEvents;
