const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

const registerUser = async (userData) => {
  const { username, email, password } = userData;
  
  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new Error('Usuario já existe com esse email');
  }

  const user = new User({
    username,
    email,
    password
  });

  await user.save();

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });

  return {
    _id: user._id,
    username: user.username,
    email: user.email,
    token
  };
};

const loginUser = async (email, password) => {
  const user = await User.findOne({ email });

  console.log('user', user);

  if (!user) {
    throw new Error('Credencial inválida');
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    throw new Error('Credencial inválida');
  }

  // Generate token
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });

  return {
    _id: user._id,
    username: user.username,
    email: user.email,
    token
  };
};

module.exports = {
  registerUser,
  loginUser
};