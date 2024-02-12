import { getUsers } from '../controllers/getUsers';
import { IncomingMessage, ServerResponse } from 'node:http';
import { Messages, Methods, Status } from '../types/enums';
import { IUser } from '../types/inteface';
import { handleError } from '../utils/errors';
import { createUser } from '../controllers/createUser';
import { deleteUser } from '../controllers/deleteUser';
import { updateUser } from '../controllers/updateUser';
import cluster from 'node:cluster';
import { isMulti } from '../balancer';

export const userRouter = async (request: IncomingMessage, response: ServerResponse, data: IUser[]) => {
  if (isMulti() && cluster.isWorker) {
    console.log(`Request: ${request.method} ${request.url} - Worker #${process.pid} on port ${process.env.WORKER_PORT}`);
  } else {
    console.log(`Request: ${request.method} ${request.url} - Server #${process.pid} on port ${process.env.PORT}`);
  }

  const { url, method } = request;

  if (!url) return;

  try {
    switch (method) {
      case Methods.GET:
        await getUsers(response, data, url);
        break;
      case Methods.POST:
        await createUser(request, response, url, data);
        break;
      case Methods.PUT:
        await updateUser(request, response, url, data);
        break;
      case Methods.DELETE:
        await deleteUser(response, data, url);
        break;
      default:
        handleError(response, Messages.INVALID_ENDPOINT, Status.NOT_FOUND);
    }
  } catch (error) {
    handleError(response, Messages.INTERNAL_SERVER_ERROR, Status.INTERNAL_SERVER_ERROR);
  }
};
