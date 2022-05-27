import { Request, Response } from 'express';
import { updateUsersModel } from '../middleware/manageFile';
import { getToken } from '../middleware/userRegistration';
import type { UsersData, User } from '../types/types';

import { WEBRTC_REGISTRATION } from '../constants.dev';

const data: UsersData = {
  users: require('../model/users.json'),
  setUsers: function (data) {
    this.users = data;
  },
};

export const getAllUsers = (req: Request, res: Response) => {
  res.json(data.users);
};

export const getUser = (req: Request, res: Response) => {
  const existingUser = data.users.find(
    (user: User) => user.id === parseInt(req.params.id)
  );
  if (!existingUser) {
    return res
      .status(400)
      .json({ message: `User ID ${req.params.id} not found` });
  }
  res.json(existingUser);
};

export const getUserToken = async (req: Request, res: Response) => {
  const existingUser = data.users.find(
    (user: User) => user.username === req.body.username
  );
  if (!existingUser) {
    return res
      .status(400)
      .json({ message: `Username ${req.body.username} not found` });
  }
  let token = await getToken({
    registerClientId: existingUser.username,
    tokenLifeTime: WEBRTC_REGISTRATION.TOKEN_LIFE_TIME, //time(ms)
    enableIncomingCall: WEBRTC_REGISTRATION.ENABLE_INCOMING_CALL,
    callClientRange: WEBRTC_REGISTRATION.CALL_CLIENT_RANGE,
    cloudRegionId: WEBRTC_REGISTRATION.CLOUD_REGION_ID,
    cloudUsername: WEBRTC_REGISTRATION.CLOUD_USER_NAME,
    apiAccessKey: WEBRTC_REGISTRATION.API_ACCESS_KEY,
  });

  if (token) {
    existingUser.webrtcToken = token;
    const filteredArray = data.users.filter(
      (user: User) => user.username !== req.body.username
    ); // takes out user with old data
    const unsortedArray = [...filteredArray, existingUser]; // adds filtered users + new user to data
    data.setUsers(
      unsortedArray.sort((a, b) => (a.id > b.id ? 1 : a.id < b.id ? -1 : 0))
    );
    updateUsersModel(data.users);

    return res.status(200).json({
      username: existingUser.username,
      webrtcToken: token,
      webrtcAccessKey: WEBRTC_REGISTRATION.WEBRTC_ACCESS_KEY,
      cloudRegionId: WEBRTC_REGISTRATION.CLOUD_REGION_ID,
      logLevel: WEBRTC_REGISTRATION.LOG_LEVEL,
    });
  }
  return res.status(400).json({ message: 'could not obtain webRTC token' });
};

export const createNewUser = async (req: Request, res: Response) => {
  const existingUser = data.users.find(
    (user: User) => user.username === req.body.username
  );

  if (existingUser) {
    return res.status(400).json({ message: 'username already exists' });
  }

  const newUser: User = {
    id: data.users?.length ? data.users[data.users.length - 1].id + 1 : 1,
    username: req.body.username,
    fcmDeviceToken: req.body.fcmDeviceToken,
    iosDeviceToken: req.body.iosDeviceToken,
    platform: req.body.platform,
  };

  if (!req.body.username) {
    return res.status(400).json({ message: 'username is required' });
  }
  let token = await getToken({
    registerClientId: newUser.username,
    tokenLifeTime: WEBRTC_REGISTRATION.TOKEN_LIFE_TIME,
    enableIncomingCall: WEBRTC_REGISTRATION.ENABLE_INCOMING_CALL,
    callClientRange: WEBRTC_REGISTRATION.CALL_CLIENT_RANGE,
    cloudRegionId: WEBRTC_REGISTRATION.CLOUD_REGION_ID,
    cloudUsername: WEBRTC_REGISTRATION.CLOUD_USER_NAME,
    apiAccessKey: WEBRTC_REGISTRATION.API_ACCESS_KEY,
  });

  if (token) {
    newUser.webrtcToken = token;
    data.setUsers([...data.users, newUser]);
    updateUsersModel(data.users ? data.users : []);
    res.status(201).json({
      id: newUser.id,
      username: newUser.username,
      webrtcToken: token,
      webrtcAccessKey: WEBRTC_REGISTRATION.WEBRTC_ACCESS_KEY,
      cloudRegionId: WEBRTC_REGISTRATION.CLOUD_REGION_ID,
      logLevel: WEBRTC_REGISTRATION.LOG_LEVEL,
    });
  } else {
    res
      .status(400)
      .json({
        message: 'User was not created - could not obtain webRTC token',
      });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const existingUser = data.users.find(
    (user: User) => user.username === req.body.username
  );
  if (!existingUser) {
    return res
      .status(400)
      .json({ message: `Username ${req.body.username} not found` });
  }
  if (!req.body.webrtcToken) {
    return res.status(400).json({ message: `webrtcToken is required` });
  }
  if (existingUser.webrtcToken === req.body.webrtcToken) {
    if (req.body.username) existingUser.username = req.body.username;
    if (req.body.fcmDeviceToken)
      existingUser.fcmDeviceToken = req.body.fcmDeviceToken;
    if (req.body.iosDeviceToken)
      existingUser.iosDeviceToken = req.body.iosDeviceToken;
    if (req.body.platform) existingUser.platform = req.body.platform;
    const filteredArray = data.users.filter(
      (user: User) => user.username !== req.body.username
    ); // takes out user with old data
    const unsortedArray = [...filteredArray, existingUser]; // adds filtered users + new user to data
    data.setUsers(
      unsortedArray.sort((a, b) => (a.id > b.id ? 1 : a.id < b.id ? -1 : 0))
    );
    updateUsersModel(data.users);
    res.json(existingUser);
  } else {
    return res
      .status(400)
      .json({ message: 'user does not match with the server record' });
  }
};

export const deleteUser = (req: Request, res: Response) => {
  const existingUser = data.users.find(
    (user: User) => user.username === req.body.username
  );
  if (!existingUser) {
    return res
      .status(400)
      .json({ message: `Username ${req.body.username} not found` });
  }
  const filteredArray = data.users.filter(
    (user: User) => user.username !== req.body.username
  ); // takes out user with old data
  data.setUsers([...filteredArray]); // adds users to data
  updateUsersModel(data.users);
  res.json(data.users);
};
