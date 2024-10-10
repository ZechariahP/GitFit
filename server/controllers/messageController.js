const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { calculateBMR } = require('../../utils/bmrCalculator.cjs');

const users = []; // In-memory user storage for simplicity. Use a database in production.

const getMessage = (req, res) => {
  res.send('Hello from the backend!');
};

const registerUser = async (req, res) => {
  const { firstName, email, password, dob, height, weight } = req.body;

  if (!firstName || !email || !password || !dob || !height || !weight) {
    return res.status(400).json({ message: 'First name, email, password, date of birth, height, and weight are required' });
  }

  const userExists = users.find(user => user.email === email);

  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // Calculate BMR
  const bmr = calculateBMR(height, weight, dob);

  // Save user to mock database
  const newUser = { firstName, email, password: hashedPassword, dob, height, weight, bmr };
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

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user.email }, 'your_jwt_secret', { expiresIn: '1h' });

  res.status(200).json({ message: 'Login successful', token, user });
};

const refreshToken = (req, res) => {
  res.status(200).json({ message: 'Token refreshed' });
};

module.exports = { getMessage, registerUser, loginUser, refreshToken };