import { ServerResponse } from 'http';
import { validate } from 'uuid';
import { BASE_URL, JSON_HEADER } from '../utils/constants';
import { IUser } from '../types/inteface';
import { handleError } from '../utils/errors';
import { Messages, Status } from '../types/enums';

export const getUsers = (response: ServerResponse, users: IUser[], url: string) => {
  if (url === BASE_URL) {
    response.writeHead(Status.OK, JSON_HEADER);
    response.write(JSON.stringify(users));
    response.end();
  } else if (url && url.startsWith(`${BASE_URL}/`)) {
    const id = url.split('/')[3];
    const user = users.find((user) => user.id === id);

    if (!validate(id)) {
      handleError(response, Messages.INVALID_ID, Status.BAD_REQUEST);
    } else if (!user) {
      handleError(response, Messages.NOT_FOUND, Status.NOT_FOUND);
    } else {
      response.writeHead(Status.OK, JSON_HEADER);
      response.write(JSON.stringify(user));
      response.end();
    }
  } else {
    handleError(response, Messages.INVALID_ENDPOINT, Status.BAD_REQUEST);
  }
};
