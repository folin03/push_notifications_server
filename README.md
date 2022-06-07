# Simple Node server for Push Notifications

This is an example server for react-native-aculab-client package

Using AculabCall component and VoIP Apple notifications and FCM silent notifications.

please note that FCM notifications can be used for call to iOS and Android, however
this example server uses APN for iOS call to demonstrate its use.

## Apple APN

1. Set up VoIP notifications

2. download certificate and make it into VOIP.pem certificate

3. place the certificate to certificates folder

expected VOIP.pem format:

```pem
Bag Attributes
    friendlyName: VoIP Services: ...
    localKeyID: ... 
-----BEGIN CERTIFICATE-----
...
-----END CERTIFICATE-----
Bag Attributes
    friendlyName: ...
    localKeyID: ... 
Key Attributes: <No Attributes>
-----BEGIN PRIVATE KEY-----
...
-----END PRIVATE KEY-----

```

## Aculab and FCM Constants

Store Aculab constants for WebRTC registration and FCM constants for sending silent notifications.

For example this server uses file constants.dev.ts in format (values in this example are fictional)

```ts
// WebRTC constants
const TOKEN_LIFE_TIME = 6000;
const ENABLE_INCOMING_CALL = true;
const CALL_CLIENT_RANGE = '*';
const CLOUD_REGION_ID = '0-2-0';
const CLOUD_USER_NAME = 'charles.new@business.com';
const API_ACCESS_KEY = '_YVDDzhvbzvv8hUEMBybA';
const WEBRTC_ACCESS_KEY = 'heh0zprmk7okgtl90dx9i0odb';
const LOG_LEVEL = 0;

export const WEBRTC_REGISTRATION = {
  TOKEN_LIFE_TIME,
  ENABLE_INCOMING_CALL,
  CALL_CLIENT_RANGE,
  CLOUD_REGION_ID,
  CLOUD_USER_NAME,
  API_ACCESS_KEY,
  WEBRTC_ACCESS_KEY,
  LOG_LEVEL,
};

// Notifications constants
const IOS_BUNDLE =
  'org.reactjs.native.example.AnExample.voip';
const ANDROID_BUNDLE = 'com.example.examplecode.AnExample';
const FCM_KEY =
  'ABBBvP8d37w:APB91bHTQNuFw2KtnKOfgWWzo-ljDcy_obIq8n52aHk0vjhtlZlXQ1haTjYJHZK0-pzfU9kuKP6tPTm1PiVc9J1JHDimqxZVnbCKD2mn6yDXpFaye0VuTMDixJw7AW-bIy4gY-_zzjRH';

export const NOTIFICATIONS = {
  IOS_BUNDLE,
  ANDROID_BUNDLE,
  FCM_KEY,
};
```

## Use the server

install dependencies

```terminal
npm install
```

To run the server use run bellow command from root folder

```terminal
npm run dev
```

## SQLite database

This server uses SQLite database, it requires empty notificationServer.db file in the root folder, the users table is created when the server runs for the first time.

This database registers users and holds platforms tokens.

This Server is for demonstration purposes, however it can be used for production if security measures are put in place
and proper database is set up.

Please be aware that current PK is username

## end points

### /users

GET - returns all users
POST - registers user - platform expected is ios/android/web

request

```json
{
    "username": "user1",
    "platform": "web"
}
```

PUT - updates existing user, used for getting device tokens after registering with Aculab WebRTC.

request (iosDeviceToken only for ios devices)

```json
{
    "username": "user2",
    "platform": "ios",
    "fcmDeviceToken": "FCM_token",
    "iosDeviceToken": "APN_token"
}
```

DELETE - deletes user from db

request

```json
{
    "username": "user1"
}
```

### /users/user

GET - returns user details

request

```json
{
    "username": "user2"
}
```

### users/get_token

POST - refresh WebRTC Token (token is returned)

request

```json
{
    "username": "user2",
    "platform": "ios"
}
```

## Important Notes

You cannot call a user which is not registered on server, therefore if you wanna call a web browser it has to be registered using "platform": "web" and it needs to have "webrtcToken" not null (any string, e.g. "fake_token").

### Testing

Please note that application launched from terminal/Xcode/Android Studio behaves as separate instance from app launched from the phone. For example if you run an app from Xcode, register user with webrtc and that kill the app, calling the user starts an app instance which is not registered with webrtc (uses different storage, therefore the user credentials are not found in the app, however they exist on the server). In this case you can manually delete the user from the server.

Best testing practice is to install the app on the phone and open it on the phone. This way you get the correct behavior.
