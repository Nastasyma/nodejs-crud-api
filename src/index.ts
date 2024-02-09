import { IncomingMessage, ServerResponse, createServer } from 'node:http';
import 'dotenv/config';
import { Router } from './router';
import { IUser } from './types/inteface';

const PORT = process.env.PORT || 5001;

const users: IUser[] = [];

const server = createServer((req: IncomingMessage, res: ServerResponse) => {
  Router(req, res, users);
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
