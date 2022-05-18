export interface User {
  id: number;
  username: string;
  webrtcToken?: string;
  deviceToken?: string;
  platform?: string;
}

export interface UsersData {
  users: Array<User>;
  setUsers: (data: Array<User>) => void;
}

export interface Notification {
  uuid: string;
  caller: string;
  callee: string;
  webrtc_ready?: boolean;
}

export interface NotificationData {
  uuid: string;
  caller?: string;
  callee?: string;
  deviceToken: string;
  bundle: string;
  webrtc_ready?: boolean;
}

export interface NotificationDataAndroid {
  to: string;
  data:{
    channel_id: string;
    title: string;
    body: string;
    callee: string;
    uuid: string;
  };
  priority: string;
  topic: string;
  time_to_live: number;
}

export interface WebRTCToken {
  registerClientId: string;
  tokenLifeTime: number; //time(ms)
  enableIncomingCall: boolean;
  callClientRange: string;
  cloudRegionId: string;
  cloudUsername: string;
  apiAccessKey: string;
}
