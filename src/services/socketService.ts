import io from 'socket.io-client';
// import type { Socket } from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

class SocketService {
  public socket: ReturnType<typeof io> | null = null;

  connect(token?: string) {
    this.socket = io(SOCKET_URL, {
      auth: token ? { token } : {},
    });
  }

  joinRoom(roomId: string) {
    this.socket?.emit('joinRoom', roomId);
  }

  sendMessage(data: { roomId: string; message: string; userId?: string; userName?: string }) {
    this.socket?.emit('chatMessage', data);
  }

  onMessage(callback: (data: any) => void) {
    this.socket?.on('chatMessage', callback);
  }

  onTyping(callback: (userName: string) => void) {
    this.socket?.on('typing', callback);
  }

  sendTyping(roomId: string, userName: string) {
    this.socket?.emit('typing', roomId, userName);
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
  }
}

export const socketService = new SocketService();
