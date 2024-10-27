const express = require('express');
const router = express.Router();
const { neon } = require('@neondatabase/serverless');
const sql = neon(process.env.DATABASE_URL);
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Define routes for general API
router.get('/', (req, res) => {
  res.send('API is running');
});

// Define routes for fetching all users
router.get('/users', async (req, res) => {
  try {
    const result = await sql`SELECT * FROM users`;
    res.json(result);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Define routes for BMR data
router.get('/bmr', async (req, res) => {
  try {
    const result = await sql`SELECT bmr FROM users WHERE id = 1`; // Adjust query as needed
    res.json({ bmr: result[0].bmr });
  } catch (error) {
    console.error('Error fetching BMR data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Define login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await sql`SELECT * FROM users WHERE email = ${email}`;
    if (result.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = result[0];
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { id: user.id, firstName: user.firstName, email: user.email } });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Define register route
router.post('/register', async (req, res) => {
  const { firstName, email, password, dob, height, weight, gender } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    // Parse height and weight as integers
    const parsedHeight = parseInt(height, 10);
    const parsedWeight = parseInt(weight, 10);

    // Calculate age
    const birthDate = new Date(dob);
    const age = new Date().getFullYear() - birthDate.getFullYear();

    // Calculate BMR using Mifflin-St Jeor Equation
    let bmr;
    if (gender === 'male') {
      bmr = 10 * parsedWeight + 6.25 * parsedHeight - 5 * age + 5;
    } else {
      bmr = 10 * parsedWeight + 6.25 * parsedHeight - 5 * age - 161;
    }

    const result = await sql`
      INSERT INTO users (firstName, email, password, dob, height, weight, bmr) 
      VALUES (${firstName}, ${email}, ${hashedPassword}, ${dob}, ${parsedHeight}, ${parsedWeight}, ${bmr}) 
      RETURNING *`;
    res.json(result[0]);
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Define routes for food progress data
router.get('/progress/food/:date', async (req, res) => {
  const { date } = req.params;
  try {
    const result = await sql`SELECT * FROM food_progress WHERE date = ${date}`;
    res.json(result);
  } catch (error) {
    console.error('Error fetching food progress data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/progress/food', async (req, res) => {
  const { food, calories, fat, protein, sodium, carbs, date } = req.body;
  try {
    const result = await sql`
      INSERT INTO food_progress (food, calories, fat, protein, sodium, carbs, date) 
      VALUES (${food}, ${calories}, ${fat}, ${protein}, ${sodium}, ${carbs}, ${date}) 
      RETURNING *`;
    res.json(result[0]);
  } catch (error) {
    console.error('Error adding food entry:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/progress/food/:date/:id', async (req, res) => {
  const { date, id } = req.params;
  try {
    await sql`DELETE FROM food_progress WHERE date = ${date} AND id = ${id}`;
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting food entry:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Define routes for exercise progress data
router.get('/progress/exercise/:date', async (req, res) => {
  const { date } = req.params;
  try {
    const result = await sql`SELECT * FROM exercise_progress WHERE date = ${date}`;
    res.json(result);
  } catch (error) {
    console.error('Error fetching exercise progress data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/progress/exercise', async (req, res) => {
  const { exercise, duration, caloriesBurned, date } = req.body;
  try {
    const result = await sql`
      INSERT INTO exercise_progress (exercise, duration, caloriesBurned, date) 
      VALUES (${exercise}, ${duration}, ${caloriesBurned}, ${date}) 
      RETURNING *`;
    res.json(result[0]);
  } catch (error) {
    console.error('Error adding exercise entry:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/progress/exercise/:date/:id', async (req, res) => {
  const { date, id } = req.params;
  try {
    await sql`DELETE FROM exercise_progress WHERE date = ${date} AND id = ${id}`;
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting exercise entry:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;