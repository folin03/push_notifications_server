import { Request, Response } from "express";
import { updateUsersModel } from "../middleware/manageFile";
import { getToken } from "../middleware/userRegistration";
import type { UsersData, User } from "../types/types";

import { WEBRTC_REGISTRATION } from "../constants.dev";

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

export const createNewUser = async (req: Request, res: Response) => {
  const existingUser = data.users.find((user: User) => user.username === req.body.username);
  
  if (existingUser) {
    return res.status(400).json({'message': 'username already exists'});
  }

  const newUser: User = {
    id: data.users?.length ? data.users[data.users.length - 1].id + 1 : 1,
    username: req.body.username,
    deviceToken: req.body.deviceToken,
    platform: req.body.platform
  }

  if (!req.body.username) {
    return res.status(400).json({ 'message': 'username is required'});
  }
  let token = await getToken({
    registerClientId: newUser.username,
    tokenLifeTime: WEBRTC_REGISTRATION.TOKEN_LIFE_TIME, //time(ms)
    enableIncomingCall: WEBRTC_REGISTRATION.ENABLE_INCOMING_CALL,
    callClientRange: WEBRTC_REGISTRATION.CALL_CLIENT_RANGE,
    cloudRegionId: WEBRTC_REGISTRATION.CLOUD_REGION_ID,
    cloudUsername: WEBRTC_REGISTRATION.CLOUD_USER_NAME,
    apiAccessKey: WEBRTC_REGISTRATION.API_ACCESS_KEY
  })

  // data.setUsers([...data.users, newUser]);
  // updateUsersModel(data.users);
  // res.status(201).json(data.users);
  if (token) {
    data.setUsers([...data.users, newUser]);
    updateUsersModel(data.users ? data.users : []);
    res.status(201).json({
      'user_id': newUser.id,
      'username': newUser.username,
      'webrtc_token': token,
      'webrtc_access_key': WEBRTC_REGISTRATION.WEBRTC_ACCESS_KEY,
      'cloud_region_id': WEBRTC_REGISTRATION.CLOUD_REGION_ID,
      'log_level': WEBRTC_REGISTRATION.LOG_LEVEL
    });
  } else {
    res.status(400).json({'message': 'User was not created - could not obtain webRTC token'});
  }
  
}

export const updateUser = (req: Request, res: Response) => {
  const existingUser = data.users.find((user: User) => user.id === parseInt(req.body.id));
  if (!existingUser) {
    return res.status(400).json({'message': `User ID ${req.body.id} not found`});
  }
  if (req.body.username) existingUser.username = req.body.username;
  if (req.body.deviceToken) existingUser.deviceToken = req.body.deviceToken;
  if (req.body.platform) existingUser.platform = req.body.platform;
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
