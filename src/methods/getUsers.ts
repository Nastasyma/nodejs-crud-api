import { IUser } from '@/types/inteface';
import { BASE_URL } from '@/utils/constants';
import { ServerResponse } from 'http';

export const getUsers = (url: string, response: ServerResponse, users: IUser[]) => {
  if (url === BASE_URL) {
    response.statusCode = 200;
    response.setHeader('Content-Type', 'application/json');
    response.write(JSON.stringify(users));
    response.end();
  }
};
