import { ServerResponse } from 'http';

export const handleError = (response: ServerResponse, message: string, status: number): void => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.end(JSON.stringify({ message }));
};
