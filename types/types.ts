export interface User {
  id: number,
  username: string,
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
