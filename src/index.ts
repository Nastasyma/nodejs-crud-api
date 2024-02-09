import { IncomingMessage, ServerResponse, createServer } from 'node:http';
import 'dotenv/config';
import { Router } from './router';
import { IUser } from './types/inteface';

const PORT = process.env.PORT || 5001;

const users: IUser[] = [
  {
    id: 'f21c5e5b-6e6b-4e5a-9d26-2c6e0e7f9d1c',
    username: 'Ivan',
    age: 20,
    hobbies: ['swimming', 'running'],
  },
];

const server = createServer((req: IncomingMessage, res: ServerResponse) => {
  Router(req, res, users);
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
