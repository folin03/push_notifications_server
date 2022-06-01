import * as http2 from 'http2';
import fs from 'fs';
import path from 'path';
import * as apn from 'apn';
import type { NotificationData, NotificationDataAndroid } from '../types/types';
import { NOTIFICATIONS } from '../constants.dev';
import axios from 'axios';

const ANDROID_URL = 'https://fcm.googleapis.com/fcm/send';

export const sendCallNotificationIos = async (
  data: NotificationData
): Promise<any> => {
  const myCert = fs.readFileSync(
    path.join(__dirname, '..', 'certificates', 'VOIP.pem'),
    'utf8'
  );
  const myKey = fs
    .readFileSync(
      path.join(__dirname, '..', 'certificates', 'VOIP.pem'),
      'utf8'
    )
    .replace(/(.|\n)+?(?=-----BEGIN PRIVATE KEY-----)/, '')
    .trim();

  const service = new apn.Provider({
    cert: myCert,
    key: myKey,
  });

  const note = new apn.Notification({
    id: data.uuid,
    payload: {
      uuid: data.uuid,
      callerName: data.caller,
      handle: data.caller,
    },
    topic: data.bundle,
  });
  

  const response = service
    .send(note, data.iosDeviceToken as string)
    .then((result: any) => {
      if (JSON.stringify(result.sent).length > 4) {
        console.log('notification sent');
        // let the phone know that notification has been sent
        return 'success';
      } else {
        console.log('notification not sent', result);
        return 'fail';
      }
    });
  service.shutdown();
  return response;
};

export const sendCallNotificationAndroid = async (
  data: NotificationData
): Promise<any> => {
  const response = axios({
    method: 'post',
    url: ANDROID_URL,
    headers: {
      'Accept': '*/*',
      'Content-Type': 'application/json',
      'topic': data.bundle,
      'Authorization': `key=${NOTIFICATIONS.ANDROID_KEY}`,
    },
    data: {
      to: data.fcmDeviceToken,
      data: {
        channel_id: 'acu_incoming_call',
        title: 'Incoming Call',
        body: data.caller,
        uuid: data.uuid,
      },
      priority: 'high',
      topic: 'all',
      time_to_live: 0,
    },
  })
    .then((res) => {
      console.log('[ sendNotification ] data:', res.data);
      return res.data;
    })
    .catch((error) => {
      console.error('[ sendNotification ] error:', error);
    });
  return response;
};

export const sendNotificationIos = async (
  data: NotificationData
): Promise<any> => {
  const response = axios({
    method: 'post',
    url: ANDROID_URL,
    headers: {
      'Accept': '*/*',
      'Content-Type': 'application/json',
      'topic': data.bundle,
      'Authorization': `key=${NOTIFICATIONS.ANDROID_KEY}`,
    },
    data: {
      to: data.fcmDeviceToken,
      data: {
        title: 'Notification',
        body: data.callee,
        uuid: data.uuid,
        webrtc_ready: data.webrtc_ready,
      },
      content_available: true,
      topic: 'all',
      time_to_live: 0,
    },
  })
    .then((res) => {
      console.log('[ sendNotification ] data:', res.data);
      return res.data;
    })
    .catch((error) => {
      console.error('[ sendNotification ] error:', error);
    });
  return response;
};

export const sendNotificationAndroid = async (
  data: NotificationData
): Promise<any> => {
  const response = axios({
    method: 'post',
    url: ANDROID_URL,
    headers: {
      'Accept': '*/*',
      'Content-Type': 'application/json',
      'topic': data.bundle,
      'Authorization': `key=${NOTIFICATIONS.ANDROID_KEY}`,
    },
    data: {
      to: data.fcmDeviceToken,
      data: {
        title: 'Notification',
        body: data.callee,
        uuid: data.uuid,
        webrtc_ready: data.webrtc_ready,
      },
      priority: 'high',
      topic: 'all',
      time_to_live: 0,
    },
  })
    .then((res) => {
      console.log('[ sendNotification ] data:', res.data);
      return res.data;
    })
    .catch((error) => {
      console.error('[ sendNotification ] error:', error);
    });
  return response;
};

// inspirational code
// curl -v
//  --header "apns-topic: org.reactjs.native.example.AculabCallNExample.voip"
//  --header "apns-push-type: voip"
//  --header "apns-id: 123e4567-e89b-12d3-a456-4266554400a0"
//  --cert VOIP.pem:password
//  --data '{"uuid":"123e4567-e89b-12d3-a456-4266554400a0", "callerName":"test", "handle":"some handle"}'
//  --http2  https://api.sandbox.push.apple.com/3/device/6692c0f82ae82dd2f10c5cf2091ae53e3f0802afbae22491d4588cc1bb9dae0a
