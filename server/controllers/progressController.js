const { neon } = require('@neondatabase/serverless');
const sql = neon(process.env.DATABASE_URL);

// Get food progress data by date
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

// Get exercise progress data by date
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
  const { date, foodEntries } = req.body;

  try {
    const result = await sql`
      INSERT INTO food_progress (date, food, calories, fat, protein, sodium, carbs)
      VALUES ${sql(foodEntries.map(entry => [date, entry.foodName, entry.calories, entry.fat, entry.protein, entry.sodium, entry.carbs]))}
      RETURNING *`;
    res.json(result);
  } catch (error) {
    console.error('Error adding food progress entry:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add exercise progress entry
const addExerciseProgressEntry = async (req, res) => {
  const { date, exerciseEntries } = req.body;

  try {
    const result = await sql`
      INSERT INTO exercise_progress (date, exercise, duration, caloriesBurned)
      VALUES ${sql(exerciseEntries.map(entry => [date, entry.exercise, entry.duration, entry.caloriesBurned]))}
      RETURNING *`;
    res.json(result);
  } catch (error) {
    console.error('Error adding exercise progress entry:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getFoodProgressByDate,
  getExerciseProgressByDate,
  addFoodProgressEntry,
  addExerciseProgressEntry,
};