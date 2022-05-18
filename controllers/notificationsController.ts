import { Request, Response } from "express";
import { sendCallNotificationAndroid, sendCallNotificationIos, sendNotificationAndroid } from "../middleware/notificationHandler";
import type { UsersData, User, Notification } from "../types/types";

import { NOTIFICATIONS } from "../constants.dev";

const userData: UsersData = {
  users: require('../model/users.json'),
  setUsers: function(data) {this.users = data}
}

export const newCallNotification = async (req: Request, res: Response): Promise<any> => {
  console.log('newCallNotification', req.body);
  const callee: User | undefined = userData.users.find((user: User) => user.username === req.body.callee);
  const notification: Notification = {
    uuid: req.body.uuid,
    caller: req.body.caller,
    callee: req.body.callee,
  }

  if (!notification.uuid || !notification.caller || ! notification.callee) {
    return res.status(400).json({ 'message': 'uuid, caller and callee are required'});
  }
  if (!callee || !callee.deviceToken) {
    return res.status(400).json({'message': `callee ${req.body.callee} is not registered`});
  }

  let notificationResponse;
  switch(callee.platform) {
    case 'ios':
      notificationResponse = await sendCallNotificationIos({
        uuid: notification.uuid,
        caller: notification.caller,
        deviceToken: callee.deviceToken,
        bundle: NOTIFICATIONS.IOS_BUNDLE,
      });
      break;
    case 'android':
      console.log('Android');
      notificationResponse = await sendCallNotificationAndroid({
        uuid: notification.uuid,
        caller: notification.caller,
        deviceToken: callee.deviceToken,
        bundle: NOTIFICATIONS.IOS_BUNDLE,
      });
      break;
    default:
      // call is not ios or android, must be web browser
      // TODO deal with webBrowser option
      return res.status(200).json({'message': 'calling_web_interface'});
  }
  
  if (notificationResponse === 'success') {
    res.status(200).json({'message': notificationResponse});
  } else {
    res.status(400).json({'message': notificationResponse});
  }
}

export const newNotification = async (req: Request, res: Response): Promise<any> => {
  console.log('newNotification', req.body);
  const caller: User | undefined = userData.users.find((user: User) => user.username === req.body.caller);
  const notification: Notification = {
    uuid: req.body.uuid,
    caller: req.body.caller,
    callee: req.body.callee,
    webrtc_ready: req.body.webrtc_ready
  }

  if (!notification.uuid || !notification.caller || ! notification.callee) {
    return res.status(400).json({ 'message': 'uuid, caller and callee are required'});
  }
  if (!caller || !caller.deviceToken) {
    return res.status(400).json({'message': `callee ${req.body.callee} is not registered`});
  }

  let notificationResponse;
  switch(caller.platform) {
    case 'ios':
      console.log('ios');
      // notificationResponse = await sendNotificationIos({
      //   uuid: notification.uuid,
      //   caller: notification.caller,
      //   deviceToken: callee.deviceToken,
      //   iosBundle: NOTIFICATIONS.IOS_BUNDLE,
      // });
      break;
    case 'android':
      console.log('Android');
      notificationResponse = await sendNotificationAndroid({
        uuid: notification.uuid,
        callee: notification.callee,
        deviceToken: caller.deviceToken,
        bundle: NOTIFICATIONS.ANDROID_BUNDLE,
        webrtc_ready: notification.webrtc_ready
      });
      break;
    default:
      // call is not ios or android, must be web browser
      // TODO deal with webBrowser option
      return res.status(200).json({'message': 'calling_web_interface'});
  }
  
  if (notificationResponse === 'success') {
    res.status(200).json({'message': notificationResponse});
  } else {
    res.status(400).json({'message': notificationResponse});
  }
}