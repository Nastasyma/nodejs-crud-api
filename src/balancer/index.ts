import cluster from 'node:cluster';
import { Server } from 'node:http';
import { cpus } from 'node:os';
import { IncomingMessage, ServerResponse, createServer, request as httpRequest } from 'http';
import { handleError } from '../utils/errors';
import { Messages, Status } from '../types/enums';
import { ConsoleMessage } from '../utils/coloredMsgs';
import { usersDB } from '..';

const getWorkerPort = (i: number, PORT: number) => {
  return (PORT + i + 1).toString();
};

const startPrimaryServer = (PORT: number) => {
  let currentPort = PORT + 1;

  for (let i = 0; i < cpus().length; i++) {
    const worker = cluster.fork({ WORKER_PORT: getWorkerPort(i, PORT) });
    worker.on('message', (message) => {
      // console.log(message);
      usersDB.updateUsers(message);
      for (let j = 0; j < cpus().length; j++) {
        const currentWorker = cluster.workers && cluster.workers[j + 1];
        if (currentWorker) {
          currentWorker.send({ data: usersDB.getUsers() });
        }
      }
    });
  }

  const primaryServer = createServer(async (request: IncomingMessage, response: ServerResponse) => {
    const { url, method, headers } = request;

    try {
      const childRequest = httpRequest(
        {
          port: currentPort,
          path: url,
          method: method,
          headers: headers,
        },
        async (res) => {
          const data: Buffer[] = [];
          res.on('data', (chunk) => {
            data.push(chunk);
          });
          res.on('end', () => {
            response.end(Buffer.concat(data).toString());
          });
          res.on('error', () =>
            handleError(response, Messages.INTERNAL_SERVER_ERROR, Status.INTERNAL_SERVER_ERROR)
          );
        }
      );

      childRequest.on('error', () =>
        handleError(response, Messages.INTERNAL_SERVER_ERROR, Status.INTERNAL_SERVER_ERROR)
      );

      const data: Buffer[] = [];
      request.on('data', (chunk) => {
        data.push(chunk);
      });
      request.on('end', () => {
        childRequest.end(Buffer.concat(data).toString());
      });
      request.on('error', () =>
        handleError(response, Messages.INTERNAL_SERVER_ERROR, Status.INTERNAL_SERVER_ERROR)
      );
    } catch {
      handleError(response, Messages.INTERNAL_SERVER_ERROR, Status.INTERNAL_SERVER_ERROR);
    }

    currentPort = currentPort < PORT + cpus().length ? currentPort + 1 : PORT + 1;
  });

  primaryServer.listen(PORT, () => {
    ConsoleMessage.yellow(`Balancer #${process.pid} is listening port ${PORT}`);
  });
};

const startWorkerServer = (server: Server) => {
  const workerPort = process.env.WORKER_PORT;
  if (!workerPort) {
    console.error('Worker port is not provided');
    return;
  }

  server.listen(workerPort, () =>
    ConsoleMessage.magenta(`Worker #${process.pid} is running on port ${workerPort}`)
  );

  process.on('message', ({ data }) => usersDB.updateUsers(data));
};

export const balancer = (PORT: number, server: Server) => {
  if (cluster.isPrimary) {
    startPrimaryServer(PORT);
  } else if (cluster.isWorker) {
    startWorkerServer(server);
  }
};

export const isMulti = () => {
  return process.argv.includes('--multi');
};
