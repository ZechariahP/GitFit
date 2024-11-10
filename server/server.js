require('dotenv').config();
const express = require('express');
const cors = require('cors');
const apiRouter = require('./routes/api');
const { neon } = require('@neondatabase/serverless');

const app = express();
const port = process.env.PORT || 5000;

const corsOptions = {
  credentials: true,
  origin: 'https://gitfit-fitnesstracker.netlify.app', // Update this to your Netlify URL
};

// Configure CORS
app.use(cors(corsOptions));

// Middleware to parse JSON bodies
app.use(express.json());

// Use API routes
app.use('/api', apiRouter);

const sql = neon(process.env.DATABASE_URL);

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    // Query the database to find the user with the provided email and password
    const result = await sql`
      SELECT id, firstname, email
      FROM users
      WHERE email = ${email} AND password = ${password}
    `;

    console.log('SQL Query Result:', result); // Debugging statement

    if (result.length > 0) {
      // User found, return user data
      const user = result[0];
      res.json(user);
    } else {
      // User not found, return an error
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/version', async (req, res) => {
  try {
    const result = await sql`SELECT version()`;
    const { version } = result[0];
    res.status(200).json({ version });
  } catch (error) {
    console.error('Error fetching database version:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});