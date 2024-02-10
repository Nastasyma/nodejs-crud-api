import request from 'supertest';
import { server } from '../src';
import { BASE_URL } from '../src/utils/constants';
import { Status } from '../src/types/enums';

const user = { username: 'Vasya', age: 25, hobbies: ['cooking'] };
const updatedUser = { username: 'Jhon', age: 25, hobbies: ['cooking'] };

describe('CRUD operations tests', () => {
  afterAll((done) => {
    server.close(() => {
      done();
    });
  });

  test('Get an empty array with a GET api/users request for the first api call', async () => {
    const response = await request(server).get(BASE_URL).set('Accept', 'application/json');
    expect(response.status).toBe(Status.OK);
    expect(response.body).toEqual([]);
  });

  test('Create a new user with a POST api/users request', async () => {
    const initialResponse = await request(server).get(BASE_URL).set('Accept', 'application/json');
    const initialUserCount = initialResponse.body.length;

    const response = await request(server)
      .post(BASE_URL)
      .set('Accept', 'application/json')
      .send(user);
    expect(response.status).toBe(Status.CREATED);
    expect(response.body.username).toBe('Vasya');

    const updatedResponse = await request(server).get(BASE_URL).set('Accept', 'application/json');
    const updatedUserCount = updatedResponse.body.length;
    expect(updatedUserCount).toBe(initialUserCount + 1);
  });

  test('Get user with a GET api/users/:id request', async () => {
    const response = await request(server).get(BASE_URL).set('Accept', 'application/json');
    const id = response.body[0].id;
    const newResponse = await request(server)
      .get(`${BASE_URL}/${id}`)
      .set('Accept', 'application/json');
    expect(newResponse.status).toBe(Status.OK);
    expect(newResponse.body.username).toBeDefined();
    expect(newResponse.body.username).toBe('Vasya');
  });

  test('Update an existing user with a PUT api/users request', async () => {
    const response = await request(server).get(BASE_URL).set('Accept', 'application/json');
    const id = response.body[0].id;
    const newResponse = await request(server)
      .put(`${BASE_URL}/${id}`)
      .set('Accept', 'application/json')
      .send(updatedUser);
    expect(newResponse.status).toBe(Status.OK);
    expect(newResponse.body[0].username).toBe('Jhon');
  });

  test('Delete an existing user with a DELETE api/users request', async () => {
    const response = await request(server).get(BASE_URL).set('Accept', 'application/json');
    const id = response.body[0].id;
    const newResponse = await request(server)
      .delete(`${BASE_URL}/${id}`)
      .set('Accept', 'application/json');
    expect(newResponse.status).toBe(Status.NO_CONTENT);
  });

  test('Get an empty array with a GET api/users after deleting', async () => {
    const response = await request(server).get(BASE_URL).set('Accept', 'application/json');
    expect(response.status).toBe(Status.OK);
    expect(response.body).toEqual([]);
  });
});

describe('Validation tests', () => {
  afterAll((done) => {
    server.close(() => {
      done();
    });
  });

  test("Shouldn't create a user with invalid username", async () => {
    const invalidUser = { username: ['Vasya'], age: 25, hobbies: ['cooking'] };
    const response = await request(server)
      .post(BASE_URL)
      .set('Accept', 'application/json')
      .send(invalidUser);
    expect(response.status).toBe(Status.BAD_REQUEST);
  });

  test("Shouldn't create a user with invalid age", async () => {
    const invalidUser = { username: 'Vasya', age: '25', hobbies: ['cooking'] };
    const response = await request(server)
      .post(BASE_URL)
      .set('Accept', 'application/json')
      .send(invalidUser);
    expect(response.status).toBe(Status.BAD_REQUEST);
  });

  test("Shouldn't create a user with invalid hobbies", async () => {
    const invalidUser = { username: 'Vasya', age: 25, hobbies: [25] };
    const response = await request(server)
      .post(BASE_URL)
      .set('Accept', 'application/json')
      .send(invalidUser);
    expect(response.status).toBe(Status.BAD_REQUEST);
  });

  test("Shouldn't create a user without username", async () => {
    const invalidUser = { age: 25, hobbies: ['cooking'] };
    const response = await request(server)
      .post(BASE_URL)
      .set('Accept', 'application/json')
      .send(invalidUser);
    expect(response.status).toBe(Status.BAD_REQUEST);
  });

  test("Shouldn't create a user without age", async () => {
    const invalidUser = { username: 'Vasya', hobbies: ['cooking'] };
    const response = await request(server)
      .post(BASE_URL)
      .set('Accept', 'application/json')
      .send(invalidUser);
    expect(response.status).toBe(Status.BAD_REQUEST);
  });

  test("Shouldn't create a user without hobbies", async () => {
    const invalidUser = { username: 'Vasya', age: 25 };
    const response = await request(server)
      .post(BASE_URL)
      .set('Accept', 'application/json')
      .send(invalidUser);
    expect(response.status).toBe(Status.BAD_REQUEST);
  });
});

describe('Handle error tests', () => {
  afterAll((done) => {
    server.close(() => {
      done();
    });
  });

  const id = '62a20451-ea21-444e-b37d-107c81015274';

  test('Should return 404 error with invalid endpoint', async () => {
    const response = await request(server)
      .get('/invalid_endpoint')
      .set('Accept', 'application/json');
    expect(response.status).toBe(Status.NOT_FOUND);
  });

  test('Should return 404 error with a GET api/users/id request if the user does not exist', async () => {
    const response = await request(server)
      .get(`${BASE_URL}/${id}`)
      .set('Accept', 'application/json');
    expect(response.status).toBe(Status.NOT_FOUND);
  });

  test('Should return 404 error with a DELETE api/users/id request if the user does not exist', async () => {
    const response = await request(server)
      .delete(`${BASE_URL}/${id}`)
      .set('Accept', 'application/json');
    expect(response.status).toBe(Status.NOT_FOUND);
  });

  test('Should return 404 error with a PUT api/users/id request if the user does not exist', async () => {
    const response = await request(server)
      .put(`${BASE_URL}/${id}`)
      .set('Accept', 'application/json')
      .send(updatedUser);
    expect(response.status).toBe(Status.NOT_FOUND);
  });

  test('Should return 400 error with a GET api/users/invalid_id request', async () => {
    const response = await request(server)
      .get(`${BASE_URL}/invalid_id`)
      .set('Accept', 'application/json');
    expect(response.status).toBe(Status.BAD_REQUEST);
  });

  test('Should return 400 error with a DELETE api/users/invalid_id request', async () => {
    const response = await request(server)
      .delete(`${BASE_URL}/invalid_id`)
      .set('Accept', 'application/json');
    expect(response.status).toBe(Status.BAD_REQUEST);
  });

  test('Should return 400 error with a POST api/users request with invalid json', async () => {
    const invalidUser = { username: 'Vasya', age: '25', hobbies: ['cooking'] };
    const response = await request(server)
      .post(BASE_URL)
      .set('Accept', 'application/json')
      .send(invalidUser);
    expect(response.status).toBe(Status.BAD_REQUEST);
  });
});
