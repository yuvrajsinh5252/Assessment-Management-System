const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const USERS_FILE = path.join(__dirname, '../../data/users.json');

function ensureUsersFile() {
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify([]));
  }
}

function readUsers() {
  ensureUsersFile();
  const raw = fs.readFileSync(USERS_FILE, 'utf-8');
  return JSON.parse(raw);
}

function writeUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

async function createUser({ name, email, password }) {
  const users = readUsers();
  const existing = users.find((user) => user.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    throw new Error('A user with this email already exists.');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = {
    id: `user_${Date.now()}`,
    name,
    email,
    password: hashedPassword,
    createdAt: new Date().toISOString(),
  };

  users.push(user);
  writeUsers(users);

  const { password: _password, ...safeUser } = user;
  return safeUser;
}

async function validateUser({ email, password }) {
  const users = readUsers();
  const user = users.find((candidate) => candidate.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw new Error('Invalid credentials');
  }

  const { password: _password, ...safeUser } = user;
  return safeUser;
}

module.exports = {
  createUser,
  validateUser,
};
