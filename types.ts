export enum MessageType {
  REGISTER = 'REGISTER',
  FRAME = 'FRAME',
  UNREGISTER = 'UNREGISTER',
  PING = 'PING'
}

export interface BroadcastMessage {
  type: MessageType;
  id: string;
  payload?: string; // For FRAME, this is the base64 image
  timestamp: number;
}

export interface CameraFeed {
  id: string;
  image: string | null;
  lastSeen: number;
  label: string;
}