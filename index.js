import http from "node:http";
import fs from "node:fs/promises";

const PORT = '8080';

http
  .createServer(async (req, res) => {
    if (req.method = "GET" && req.url === '/comedians') {
      try {
        const data = await fs.readFile("comedians.json", "utf-8");
        res.writeHead(200, {
          "Content-Type": "text/json; charset=utf-8",
          "Access-Control-Allow-Origin": "*"
        })
        res.end(data);
      } catch (err) {
        res.writeHead(500, {
          "Content-Type": "text/plain; charset=utf-8",
        });
        res.end(`Server error: ${err}`)
      }
    } else {
      res.writeHead(404);
      res.end("<h1>Ooops! 404 Not found :(</h1>");
    }
  })
  .listen(PORT)