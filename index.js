import http from "node:http";
import fs from "node:fs/promises";
import { sendData, sendError } from "./modules/send.js";
import { checkFile } from "./modules/checkFile.js";

const PORT = '8080';
const COMEDIANS = './comedians.json';
const CLIENTS = './clients.json';



async function startServer() {
  if (!(await checkFile(COMEDIANS))) return;
  await checkFile(CLIENTS, true)
  http
    .createServer(async (req, res) => {
      try {
        res.setHeader('Access-Control-Allow-Origin', '*');

        const segments = req.url.split('/').filter(Boolean);

        if (
          req.method === "GET"
          && segments[0] === 'comedians') {
          const data = await fs.readFile(COMEDIANS, "utf-8");
          const comedians = JSON.parse(data);

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
          return;
        }

        if (
          req.method === "GET"
          && segments[0] === 'clients'
          && segments.length === 2) {

        }
        if (
          req.method === "POST"
          && segments[0] === 'clients') {

        }

        if (
          req.method === "PATCH"
          && segments[0] === 'clients'
          && segments.length === 2) {

        }
        sendError(res, 404, `Server error: "<h1>Ooops! 404 Not found :(</h1>"`);
      } catch (err) {
        sendError(res, 500, `Server error: ${err}`);

      }
    })
    .listen(PORT)

  console.log(`Сервер запущен по адресу: http://localhost:${PORT}`);

}
startServer();

//при запуске node index.js или nodemon index.js проверять наличие файла comedians.json
// и проверяет наличие файла clients.json
// если файла comedians.json отсутствует, то останавливаем сервер
// если отсутствует файл clients.json, то просто его создаем с пустым массивом внутри