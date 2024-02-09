export const enum Methods {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

export const enum Messages {
  NOT_FOUND = 'User not found',
  BAD_REQUEST = 'Bad request',
  INTERNAL_SERVER_ERROR = 'Internal server error',
  INVALID_ID = 'Invalid ID',
  INVALID_ENDPOINT = 'Invalid endpoint',
  REQUARED_FIELD = 'All fields are required',
}

export const enum Status {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}
