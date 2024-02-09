import { IncomingMessage } from "http";

export const getJsonBody = (request: IncomingMessage) => {
  return new Promise((resolve, reject) => {

    try {
      let data = '';
      request.on('data', (chunk) => {
        data += chunk.toString();
      });
      request.on('end', () => {
        resolve(JSON.parse(data));
      });
    } catch (error) {
      reject(error);
    }
  });
}