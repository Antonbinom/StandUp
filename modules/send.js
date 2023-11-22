export function sendData(res, data) {
  res.writeHead(200, {
    "Content-Type": "text/json; charset=utf-8",
  });

  res.end(JSON.stringify(data));
}

export function sendError(res, status, err) {
  res.writeHead(status, {
    "Content-Type": "text/plain; charset=utf-8",
  });

  res.end(err);
}
