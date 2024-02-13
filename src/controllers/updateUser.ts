import cluster from 'cluster';
import { IncomingMessage, ServerResponse } from 'node:http';
import { validate } from 'uuid';
import { usersDB } from '..';
import { Messages, Status } from '../types/enums';
import { IUser } from '../types/inteface';
import { getJsonBody } from '../utils/bodyParser';
import { BASE_URL, JSON_HEADER } from '../utils/constants';
import { handleError } from '../utils/errors';
import { isValidUserData } from '../utils/validateData';

export const updateUser = async (
  request: IncomingMessage,
  response: ServerResponse,
  url: string,
  data: IUser[]
) => {
  if (url && url.startsWith(`${BASE_URL}/`)) {
    try {
      const id = url.split('/')[3];

      const user = data.find((user) => user.id === id);

      if (!validate(id)) {
        handleError(response, Messages.INVALID_ID, Status.BAD_REQUEST);
      } else if (!user) {
        handleError(response, Messages.NOT_FOUND, Status.NOT_FOUND);
      } else {
        const body: IUser = (await getJsonBody(request)) as IUser;

        if (!isValidUserData(body)) {
          handleError(response, Messages.INVALID_JSON, Status.BAD_REQUEST);
          return;
        }

        const userIndex = data.findIndex((user) => user.id === id);

        data[userIndex] = { ...body, id: user.id };

        response.writeHead(Status.OK, JSON_HEADER);
        response.write(JSON.stringify(data));
        response.end();
      }
    } catch (error) {
      handleError(response, Messages.INVALID_JSON, Status.BAD_REQUEST);
    }
  } else {
    handleError(response, Messages.INVALID_ENDPOINT, Status.NOT_FOUND);
  }

  if (cluster.isWorker) {
    process.send?.(usersDB.getUsers());
  }
};
