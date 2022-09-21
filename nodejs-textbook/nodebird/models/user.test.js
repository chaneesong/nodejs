const Sequelize = require('sequelize');
const User = require('./user');
const config = require('../config/config')['test'];
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

describe('User model', () => {
  test('static init method 호출', () => {
    expect(User.init(sequelize)).toBe(User);
  });
  test('static associate method 호출', () => {
    const db = {
      User: {
        hasMany: jest.fn(),
        belongsToMany: jest.fn(),
      },
      Post: {},
    };
    User.associate(db);
    expect(db.User.hasMany).toBeCalledWith(db.Post);
    expect(db.User.belongsToMany).toHaveBeenCalledTimes(3);
  });
});