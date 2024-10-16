const request = require('supertest');
const app = require('./src/app');
const db = require('./db/connection');
const User = require('./models/User');

beforeAll(async () => {
    await db.sync();
});

beforeEach(async () => {
    await User.destroy({ where: {} });
});

afterAll(async () => {
    await db.close();
});

describe('GET /users', () => {
    test('should return all users', async () => {
        const response = await request(app).get('/users');
        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
    });
});

describe('GET /users/:id', () => {
    test('should return a single user', async () => {
        const user = { name
            : 'User 1', age: 30 };
        const newUser = await User.create(user);
        const response = await request(app).get(`/users/${newUser.id}`);
        expect(response.status).toBe(200);
        expect(response.body.age).toBe(30);
    });
});

describe('POST /users/add', () => {
    test('should create a new user', async () => {
        const user = { name
            : 'User 1', age: 30 };
        const response = await request(app)
            .post('/users/add')
            .send(user);
        expect(response.status).toBe(201);
        expect(response.body.age).toEqual(30);
    });
});

describe('PUT /users/update/:id', () => {
    test('should update a user', async () => {
        const user = { name: 'User 1', age: 30 };
        const newUser = await User.create(user);
        const updatedUser = { name: 'User 2', age: 45 };
        const response = await request(app)
            .put(`/users/update/${newUser.id}`)
            .send(updatedUser);
        expect(response.status).toBe(200);
        expect(response.body.age).toEqual(45);
    });
});

describe('DELETE /users/delete/:id', () => {
    test('should delete a user', async () => {
        const user = { name: 'User 1', age: 30 };
        const newUser = await User.create(user);
        const response = await request(app).delete(`/users/delete/${newUser.id}`);
        expect(response.status).toBe(200);
    });
});

