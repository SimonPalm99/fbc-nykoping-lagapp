/**
 * WebSocket service for real-time features
 * Handles real-time notifications, chat, live updates etc.
 */

export interface WebSocketMessage {
  type: string;
  payload: any;
  timestamp: number;
  id?: string;
}

export interface WebSocketOptions {
  url: string;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  heartbeatInterval?: number;
  protocols?: string[];
}

export type WebSocketEventType = 
  | 'notification'
  | 'chat_message'
  | 'activity_update'
  | 'user_status'
  | 'fine_update'
  | 'forum_update'
  | 'league_update'
  | 'training_update';

export interface WebSocketListener {
  (message: WebSocketMessage): void;
}

class WebSocketService {
  private ws: WebSocket | null = null;
  private listeners = new Map<string, Set<WebSocketListener>>();
  private reconnectAttempts = 0;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private heartbeatTimer: NodeJS.Timeout | null = null;
  private isConnecting = false;
  private isManuallyDisconnected = false;

  constructor(private options: WebSocketOptions) {
    this.options = {
      reconnectInterval: 5000,
      maxReconnectAttempts: 10,
      heartbeatInterval: 30000,
      ...options
    };
  }

  /**
   * Connect to WebSocket server
   */
  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        resolve();
        return;
      }

      if (this.isConnecting) {
        return;
      }

      this.isConnecting = true;
      this.isManuallyDisconnected = false;

      try {
        this.ws = new WebSocket(this.options.url, this.options.protocols);

        this.ws.onopen = () => {
          console.log('WebSocket connected');
          this.isConnecting = false;
          this.reconnectAttempts = 0;
          this.startHeartbeat();
          resolve();
        };

        this.ws.onmessage = (event) => {
          this.handleMessage(event.data);
        };

        this.ws.onclose = (event) => {
          console.log('WebSocket disconnected:', event.code, event.reason);
          this.isConnecting = false;
          this.stopHeartbeat();
          
          if (!this.isManuallyDisconnected) {
            this.handleReconnect();
          }
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          this.isConnecting = false;
          reject(error);
        };

      } catch (error) {
        this.isConnecting = false;
        reject(error);
      }
    });
  }

  /**
   * Disconnect from WebSocket server
   */
  disconnect(): void {
    this.isManuallyDisconnected = true;
    
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    this.stopHeartbeat();

    if (this.ws) {
      this.ws.close(1000, 'Manual disconnect');
      this.ws = null;
    }
  }

  /**
   * Send message to server
   */
  send(type: string, payload: any): void {
    if (this.ws?.readyState !== WebSocket.OPEN) {
      console.warn('WebSocket not connected, cannot send message');
      return;
    }

    const message: WebSocketMessage = {
      type,
      payload,
      timestamp: Date.now(),
      id: this.generateId()
    };

    try {
      this.ws.send(JSON.stringify(message));
    } catch (error) {
      console.error('Failed to send WebSocket message:', error);
    }
  }

  /**
   * Subscribe to specific message type
   */
  subscribe(type: WebSocketEventType, listener: WebSocketListener): () => void {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    
    this.listeners.get(type)!.add(listener);

    // Return unsubscribe function
    return () => {
      const typeListeners = this.listeners.get(type);
      if (typeListeners) {
        typeListeners.delete(listener);
        if (typeListeners.size === 0) {
          this.listeners.delete(type);
        }
      }
    };
  }

  /**
   * Unsubscribe from specific message type
   */
  unsubscribe(type: WebSocketEventType, listener?: WebSocketListener): void {
    if (!listener) {
      // Remove all listeners for this type
      this.listeners.delete(type);
      return;
    }

    const typeListeners = this.listeners.get(type);
    if (typeListeners) {
      typeListeners.delete(listener);
      if (typeListeners.size === 0) {
        this.listeners.delete(type);
      }
    }
  }

  /**
   * Get connection status
   */
  getConnectionStatus(): 'connecting' | 'open' | 'closed' | 'closing' {
    if (this.isConnecting) return 'connecting';
    
    switch (this.ws?.readyState) {
      case WebSocket.OPEN: return 'open';
      case WebSocket.CONNECTING: return 'connecting';
      case WebSocket.CLOSING: return 'closing';
      case WebSocket.CLOSED:
      default:
        return 'closed';
    }
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  /**
   * Handle incoming messages
   */
  private handleMessage(data: string): void {
    try {
      const message: WebSocketMessage = JSON.parse(data);
      
      // Handle heartbeat response
      if (message.type === 'pong') {
        return;
      }

      // Notify listeners
      const typeListeners = this.listeners.get(message.type as WebSocketEventType);
      if (typeListeners) {
        typeListeners.forEach(listener => {
          try {
            listener(message);
          } catch (error) {
            console.error('WebSocket listener error:', error);
          }
        });
      }

    } catch (error) {
      console.error('Failed to parse WebSocket message:', error);
    }
  }

  /**
   * Handle reconnection logic
   */
  private handleReconnect(): void {
    if (this.reconnectAttempts >= this.options.maxReconnectAttempts!) {
      console.error('Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.options.maxReconnectAttempts})`);

    this.reconnectTimer = setTimeout(() => {
      this.connect().catch(error => {
        console.error('Reconnection failed:', error);
      });
    }, this.options.reconnectInterval);
  }

  /**
   * Start heartbeat to keep connection alive
   */
  private startHeartbeat(): void {
    this.heartbeatTimer = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.send('ping', {});
      }
    }, this.options.heartbeatInterval);
  }

  /**
   * Stop heartbeat
   */
  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  /**
   * Generate unique message ID
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Create default WebSocket service instance
export const wsService = new WebSocketService({
  url: process.env.REACT_APP_WS_URL || 'wss://fbc-backend-chlg.onrender.com/ws'
});

// Convenience functions for common operations
export const webSocketHelpers = {
  /**
   * Subscribe to notifications
   */
  subscribeToNotifications: (callback: (notification: any) => void) => {
    return wsService.subscribe('notification', (message) => {
      callback(message.payload);
    });
  },

  /**
   * Subscribe to chat messages
   */
  subscribeToChatMessages: (callback: (message: any) => void) => {
    return wsService.subscribe('chat_message', (message) => {
      callback(message.payload);
    });
  },

  /**
   * Subscribe to activity updates
   */
  subscribeToActivityUpdates: (callback: (activity: any) => void) => {
    return wsService.subscribe('activity_update', (message) => {
      callback(message.payload);
    });
  },

  /**
   * Subscribe to user status changes
   */
  subscribeToUserStatus: (callback: (status: any) => void) => {
    return wsService.subscribe('user_status', (message) => {
      callback(message.payload);
    });
  },

  /**
   * Send chat message
   */
  sendChatMessage: (roomId: string, message: string) => {
    wsService.send('chat_message', {
      roomId,
      message,
      timestamp: Date.now()
    });
  },

  /**
   * Join chat room
   */
  joinChatRoom: (roomId: string) => {
    wsService.send('join_room', { roomId });
  },

  /**
   * Leave chat room
   */
  leaveChatRoom: (roomId: string) => {
    wsService.send('leave_room', { roomId });
  },

  /**
   * Update user status
   */
  updateUserStatus: (status: 'online' | 'away' | 'busy' | 'offline') => {
    wsService.send('user_status', { status });
  }
};
