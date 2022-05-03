import { Request, Response } from "express";
import { updateUsersModel } from "../middleware/manageFile";
import { sendNotification } from "../middleware/notificationHandler";
import type { UsersData, User, Notification } from "../types/types";

import { NOTIFICATIONS } from "../constants.dev";

const userData: UsersData = {
  users: require('../model/users.json'),
  setUsers: function(data) {this.users = data}
}

export const newNotification = async (req: Request, res: Response): Promise<any> => {
  const callee: User | undefined = userData.users.find((user: User) => user.username === req.body.callee);
  const notification: Notification = {
    uuid: req.body.uuid,
    caller: req.body.caller,
    callee: req.body.callee
  }

  if (!notification.uuid || !notification.caller || ! notification.callee) {
    return res.status(400).json({ 'message': 'uuid, caller and callee are required'});
  }
  if (!callee || !callee.deviceToken) {
    return res.status(400).json({'message': `User ${req.body.callee} is not registered`});
  }

  let notificationResponse;
  switch(callee.platform) {
    case 'ios':
      notificationResponse = await sendNotification({
        uuid: notification.uuid,
        caller: notification.caller,
        deviceToken: callee.deviceToken,
        iosBundle: NOTIFICATIONS.IOS_BUNDLE
      });
      break;
    case 'android':
      // TODO send android notification here
      console.log('Android');
      break;
    default:
      // call is not ios or android, must be web browser
      // TODO deal with webBrowser option
      return res.status(400).json({'message': `User ${req.body.callee} does't use iOS nor Android device`});
  }

  // console.log(JSON.stringify(notificationResponse));
  
  if (notificationResponse === 'success') {
    res.status(200).json({'message': notificationResponse});
  } else {
    res.status(400).json({'message': notificationResponse});
  }
}
