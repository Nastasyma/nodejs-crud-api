import cluster from 'cluster';
import { ServerResponse } from 'node:http';
import { validate } from 'uuid';
import { usersDB } from '..';
import { Messages, Status } from '../types/enums';
import { IUser } from '../types/inteface';
import { BASE_URL, JSON_HEADER } from '../utils/constants';
import { handleError } from '../utils/errors';

export const deleteUser = async (response: ServerResponse, data: IUser[], url: string) => {
  if (url && url.startsWith(`${BASE_URL}/`)) {
    const id = url.split('/')[3];

    const userIndex = data.findIndex((user) => user.id === id);

    if (!validate(id)) {
      handleError(response, Messages.INVALID_ID, Status.BAD_REQUEST);
    } else if (userIndex === -1) {
      handleError(response, Messages.NOT_FOUND, Status.NOT_FOUND);
    } else {
      data.splice(userIndex, 1);
      response.writeHead(Status.NO_CONTENT, JSON_HEADER);
      response.write(JSON.stringify(userIndex));
      response.end();
    }
  } else {
    handleError(response, Messages.INVALID_ENDPOINT, Status.NOT_FOUND);
  }

  if (cluster.isWorker) {
    process.send?.(usersDB.getUsers());
  }
};
