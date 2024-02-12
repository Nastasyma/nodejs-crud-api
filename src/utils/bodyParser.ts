import { IncomingMessage } from "node:http";

export const getJsonBody = (request: IncomingMessage) => {
  return new Promise((resolve, reject) => {
    const data: Buffer[] = [];
    request.on('data', (chunk) => {
      data.push(chunk);
    });
    request.on('end', () => {
      try {
        resolve(JSON.parse(Buffer.concat(data).toString()));
      } catch (error) {
        reject(error);
      }
    });
    request.on('error', (error) => {
      reject(error);
    });
  });
}