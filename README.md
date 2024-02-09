# RSSchool task: Node.js CRUD API

## Description

**[Assignment: CRUD API](https://github.com/AlreadyBored/nodejs-assignments/blob/main/assignments/crud-api/assignment.md)**

The task is to implement simple CRUD API using in-memory database underneath.

## Getting Started
### Installation

- Clone the repo

  ```sh
  git clone https://github.com/Nastasyma/nodejs-crud-api.git
  ```
- Change the directory

  ```sh
  cd nodejs-crud-api
  ```
- Change the branch

  ```sh
  git checkout develop
  ```
- Install NPM packages

  ```sh
  npm install
  ```
<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Available commands

- Run the application in development mode.
  ```sh
  npm run start:dev
  ```
- Build and run the application in production mode.
  ```sh
  npm run start:prod
  ```
- Run the application in multiple modes.
  ```sh
  npm run start:multi
  ```
- Run ESLint to check for code errors and style issues.
  ```sh
  npm run lint
  ```
- Run tests using Jest.
  ```js
  npm run test
  ```
<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Implementation details
  - **GET** `api/users` is used to get all persons
      - Server should answer with `status code` **200** and all users records
  - **GET** `api/users/{userId}` 
      - Server should answer with `status code` **200** and record with `id === userId` if it exists
      - Server should answer with `status code` **400** and corresponding message if `userId` is invalid (not `uuid`)
      - Server should answer with `status code` **404** and corresponding message if record with `id === userId` doesn't exist
  - **POST** `api/users` is used to create record about new user and store it in database
      - Server should answer with `status code` **201** and newly created record
      - Server should answer with `status code` **400** and corresponding message if request `body` does not contain **required** fields
  - **PUT** `api/users/{userId}` is used to update existing user
      - Server should answer with` status code` **200** and updated record
      - Server should answer with` status code` **400** and corresponding message if `userId` is invalid (not `uuid`)
      - Server should answer with` status code` **404** and corresponding message if record with `id === userId` doesn't exist
  - **DELETE** `api/users/{userId}` is used to delete existing user from database
      - Server should answer with `status code` **204** if the record is found and deleted
      - Server should answer with `status code` **400** and corresponding message if `userId` is invalid (not `uuid`)
      - Server should answer with `status code` **404** and corresponding message if record with `id === userId` doesn't exist  

- Users are stored as `objects` that have following properties:
    - `id` — unique identifier (`string`, `uuid`) generated on server side
    - `username` — user's name (`string`, **required**)
    - `age` — user's age (`number`, **required**)
    - `hobbies` — user's hobbies (`array` of `strings` or empty `array`, **required**)  

- On `localhost:4000/api` load balancer is listening for requests
- On `localhost:4001/api`, `localhost:4002/api`, `localhost:4003/api` workers are listening for requests from load balancer
- When user sends request to `localhost:4000/api`, load balancer sends this request to `localhost:4001/api`, next user request is sent to `localhost:4002/api` and so on.
- After sending request to `localhost:4003/api` load balancer starts from the first worker again (sends request to `localhost:4001/api`)
- State of db should be consistent between different workers, for example:
    1. First `POST` request addressed to `localhost:4001/api` creates user
    2. Second `GET` request addressed to `localhost:4002/api` should return created user
    3. Third `DELETE` request addressed to `localhost:4003/api` deletes created user
    4. Fourth `GET` request addressed to `localhost:4001/api` should return **404** status code for created user

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Example of request body
```sh
{
  "username": "Emily",
  "age": 25,
  "hobbies": ["paint", "travel"]
}
```
