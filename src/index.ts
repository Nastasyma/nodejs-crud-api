import { IncomingMessage, ServerResponse, createServer } from 'node:http';
import 'dotenv/config';
import { userRouter } from './router';
import { IUser } from './types/inteface';
import { balancer, isMulti } from './balancer';

const PORT: number = Number(process.env.PORT || 4000);
const users: IUser[] = [];

export const server = createServer((req: IncomingMessage, res: ServerResponse) => {
  userRouter(req, res, users);
});

if (isMulti()) {
  balancer(PORT, server);
} else {
  server.listen(PORT, () => {
    console.log(`Server #${process.pid} is running on port ${PORT}.`);
  });
}

process.on('SIGINT', () => {
  server.close(() => process.exit());
});
