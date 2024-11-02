const { neon } = require('@neondatabase/serverless');
const sql = neon(process.env.DATABASE_URL);

// Get food progress data by date and user_id
const getFoodProgressByDate = async (req, res) => {
  const { date } = req.params;


  try {
    const result = await sql`SELECT * FROM food_progress WHERE date = ${date}`;
    res.json(result);
  } catch (error) {
    console.error('Error fetching food progress data:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get exercise progress data by date and user_id
const getExerciseProgressByDate = async (req, res) => {
  const { date } = req.params;

  try {
    const result = await sql`SELECT * FROM exercise_progress WHERE date = ${date}`;
    res.json(result);
  } catch (error) {
    console.error('Error fetching exercise progress data:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add food progress entry
const addFoodProgressEntry = async (req, res) => {
  const { date, food, calories, fat, protein, sodium, carbs, user_id } = req.body;

  try {
    const result = await sql`
      INSERT INTO food_progress (date, food, calories, fat, protein, sodium, carbs, user_id)
      VALUES (${date}, ${food}, ${calories}, ${fat}, ${protein}, ${sodium}, ${carbs}, ${user_id})
      RETURNING *`;
    res.json(result[0]);
  } catch (error) {
    console.error('Error adding food progress entry:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Add exercise progress entry
const addExerciseProgressEntry = async (req, res) => {
  const { date, exercise, duration, caloriesBurned, user_id } = req.body;

  try {
    const result = await sql`
      INSERT INTO exercise_progress (date, exercise, duration, calories_burned, user_id)
      VALUES (${date}, ${exercise}, ${duration}, ${caloriesBurned}, ${user_id})
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