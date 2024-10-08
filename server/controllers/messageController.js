const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const users = []; // In-memory user storage for simplicity. Use a database in production.

const getMessage = (req, res) => {
  res.send('Hello from the backend!');
};

const registerUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const userExists = users.find(user => user.email === email);

  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = { email, password: hashedPassword };
  users.push(newUser);

  res.status(201).json({ message: 'User registered successfully', user: newUser });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const user = users.find(user => user.email === email);

  if (!user) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  const accessToken = jwt.sign({ email: user.email }, 'your_jwt_secret', { expiresIn: '15m' });
  const refreshToken = jwt.sign({ email: user.email }, 'your_jwt_refresh_secret', { expiresIn: '7d' });

  res.status(200).json({ accessToken, refreshToken });
};

const refreshToken = (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ message: 'Token is required' });
  }

  jwt.verify(token, 'your_jwt_refresh_secret', (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }

    const accessToken = jwt.sign({ email: user.email }, 'your_jwt_secret', { expiresIn: '15m' });

    res.status(200).json({ accessToken });
  });
};

module.exports = {
  getMessage,
  registerUser,
  loginUser,
  refreshToken,
};