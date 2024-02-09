import { IncomingMessage, ServerResponse } from 'node:http';
import { v4 } from 'uuid';
import { Messages, Status } from '../types/enums';
import { IUser } from '../types/inteface';
import { getJsonBody } from '../utils/bodyParser';
import { BASE_URL, JSON_HEADER } from '../utils/constants';
import { handleError } from '../utils/errors';
import { isValidUserData } from '../utils/validateData';

export const createUser = async (
  request: IncomingMessage,
  response: ServerResponse,
  url: string,
  data: IUser[]
) => {
  if (url === BASE_URL) {
    try {
      const body: IUser = (await getJsonBody(request)) as IUser;

      if (!isValidUserData(body)) {
        handleError(response, Messages.INVALID_JSON, Status.BAD_REQUEST);
        return;
      }

      const user = { ...body, id: v4() };
      data.push(user);
      response.writeHead(Status.CREATED, JSON_HEADER);
      response.write(JSON.stringify(user));
      response.end();
    } catch (error) {
      handleError(response, Messages.INVALID_JSON, Status.BAD_REQUEST);
    }
  } else {
    handleError(response, Messages.INVALID_ENDPOINT, Status.BAD_REQUEST);
  }
};
