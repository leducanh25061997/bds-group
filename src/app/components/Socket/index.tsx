import { DefaultEventsMap } from '@socket.io/component-emitter';
import { useProfile } from 'app/hooks';
import { useEffect, memo } from 'react';
import { io, Socket } from 'socket.io-client';
import { EventSocketListen } from 'types/Enum';

export interface EventSocket {
  name: EventSocketListen;
  handler(...args: any[]): any;
}

interface SocketManagerProps {
  events: EventSocket[];
}

let _socket: Socket<DefaultEventsMap, DefaultEventsMap>;
let initedSocket = false;
export const socketClose = () => {
  if (_socket) {
    _socket.disconnect();
    _socket.close();
    initedSocket = false;
  }
};
const socketInitStaffId = (staffId: string) => {
  if (!initedSocket && _socket?.connected) {
    _socket.emit('events', { staffId });
    initedSocket = true;
  }
};

const SocketManager = (props: SocketManagerProps) => {
  const userInfo = useProfile();

  if (!_socket?.connected) {
    if (_socket) socketClose();
    _socket = io(process.env.REACT_APP_SOCKET_URL ?? 'ws://14.238.85.117:3006');
    _socket.connect();
    _socket.on('connect', () => {
      if (userInfo?.staffId) {
        socketInitStaffId(userInfo?.staffId);
      }
    });
    _socket.on('disconnect', () => {
      initedSocket = false;
    });
  }

  useEffect(() => {
    if (userInfo?.staffId) {
      socketInitStaffId(userInfo?.staffId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo?.staffId]);

  useEffect(() => {
    for (const event of props.events) {
      _socket.on(event.name, event.handler);
    }
    return () => {
      for (const event of props.events) {
        _socket.off(event.name);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.events]);

  return <></>;
};

export default memo(SocketManager);
