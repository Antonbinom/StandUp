import fs from 'node:fs/promises';
import { sendData, sendError } from "./send.js";

export async function handleGetClient(req, res, path, ticket) {
  try {
    const clientData = await fs.readFile(path, 'utf8');
    const clients = JSON.parse(clientData);

    const client = clients.find(c => c.ticket === ticket);

    if (!client) {
      sendError(res, 404, 'This ticket number does not exist');
      return;
    }

    sendData(res, client);
  } catch (error) {
    console.log('Request reading error');
    sendError(res, 500, 'Server error on request data')
  }

}