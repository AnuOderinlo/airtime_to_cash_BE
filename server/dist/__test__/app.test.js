"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const app_1 = __importDefault(require("../app"));
const supertest_1 = __importDefault(require("supertest"));
const database_config_1 = __importDefault(require("../config/database.config"));
const request = (0, supertest_1.default)(app_1.default);
beforeAll(async () => {
    await database_config_1.default.sync({ force: true }).then(() => {
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
            confirmPassword: '12345',
        });
        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Successfully created a user');
        expect(response.body.status).toBe('Success');
        expect(response.body).toHaveProperty('data');
        expect(response.body).toHaveProperty('token');
    });
    //Login with email
    it('should login a user with email', async () => {
        const response = await request.post('/users/login').send({
            email: 'jane12@example.com',
            password: '12345',
        });
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Login successful');
        expect(response.body).toHaveProperty('token');
        expect(response.body).toHaveProperty('User');
    });
    // Login with username
    it('should login a user with email', async () => {
        const response = await request.post('/users/login').send({
            username: 'jane12',
            password: '12345',
        });
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Login successful');
        expect(response.body).toHaveProperty('token');
        expect(response.body).toHaveProperty('User');
    });
});
