import base64 from 'base-64';
import fetch from 'node-fetch';
import type { WebRTCToken } from "../types/types";


/**
 * Get WebRTC token for registration.\
 * The token has limited lifetime, it can be refreshed by calling .enableIncoming(token) on AculabCloudClient object.
 * @param {WebRTCToken} webRTCToken - A WebRTCToken object
 * @returns {string} WebRTC Token string
 */
export const getToken = async (webRTCToken: WebRTCToken): Promise<string | void> => {
  let url =
    `https://ws-${webRTCToken.cloudRegionId}` +
    `.aculabcloud.net/webrtc_generate_token?client_id=${webRTCToken.registerClientId}` +
    `&ttl=${webRTCToken.tokenLifeTime}` +
    `&enable_incoming=${webRTCToken.enableIncomingCall}` +
    `&call_client=${webRTCToken.callClientRange}`;
  let username = `${webRTCToken.cloudRegionId}/${webRTCToken.cloudUsername}`;
  var regToken = fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + base64.encode(`${username}:${webRTCToken.apiAccessKey}`),
    },
  })
    .then((response) => {
      var stuff = response.json();
      return stuff;
    })
    .then((token) => {
      return String((token as any).token);
    })
    .catch((error) => {
      console.error('[ getToken ]', error)
    });
  return regToken;
};
