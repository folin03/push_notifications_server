import * as http2 from "http2";
import fs from 'fs';
import path from "path";
import * as apn from 'apn';
import type { NotificationData } from "../types/types";

export const sendNotification = (data: NotificationData): string => {
  let myCert = fs.readFileSync(path.join(__dirname , '..', 'certificates', 'VOIP.pem'), "utf8")
  let myKey = fs.readFileSync(path.join(__dirname , '..', 'certificates', 'VOIP.pem'), "utf8")
    .replace(/(.|\n)+?(?=-----BEGIN PRIVATE KEY-----)/, '')
    .trim();

  var service = new apn.Provider({
      cert: myCert,
      key: myKey
  });

  var note = new apn.Notification();
    note.id = data.uuid;
    note.payload = {"uuid": data.uuid, "callerName": data.caller, "handle": data.caller};
    note.topic = data.iosBundle;

  service.send(note, data.deviceToken)
  .then((result: any) => {
    if (JSON.stringify(result.sent).length > 4) {
      console.log('notification sent');
      // let the phone know that notification has been sent
    } else {
      console.log('notification not sent');
    }
    console.log(JSON.stringify(result));
    return JSON.stringify(result);
  });
  return JSON.stringify('result');
}

// curl -v
//  --header "apns-topic: org.reactjs.native.example.AculabCallNotificationsExample.voip"
//  --header "apns-push-type: voip"
//  --header "apns-id: 123e4567-e89b-12d3-a456-4266554400a0"
//  --cert VOIP.pem:password
//  --data '{"uuid":"123e4567-e89b-12d3-a456-4266554400a0", "callerName":"test", "handle":"some handle"}'
//  --http2  https://api.sandbox.push.apple.com/3/device/6692c0f82ae82dd2f10c5cf2091ae53e3f0802afbae22491d4588cc1bb9dae0e
