const request = require('supertest');
const app = require('./src/app');
const db = require('./db/connection');
const User = require('./models/User');
const Fruit = require('./models/Fruit');

beforeAll(async () => {
    await db.sync();
});

beforeEach(async () => {
    await User.destroy({ where: {} });
    await Fruit.destroy({ where: {} });
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

    test('should return an error if name is missing', async () => {
        const user = { age: 30 };
        const response = await request(app)
            .post('/users/add')
            .send(user);
        expect(response.status).toBe(400);
        expect(response.body.errors[0].msg).toEqual('Name is required');
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

describe('POST /fruits/add', () => {
    test('should create a new fruit', async () => {
        const fruit = { name: 'Grapefruit', color: 'Red' };
        const response = await request(app)
            .post('/fruits/add')
            .send(fruit);
        expect(response.status).toBe(201);
        expect(response.body.color).toEqual('Red');
    });

    test('should return an error if name is missing', async () => {
        const fruit = { name: '', color: 'Red' };
        const response = await request(app)
            .post('/fruits/add')
            .send(fruit);
        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
        const errorMessages = response.body.errors.map(err => err.msg);
        expect(errorMessages).toContain('Name is required');
    });
});
