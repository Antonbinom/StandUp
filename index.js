import http from "node:http";
import fs from "node:fs/promises";
import { sendError } from "./modules/send.js";
import { checkFile } from "./modules/checkFile.js";
import { handleComedianRequest } from "./modules/handelComediansRequest.js";
import { handleAddClient } from "./modules/handleAddClient.js";
import { handleGetClient } from "./modules/handleGetClient.js";
import { handleUpdateClient } from "./modules/handleUpdateClient.js";

const PORT = '8080';
const COMEDIANS = './comedians.json';
const CLIENTS = './clients.json';

async function startServer() {
  if (!(await checkFile(COMEDIANS))) return;
  await checkFile(CLIENTS, true);

  const comediansData = await fs.readFile(COMEDIANS, "utf-8");
  const comedians = JSON.parse(comediansData);

  http
    .createServer(async (req, res) => {
      try {
        res.setHeader('Access-Control-Allow-Origin', '*');

        const segments = req.url.split('/').filter(Boolean);

        if (
          req.method === "GET"
          && segments[0] === 'comedians') {
          handleComedianRequest(req, res, comedians, segments)
          return;
        }

        if (
          req.method === "GET"
          && segments[0] === 'clients'
          && segments.length === 2) {
          const ticket = segments[1];
          handleGetClient(req, res, CLIENTS, ticket);
          return;
        }
        if (
          req.method === "POST"
          && segments[0] === 'clients') {
          handleAddClient(req, res, CLIENTS);
          return;
        }

        if (
          req.method === "PATCH"
          && segments[0] === 'clients'
          && segments.length === 2) {
          handleUpdateClient(req, res, CLIENTS, segments[1]);
          return;
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