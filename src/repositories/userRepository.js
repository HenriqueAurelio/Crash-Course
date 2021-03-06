const prisma = require('../data/prisma');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
class userRepository {
  async generateJWTToken(id) {
    const token = jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    });
    return token;
  }
  async index(request) {
    const users = await prisma.user.findMany();
    return users;
  }

  async store(request) {
    const { name, lastname, birth, phone, email, status, password } = request;
    let hashedPassword = bcrypt.hashSync(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        lastname,
        birth,
        phone,
        email,
        authentication: {
          create: {
            status,
            password: hashedPassword
          }
        }
      }
    });
    return user;
  }

  async show(id) {
    const user = await prisma.user.findUnique({
      where: { id },
      include: { authentication: true }
    });
    return user;
  }

  async findByEmail(email) {
    const userExists = await prisma.user.findUnique({ where: { email } });
    return userExists;
  }

  async findById(id) {
    const userExists = await prisma.user.findUnique({ where: { id } });
    return userExists;
  }

  async update(id, request) {
    const { name, lastname, birth, phone, email, status, password } = request;
    let hashedPassword = bcrypt.hashSync(password, 10);

    const user = await prisma.user.update({
      where: { id },
      data: {
        name,
        lastname,
        birth,
        phone,
        email,
        authentication: {
          create: {
            status,
            password: hashedPassword
          }
        }
      },
      include: { authentication: true }
    });
    return user;
  }

  async delete(id) {
    await prisma.user.delete({ where: { id } });
  }
}

module.exports = new userRepository();
