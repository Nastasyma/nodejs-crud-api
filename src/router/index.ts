import { getUsers } from '../controllers/getUsers';
import { IncomingMessage, ServerResponse } from 'http';
import { Messages, Methods, Status } from '../types/enums';
import { IUser } from '../types/inteface';
import { handleError } from '../utils/errors';
import { createUser } from '../controllers/createUser';

export const userRouter = (request: IncomingMessage, response: ServerResponse, data: IUser[]) => {
  const { url, method } = request;

  if (!url) return;

  try {
    switch (method) {
      case Methods.GET:
        getUsers(response, data, url);
        break;
      case Methods.POST:
        createUser(request, response, url, data);
        break;
      // case Methods.PUT:
      //   updateUser(request, response);
      //   break;
      // case Methods.DELETE:
      //   deleteUser(request, response);
      //   break;
      default:
        handleError(response, Messages.INVALID_ENDPOINT, Status.NOT_FOUND);
    }
  } catch (error) {
    handleError(response, Messages.INTERNAL_SERVER_ERROR, Status.INTERNAL_SERVER_ERROR);
  }
};
