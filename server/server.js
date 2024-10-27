const express = require('express');
const cors = require('cors');
const apiRouter = require('./routes/api');

const app = express();
const port = 5000;

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

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});