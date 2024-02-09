import { getUsers } from '../controllets/getUsers';
import { IncomingMessage, ServerResponse } from 'http';
import { Messages, Methods, Status } from '../types/enums';
import { IUser } from '../types/inteface';
import { JSON_HEADER } from '../utils/constants';
import { handleError } from '../utils/errors';

export const userRouter = (request: IncomingMessage, response: ServerResponse, data: IUser[]) => {
  const { url, method } = request;

  if (!url) return;

  switch (method) {
    case Methods.GET:
      getUsers(url, response, data);
      break;
    // case 'POST':
    //   createUser(request, response);
    //   break;
    // case 'PUT':
    //   updateUser(request, response);
    //   break;
    // case 'DELETE':
    //   deleteUser(request, response);
    //   break;
    default:
      handleError(response, Messages.INVALID_ENDPOINT, Status.NOT_FOUND);
  }
};
