import fs from 'node:fs/promises';
import { sendData, sendError } from "./send.js";

export function handleAddClient(req, res, path) {
  let body = '';
  try {
    req.on('data', chunk => {
      // при событии data и заполнении буфера
      // собираем тело запроса по частям
      body += chunk;
    })
  } catch (error) {
    console.log('Request reading error');
    sendError(res, 500, 'Server error on request reading')
  }
  // После того как буфер перестал заполняться данными, вызываем эмитер end
  req.on('end', async () => {
    try {
      const newClient = await JSON.parse(body);

      if (
        !newClient.name ||
        !newClient.surname ||
        !newClient.phone ||
        !newClient.ticket ||
        !newClient.booking
      ) {
        sendError(res, 400, 'Incomplete client data');
        return;
      }

      if (
        newClient.booking &&
        (!newClient.booking.length ||
          !Array.isArray(newClient.booking) ||
          !newClient.booking.every((item) => item.comedian && item.time))
      ) {
        sendError(res, 400, 'Ticket booking fields are filled in incorrectly');
        return;
      }

      const clientData = await fs.readFile(path, 'utf8');
      const clients = JSON.parse(clientData);

      clients.push(newClient);

      await fs.writeFile(path, JSON.stringify(clients))

      sendData(res, newClient);
    } catch (error) {
      console.log(error);
    }
  });
}