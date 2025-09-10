const { User } = require('../models');

async function createUser(data) {
  return await User.create(data);
}

async function getUserByEmail(email) {
  return await User.findOne({ where: { email } });
}

async function getAllUsers(filters) {
  return await User.findAll({ where: filters });
}

async function updateUserPassword(id, password) {
  const user = await User.findByPk(id);
  if (!user) throw new Error("User not found");
  user.password = password;
  return await user.save();
}

module.exports = {
  createUser,
  getUserByEmail,
  getAllUsers,
  updateUserPassword,
};
