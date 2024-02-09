import { IncomingMessage, ServerResponse } from 'http';
import { v4 } from 'uuid';
import { Messages, Status } from '../types/enums';
import { handleError } from '../utils/errors';
import { BASE_URL, JSON_HEADER } from '../utils/constants';
import { IUser } from '../types/inteface';
import { getJsonBody } from '../utils/bodyParser';

export const createUser = async (
  request: IncomingMessage,
  response: ServerResponse,
  url: string,
  data: IUser[]
) => {
  if (url === BASE_URL) {
    try {
      const body: IUser = await getJsonBody(request) as IUser;
      const user = { ...body, id: v4()};
      data.push(user);
      response.writeHead(Status.CREATED, JSON_HEADER);
      response.write(JSON.stringify(user));
      response.end();
    } catch (error) {
      handleError(response, Messages.INTERNAL_SERVER_ERROR, Status.INTERNAL_SERVER_ERROR);
    }
  } else {
    handleError(response, Messages.INVALID_ENDPOINT, Status.BAD_REQUEST);
  }
};
