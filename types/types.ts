export interface User {
  id: number,
  username: string,
  deviceToken?: string,
  platform?: string,
}

export interface UsersData {
  users: Array<User>,
  setUsers: (data: Array<User>) => void
}

export interface Notification {
  uuid: string
  caller: string,
  callee: string,
}

export interface NotificationData {
  uuid: string,
  caller: string,
  deviceToken: string,
  iosBundle: string,
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
