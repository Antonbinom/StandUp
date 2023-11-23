import { sendData, sendError } from "./send.js";

export async function handleComedianRequest(req, res, comedians, segments) {

  if (segments.length === 2) {
    const comedian = comedians.find(c => c.id === segments[1]);

    if (!comedian) {
      sendError(res, 404, 'Comedian not found!');
      return;
    }

    sendData(res, comedian);
    return;
  }
  sendData(res, comedians)
}