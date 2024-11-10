require('dotenv').config();
const express = require('express');
const cors = require('cors');
const apiRouter = require('./routes/api');
const { neon } = require('@neondatabase/serverless');

const app = express();
const port = process.env.PORT || 4000;

const corsOptions = {
  credentials: true,
  origin: 'http://localhost:5173',
};

// Configure CORS
app.use(cors(corsOptions));

// Middleware to parse JSON bodies
app.use(express.json());

// Use API routes
app.use('/api', apiRouter);

app.use('/', express.static('public'))

const sql = neon(process.env.DATABASE_URL);

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