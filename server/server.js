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

app.post('/api/register', async (req, res) => {
  const { firstName, email, password, dob, height, weight, gender } = req.body;
  try {
    // Calculate BMR (Basal Metabolic Rate) based on user details
    let bmr;
    if (gender === 'male') {
      bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * (new Date().getFullYear() - new Date(dob).getFullYear()));
    } else {
      bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * (new Date().getFullYear() - new Date(dob).getFullYear()));
    }

    // Insert the new user into the database
    const result = await sql`
      INSERT INTO users (firstname, email, password, dob, height, weight, gender, bmr)
      VALUES (${firstName}, ${email}, ${password}, ${dob}, ${height}, ${weight}, ${gender}, ${bmr})
      RETURNING id, firstname, email, bmr
    `;

    console.log('SQL Insert Result:', result); // Debugging statement

    const user = result[0];
    res.json(user);
  } catch (error) {
    console.error('Error registering user:', error);
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