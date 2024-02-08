import { createServer } from "node:http";
import 'dotenv/config';

const PORT = process.env.PORT || 3001;

const server = createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.write(JSON.stringify({ message: "Node CRUD API" }));
  res.end();
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});