var users = require('../mock/users');
class fakeUserRepository {
  async index() {
    const listOfUsers = users;
    return listOfUsers;
  }

  async store(userRequest) {
    const user = {
      name: userRequest.name,
      lastname: userRequest.lastname,
      phone: userRequest.phone,
      email: userRequest.email,
    };
    users.push(user);
    return user;
  }

  async show(id) {
    const user = users.find((user) => user.id === id);
    return user;
  }

  async findByEmail(email) {
    const user = users.find((user) => user.email === email);
    return user;
  }

  async findById(id) {
    const user = users.find((user) => user.id === id);
    return user;
  }
  async update(id, userRequest) {
    const { name, lastname, phone, email, birth, password, status } = userRequest;
    users = users.map((user) => {
      if (user.id === id) return { ...user, name, lastname, phone, email, birth };
      return user;
    });
    return users.find((x) => x.id == id);
  }
  async delete(id) {
    const indexOfUser = users.findIndex((user) => {
      return user.id === id;
    });
    users.splice(indexOfUser, 1);
    return users;
  }
}
module.exports = new fakeUserRepository();
