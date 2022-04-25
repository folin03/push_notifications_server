import { Request, Response } from "express";
import { updateUsersModel } from "../middleware/manageFile";
import type { UsersData, User } from "../types/usersTypes";

const data: UsersData = {
  users: require('../model/users.json'),
  setUsers: function(data) {this.users = data}
}

export const newNotification = (req: Request, res: Response) => {
  const newUser: User = {
    id: data.users?.length ? data.users[data.users.length - 1].id + 1 : 1,
    firstname: req.body.firstname,
    lastname: req.body.lastname
  }

  if (!newUser.firstname || ! newUser.lastname) {
    return res.status(400).json({ 'message': 'firstname and lastname are required'});
  }

  data.setUsers([...data.users, newUser]);
  updateUsersModel(data.users);
  res.status(201).json(data.users);
}
