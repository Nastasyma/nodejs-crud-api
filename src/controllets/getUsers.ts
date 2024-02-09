import { ServerResponse } from 'http';
import { validate } from 'uuid';
import { BASE_URL } from '../utils/constants';
import { IUser } from '../types/inteface';
import { handleError } from '../utils/errors';
import { Messages, Status } from '../types/enums';

export const getUsers = (url: string, response: ServerResponse, users: IUser[]) => {
  if (url === BASE_URL) {
    response.statusCode = 200;
    response.setHeader('Content-Type', 'application/json');
    response.write(JSON.stringify(users));
    response.end();
  } else if (url && url.startsWith(`${BASE_URL}/`)) {
    const id = url.split('/')[3];
    const user = users.find((user) => user.id === id);

    if (!user) {
      handleError(response, Messages.NOT_FOUND, Status.NOT_FOUND);
    } else if (!validate(id)) {
      handleError(response, Messages.INVALID_ID, Status.BAD_REQUEST);
    } else {
      response.statusCode = 200;
      response.setHeader('Content-Type', 'application/json');
      response.write(JSON.stringify(user));
      response.end();
    }
  } else {
    handleError(response, Messages.INVALID_ROUTE, Status.BAD_REQUEST);
  }
};
