const request = require('supertest');
const app = require('../../server/server');
const prisma = require('../../data/prisma');
const uuid = require('uuid');
const messages = require('../../constants/messages');
const { exec } = require("child_process");

const user = {
  id: uuid.v4(),
  name: 'Henrique',
  lastname: 'Silva',
  birth: new Date(),
  phone: '3232514364',
  email: 'henriquess@gmail.com',
  password: '12345',
  status: true,
};

const admin = {
  email: "admin@gmail.com",
  password:"admin"
}



describe('Test app server ', () => {
  it('should get main route', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message');
  });
});

describe('User routes ', () => {
  // beforeAll(async () => {
  //   await prisma.user.deleteMany({}).then(() => {
  //     exec("yarn seed");
  //   }).catch((error)=>{console.log(error)});
  // });

  it('should get users', async () => {
    const authorized = await request(app).post('/auth').send(admin)
    const res = await request(app).get('/users').set('authorization',authorized.body.token);
    expect(res.statusCode).toEqual(200);
  });

  it('should create a user', async () => {
    const authorized = await request(app).post('/auth').send(admin)

    const res = await request(app).post('/users').send(user).set('authorization',authorized.body.token);
    expect(res.statusCode).toEqual(201);
  });

  it('should find a user', async () => {
    const authorized = await request(app).post('/auth').send(admin)

    const users = await request(app).get('/users').set('authorization',authorized.body.token);;
    const userToBeFound =
      users.body[Math.floor(Math.random() * (users.body.length - 1)) + 0];
    const res = await request(app).get(`/users/${userToBeFound.id}`).set('authorization',authorized.body.token);;
   
    expect(res.statusCode).toEqual(200);
    expect(res.body.name).toBe(userToBeFound.name);
    expect(res.body.id).toBe(userToBeFound.id);
    expect(res.body.lastname).toBe(userToBeFound.lastname);
    expect(res.body.phone).toBe(userToBeFound.phone);
    expect(res.body.email).toBe(userToBeFound.email);
  });

  it('shouldnt find a user', async () => {
    const authorized = await request(app).post('/auth').send(admin)

    const res = await request(app).get(`/users/user_id`).set('authorization',authorized.body.token);;
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe(messages.userIdInvalid);
  });
});
