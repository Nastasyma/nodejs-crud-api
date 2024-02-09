import { getUsers } from '../methods/getUsers';
import { IncomingMessage, ServerResponse } from 'http';
import { Methods } from '../types/enums';
import { IUser } from '../types/inteface';

export const Router = (request: IncomingMessage, response: ServerResponse, data: IUser[]) => {
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
      response.statusCode = 404;
      response.setHeader('Content-Type', 'application/json');
      response.write(JSON.stringify({ title: 'Not found', message: 'Not found' }));
      response.end();
  }
};
