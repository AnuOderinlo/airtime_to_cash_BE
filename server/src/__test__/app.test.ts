import 'dotenv/config';
import app from '../app';
import supertest from 'supertest';

import db from '../config/database.config';

const request = supertest(app);

beforeAll(async () => {
  await db.sync({ force: true }).then(() => {
    console.log('Database successfully created for test');
  });
});

describe('it should test all apis', () => {
  // Testing for sign up
  it('it should create a user', async () => {
    const response = await request.post('/users/users').send({
      firstname: 'Jane2',
      lastname: 'Danny2',
      email: 'jane12@example.com',
      username: 'janeDanny12',
      phoneNumber: '07971192932',
      password: '12345',
      confirm_password: '12345',
    });
    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Successfully created a user');
    expect(response.body.status).toBe('Success');
    expect(response.body).toHaveProperty('data');
    expect(response.body).toHaveProperty('token');
  });
});
