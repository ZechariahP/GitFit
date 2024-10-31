const { neon } = require('@neondatabase/serverless');
const sql = neon(process.env.DATABASE_URL);

// Get food progress data by date
const getFoodProgressByDate = async (req, res) => {
  const { date } = req.params;
  const { user_id } = req.query;

  try {
    const result = await sql`SELECT * FROM food_progress WHERE date = ${date} AND user_id = ${user_id}`;
    res.json(result);
  } catch (error) {
    console.error('Error fetching food progress data:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get exercise progress data by date
const getExerciseProgressByDate = async (req, res) => {
  const { date } = req.params;
  const { user_id } = req.query;

  try {
    const result = await sql`SELECT * FROM exercise_progress WHERE date = ${date} AND user_id = ${user_id}`;
    res.json(result);
  } catch (error) {
    console.error('Error fetching exercise progress data:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add food progress entry
const addFoodProgressEntry = async (req, res) => {
  const { date, food, calories, fat, protein, sodium, carbs } = req.body;

  // Validate the request payload
  if (!date || !food) {
    console.error('Invalid request payload:', req.body); // Debugging log
    return res.status(400).json({ message: 'Invalid request payload' });
  }

  try {
    const result = await sql`
      INSERT INTO food_progress (date, food, calories, fat, protein, sodium, carbs)
      VALUES (${date}, ${food}, ${calories}, ${fat}, ${protein}, ${sodium}, ${carbs})
      RETURNING *`;
    res.json(result[0]);
  } catch (error) {
    console.error('Error adding food progress entry:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Add exercise progress entry
const addExerciseProgressEntry = async (req, res) => {
  const { date, exercise, duration, caloriesBurned } = req.body;

  try {
    const result = await sql`
      INSERT INTO exercise_progress (date, exercise, duration, caloriesBurned)
      VALUES (${date}, ${exercise}, ${duration}, ${caloriesBurned})
      RETURNING *`;
    res.json(result[0]);
  } catch (error) {
    console.error('Error adding exercise progress entry:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

module.exports = {
  getFoodProgressByDate,
  getExerciseProgressByDate,
  addFoodProgressEntry,
  addExerciseProgressEntry,
};