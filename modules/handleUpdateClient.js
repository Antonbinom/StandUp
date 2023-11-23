import fs from 'node:fs/promises';
import { sendData, sendError } from "./send.js";

export function handleUpdateClient(req, res, path, ticket) {
  let body = '';
  try {
    req.on('data', chunk => {
      body += chunk;
    })

  } catch (error) {
    console.log('Request reading error');
    sendError(res, 500, 'Server error on request reading')
  }
  // После того как буфер перестал заполняться данными, вызываем эмитер end
  req.on('end', async () => {
    try {
      const updateClientData = await JSON.parse(body);

      if (
        !updateClientData.name ||
        !updateClientData.surname ||
        !updateClientData.phone ||
        !updateClientData.ticket ||
        !updateClientData.booking
      ) {
        sendError(res, 400, 'Incomplete client data');
        return;
      }

      if (
        updateClientData.booking &&
        (!updateClientData.booking.length ||
          !Array.isArray(updateClientData.booking) ||
          !updateClientData.booking.every((item) => item.comedian && item.time))
      ) {
        sendError(res, 400, 'Ticket booking fields are filled in incorrectly');
        return;
      }

      const clientData = await fs.readFile(path, 'utf8');
      const clients = JSON.parse(clientData);

      const clientIndex = clients.findIndex(c => c.ticket === ticket);

      if (clientIndex === -1) {
        sendError(res, 404, 'Client not found')
      }

      clients[clientIndex] = {
        ...clients[clientIndex],
        ...updateClientData
      };

      await fs.writeFile(path, JSON.stringify(clients));

      sendData(res, clients[clientIndex]);
    } catch (error) {
      console.log(error);
      sendError(res, 500, 'Server error on data updating')
    }
  });
}