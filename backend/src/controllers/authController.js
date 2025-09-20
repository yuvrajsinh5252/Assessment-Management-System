const jwt = require('jsonwebtoken');
const { createUser, validateUser } = require('../services/userService');

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key';
const TOKEN_EXPIRY = '2h';

function createToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      name: user.name,
      email: user.email,
    },
    JWT_SECRET,
    { expiresIn: TOKEN_EXPIRY }
  );
}

async function signup(req, res) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    const user = await createUser({ name, email, password });
    const token = createToken(user);

    res.status(201).json({ user, token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await validateUser({ email, password });
    const token = createToken(user);

    res.json({ user, token });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
}

module.exports = {
  signup,
  login,
};
