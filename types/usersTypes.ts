export interface User {
  id: number,
  firstname: string,
  lastname: string
}

export interface UsersData {
  users: Array<User>,
  setUsers: (data: Array<User>) => void
}