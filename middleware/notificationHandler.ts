import * as http2 from "http2";
import fs from 'fs';
import path from "path";
import * as apn from 'apn';
import type { NotificationData, NotificationDataAndroid } from "../types/types";
import { NOTIFICATIONS } from "../constants.dev";
import axios from 'axios'

const ANDROID_URL = 'https://fcm.googleapis.com/fcm/send'

export const sendCallNotificationIos = async (data: NotificationData): Promise<any> => {
  let myCert = fs.readFileSync(path.join(__dirname , '..', 'certificates', 'VOIP.pem'), "utf8")
  let myKey = fs.readFileSync(path.join(__dirname , '..', 'certificates', 'VOIP.pem'), "utf8")
    .replace(/(.|\n)+?(?=-----BEGIN PRIVATE KEY-----)/, '')
    .trim();

  let service = new apn.Provider({
      cert: myCert,
      key: myKey
  });

  let note = new apn.Notification();
    note.id = data.uuid;
    note.payload = {"uuid": data.uuid, "callerName": data.caller, "handle": data.caller};
    note.topic = data.bundle;

  let response = service.send(note, data.iosDeviceToken as string)
  .then((result: any) => {
    if (JSON.stringify(result.sent).length > 4) {
      console.log('notification sent');
      // let the phone know that notification has been sent
      return 'success';
    } else {
      console.log('notification not sent', result);
      return 'fail'
    }
  });
  return (response);
}

// export const sendCallNotificationAndroid = async (data: NotificationData): Promise<any> => {
//   // console.log('[ sendNotification ] Android:', data);
//   const url = ANDROID_URL;
//   const headers = {
//     'Accept': 'application/json',
//     'Content-Type': 'application/json',
//     'topic': 'com.aculab.examplecode.AculabCall',
//     'Authorization': 'key=AAAAvP6d37w:APA91bHTQNoFw2KtnKOfgWWzo-ljDcy_obIq8n52aHk0vjhtlZlXQ1haTqYJHZK0-pzfU9kuKP6tPTm1PiVc9J1JHDimqxZVnbCKD2mn6yDXpFeye0VuTMDixJw7AW-bIy4gY-_zzjHR'
//   };
//   const body = JSON.stringify({
//     to: data.fcmDeviceToken,
//     data:{
//       channel_id: 'acu_incoming_call',
//       title: 'Incoming Call',
//       body: data.caller,
//       uuid: data.uuid
//     },
//     priority: 'high',
//     topic: 'all',
//     time_to_live: 0
//   });

//   const response = fetch(url, {
//     method: 'POST',
//     body: body,
//     headers: headers,
//   })
//     .then((res) => {
//       var blob = res.json();
//       return blob;
//     })
//     .then((data) => {
//       console.log('[ sendNotification ] data:', data);
//       return data;
//     })
//     .catch((error) => {
//       console.error('[ sendNotification ] error:', error);
//     });
//   return response;
// };

export const sendCallNotificationAndroid = async (data: NotificationData): Promise<any> => {
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
      data:{
        channel_id: 'acu_incoming_call',
        title: 'Incoming Call',
        body: data.caller,
        uuid: data.uuid
      },
      priority: 'high',
      topic: 'all',
      time_to_live: 0
    }
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

export const sendNotificationIos = async (data: NotificationData): Promise<any> => {
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
      data:{
        title: 'Notification',
        body: data.callee,
        uuid: data.uuid,
        webrtc_ready: data.webrtc_ready
      },
      "content_available": true,
      topic: 'all',
      time_to_live: 0
    }
  })
  .then((res) => {
    console.log('[ sendNotification ] data:', res.data);
    return res.data;
  })
  .catch((error) => {
    console.error('[ sendNotification ] error:', error);
  });
  return response;
}

export const sendNotificationAndroid = async (data: NotificationData): Promise<any> => {
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
      data:{
        title: 'Notification',
        body: data.callee,
        uuid: data.uuid,
        webrtc_ready: data.webrtc_ready
      },
      priority: 'high',
      topic: 'all',
      time_to_live: 0
    }
  })
  .then((res) => {
    console.log('[ sendNotification ] data:', res.data);
    return res.data;
  })
  .catch((error) => {
    console.error('[ sendNotification ] error:', error);
  });
  return response;
}

// inspirational code
// curl -v
//  --header "apns-topic: org.reactjs.native.example.AculabCallNExample.voip"
//  --header "apns-push-type: voip"
//  --header "apns-id: 123e4567-e89b-12d3-a456-4266554400a0"
//  --cert VOIP.pem:password
//  --data '{"uuid":"123e4567-e89b-12d3-a456-4266554400a0", "callerName":"test", "handle":"some handle"}'
//  --http2  https://api.sandbox.push.apple.com/3/device/6692c0f82ae82dd2f10c5cf2091ae53e3f0802afbae22491d4588cc1bb9dae0a
