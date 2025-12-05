const http = require("http");

const data = {
  name: "Product X",
  count: 4,
  images: [
    { url: "https://via.placeholder.com/100/4caf50?text=1", ready: true, error: false },
    { url: "https://example.com/wrong.png", ready: true, error: false },
    { url: "https://via.placeholder.com/100/2196f3?text=3", ready: true, error: false },
    { url: "https://via.placeholder.com/100/f44336?text=ERR", ready: false, error: true }
  ]
};

const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "GET" && req.url === "/api/images") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify(data));
  }

  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("Not Found");
});

const PORT = 4000;
server.listen(PORT, () => {
  console.log(`Node server running at http://localhost:${PORT}`);
});
