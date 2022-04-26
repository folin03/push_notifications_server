import { Request, Response } from "express";
import { updateUsersModel } from "../middleware/manageFile";
import type { UsersData, User } from "../types/types";

const data: UsersData = {
  users: require('../model/users.json'),
  setUsers: function(data) {this.users = data}
}

export const getAllUsers = (req: Request, res: Response) => {
  res.json(data.users);
}

export const getUser = (req: Request, res: Response) => {
  const existingUser = data.users.find((user: User) => user.id === parseInt(req.params.id));
  if (!existingUser) {
    return res.status(400).json({'message': `User ID ${req.body.id} not found`});
  }
  res.json(existingUser);
}

export const createNewUser = (req: Request, res: Response) => {
  const newUser: User = {
    id: data.users?.length ? data.users[data.users.length - 1].id + 1 : 1,
    username: req.body.username,
  }

  if (!req.body.username) {
    return res.status(400).json({ 'message': 'username is required'});
  }

  data.setUsers([...data.users, newUser]);
  updateUsersModel(data.users);
  res.status(201).json(data.users);
}

export const updateUser = (req: Request, res: Response) => {
  const existingUser = data.users.find((user: User) => user.id === parseInt(req.body.id));
  if (!existingUser) {
    return res.status(400).json({'message': `User ID ${req.body.id} not found`});
  }
  if (req.body.username) existingUser.username = req.body.username;
  const filteredArray = data.users.filter((user: User) => user.id !== parseInt(req.body.id)); // takes out user with old data
  const unsortedArray = [...filteredArray, existingUser]; // adds filtered users + new user to data
  data.setUsers(unsortedArray.sort((a, b) => a.id > b.id ? 1 : a.id < b.id ? -1 : 0));
  updateUsersModel(data.users);
  res.json(data.users);
}

export const deleteUser = (req: Request, res: Response) => {
  const existingUser = data.users.find((user: User) => user.id === parseInt(req.params.id));
  if (!existingUser) {
    return res.status(400).json({'message': `User ID ${req.body.id} not found`});
  }
  console.log(existingUser);
  const filteredArray = data.users.filter((user: User) => user.id !== parseInt(req.params.id)); // takes out user with old data
  data.setUsers([...filteredArray]); // adds users to data
  console.log(existingUser);
  updateUsersModel(data.users);
  res.json(data.users);
}
