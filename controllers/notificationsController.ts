import { Request, Response } from 'express';
import {
  sendCallNotificationAndroid,
  sendCallNotificationIos,
  sendNotificationAndroid,
  sendNotificationIos,
} from '../middleware/notificationHandler';
import type { UsersData, User, Notification } from '../types/types';

import { NOTIFICATIONS } from '../constants.dev';
import { connectDb, getUser } from '../middleware/dbHandler';
import { platform } from 'os';

export const newCallNotification = async (
  req: Request,
  res: Response
): Promise<any> => {
  console.log('newCallNotification', req.body);

  const notification: Notification = {
    uuid: req.body.uuid,
    caller: req.body.caller,
    callee: req.body.callee,
  };

  if (!notification.uuid || !notification.caller || !notification.callee) {
    return res
      .status(400)
      .json({ message: 'uuid, caller and callee are required' });
  }

  const db = connectDb();
  const callee: User | undefined = await getUser(db, notification.callee)
    .then(data => {
      return data
    })
    .catch(err => {
      console.error(err);
      return err
    });

  db.close(); //closing connection

  if (!callee || !callee.fcmDeviceToken || (callee.platform === 'ios' && !callee.iosDeviceToken)) {
    return res
      .status(400)
      .json({ message: `callee ${notification.callee} is not registered` });
  }

  let notificationResponse;
  switch (callee.platform) {
    case 'ios':
      // if (!callee.iosDeviceToken) {
      //   return res
      //     .status(400)
      //     .json({ message: `callee ${notification.callee} is not registered` });
      // }
      notificationResponse = await sendCallNotificationIos({
        uuid: notification.uuid,
        caller: notification.caller,
        iosDeviceToken: callee.iosDeviceToken,
        bundle: NOTIFICATIONS.IOS_BUNDLE,
      });
      break;
    case 'android':
      console.log('Android');
      notificationResponse = await sendCallNotificationAndroid({
        uuid: notification.uuid,
        caller: notification.caller,
        fcmDeviceToken: callee.fcmDeviceToken,
        bundle: NOTIFICATIONS.IOS_BUNDLE,
      });
      break;
    default:
      // call is not ios or android, must be web browser
      // TODO deal with webBrowser option
      return res.status(200).json({ message: 'calling_web_interface' });
  }

  // TODO sort out when it is success and when not
  if (notificationResponse === 'success') {
    res.status(200).json({ message: notificationResponse });
  } else {
    res.status(400).json({ message: notificationResponse });
  }
};

export const newNotification = async (
  req: Request,
  res: Response
): Promise<any> => {
  console.log('newNotification', req.body);

  const notification: Notification = {
    uuid: req.body.uuid,
    caller: req.body.caller,
    callee: req.body.callee,
    webrtc_ready: req.body.webrtc_ready,
  };
  if (!notification.uuid || !notification.caller || !notification.callee) {
    return res
      .status(400)
      .json({ message: 'uuid, caller and callee are required' });
  }

  const db = connectDb();
  const caller: User | undefined = await getUser(db, notification.caller)
    .then(data => {
      return data
    })
    .catch(err => {
      console.error(err);
      return err
    });

  db.close(); //closing connection
  
  if (!caller || !caller.fcmDeviceToken) {
    return res
      .status(400)
      .json({ message: `caller ${notification.caller} is not registered` });
  }

  let notificationResponse;
  switch (caller.platform) {
    case 'ios':
      console.log('ios');
      notificationResponse = await sendNotificationIos({
        uuid: notification.uuid,
        callee: notification.callee,
        fcmDeviceToken: caller.fcmDeviceToken,
        bundle: NOTIFICATIONS.ANDROID_BUNDLE,
        webrtc_ready: notification.webrtc_ready,
      });
      break;
    case 'android':
      console.log('Android');
      notificationResponse = await sendNotificationAndroid({
        uuid: notification.uuid,
        callee: notification.callee,
        fcmDeviceToken: caller.fcmDeviceToken,
        bundle: NOTIFICATIONS.ANDROID_BUNDLE,
        webrtc_ready: notification.webrtc_ready,
      });
      break;
    default:
      // call is not ios or android, must be web browser
      // TODO deal with webBrowser option
      return res.status(200).json({ message: 'calling_web_interface' });
  }

  // TODO sort out when it is success and when not
  if (notificationResponse === 'success') {
    res.status(200).json({ message: notificationResponse });
    // } else {
    //   res.status(400).json({'message': notificationResponse});
  }
};
