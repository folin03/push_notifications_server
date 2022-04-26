import { Request, Response } from "express";
import { updateUsersModel } from "../middleware/manageFile";
import { sendNotification } from "../middleware/notificationHandler";
import type { UsersData, User, Notification } from "../types/types";

const userData: UsersData = {
  users: require('../model/users.json'),
  setUsers: function(data) {this.users = data}
}

export const newNotification = (req: Request, res: Response) => {
  const callee: User | undefined = userData.users.find((user: User) => user.username === req.body.callee);
  const notification: Notification = {
    uuid: req.body.uuid,
    caller: req.body.caller,
    callee: req.body.callee
  }

  if (!notification.uuid || !notification.caller || ! notification.callee) {
    return res.status(400).json({ 'message': 'uuid, caller and callee are required'});
  }
  if (!callee) {
    return res.status(400).json({'message': `User ${req.body.callee} is not registered`});
  }
  let notSent = sendNotification({
    uuid: notification.uuid,
    caller: notification.caller,
    deviceToken: '7026dd6952a4e49e609458c5f81db97c48e0838322a37771fd186cfe1d06487f',
    iosBundle: 'org.reactjs.native.example.AculabCallNotificationsExample.voip'
  });

  // userData.setUsers([...userData.users]);
  console.log(notSent);
  res.status(201).json(notSent);
}
