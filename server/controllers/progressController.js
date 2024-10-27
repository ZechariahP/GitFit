const fs = require('fs');
const path = require('path');

// Paths to the JSON files where progress data is stored
const foodDataFilePath = path.join(__dirname, '../data/progressDataFood.json');
const exerciseDataFilePath = path.join(__dirname, '../data/progressDataExercise.json');

// Get food progress data by date
const getFoodProgressByDate = (req, res) => {
  const { date } = req.params;

  fs.readFile(foodDataFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading food data file:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    const progressData = JSON.parse(data);
    const foodEntries = progressData[date] || [];
    res.json(foodEntries);
  });
};

// Get exercise progress data by date
const getExerciseProgressByDate = (req, res) => {
  const { date } = req.params;

  fs.readFile(exerciseDataFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading exercise data file:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    const progressData = JSON.parse(data);
    const exerciseEntries = progressData[date] || [];
    res.json(exerciseEntries);
  });
};

// Add progress entry
const addProgressEntry = (req, res) => {
  const { date, foodEntries, exerciseEntries } = req.body;

  if (foodEntries && foodEntries.length > 0) {
    fs.readFile(foodDataFilePath, 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading food data file:', err);
        return res.status(500).json({ message: 'Server error' });
      }

      const progressData = JSON.parse(data);
      if (!progressData[date]) {
        progressData[date] = [];
      }

      progressData[date].push(...foodEntries);

      fs.writeFile(foodDataFilePath, JSON.stringify(progressData, null, 2), (err) => {
        if (err) {
          console.error('Error writing to food data file:', err);
          return res.status(500).json({ message: 'Server error' });
        }
      });
    });
  }

  if (exerciseEntries && exerciseEntries.length > 0) {
    fs.readFile(exerciseDataFilePath, 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading exercise data file:', err);
        return res.status(500).json({ message: 'Server error' });
      }

      const progressData = JSON.parse(data);
      if (!progressData[date]) {
        progressData[date] = [];
      }

      progressData[date].push(...exerciseEntries);

      fs.writeFile(exerciseDataFilePath, JSON.stringify(progressData, null, 2), (err) => {
        if (err) {
          console.error('Error writing to exercise data file:', err);
          return res.status(500).json({ message: 'Server error' });
        }
      });
    });
  }

  res.status(200).json({ message: 'Progress entry added successfully' });
};

// Delete food entry by ID
const deleteFoodEntry = (req, res) => {
  const { date, id } = req.params;

  fs.readFile(foodDataFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading food data file:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    const progressData = JSON.parse(data);
    if (progressData[date]) {
      progressData[date] = progressData[date].filter(entry => entry.id !== parseInt(id, 10));
    }

    fs.writeFile(foodDataFilePath, JSON.stringify(progressData, null, 2), (err) => {
      if (err) {
        console.error('Error writing to food data file:', err);
        return res.status(500).json({ message: 'Server error' });
      }

      res.status(200).json({ message: 'Food entry deleted successfully' });
    });
  });
};

// Delete exercise entry by ID
const deleteExerciseEntry = (req, res) => {
  const { date, id } = req.params;

  fs.readFile(exerciseDataFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading exercise data file:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    const progressData = JSON.parse(data);
    if (progressData[date]) {
      progressData[date] = progressData[date].filter(entry => entry.id !== parseInt(id, 10));
    }

    fs.writeFile(exerciseDataFilePath, JSON.stringify(progressData, null, 2), (err) => {
      if (err) {
        console.error('Error writing to exercise data file:', err);
        return res.status(500).json({ message: 'Server error' });
      }

      res.status(200).json({ message: 'Exercise entry deleted successfully' });
    });
  });
};

module.exports = {
  getFoodProgressByDate,
  getExerciseProgressByDate,
  addProgressEntry,
  deleteFoodEntry,
  deleteExerciseEntry,
};