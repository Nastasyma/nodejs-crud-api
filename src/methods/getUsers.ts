import { ServerResponse } from 'http';
import { BASE_URL } from '../utils/constants';
import { IUser } from '../types/inteface';

export const getUsers = (url: string, response: ServerResponse, users: IUser[]) => {
  if (url === BASE_URL) {
    response.statusCode = 200;
    response.setHeader('Content-Type', 'application/json');
    response.write(JSON.stringify(users));
    response.end();
  }
};
