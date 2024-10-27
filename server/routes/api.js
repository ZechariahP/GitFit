const express = require('express');
const router = express.Router();
const { getMessage, registerUser, loginUser, refreshToken } = require('../controllers/messageController');
const { getFoodProgressByDate, getExerciseProgressByDate, addProgressEntry, deleteFoodEntry, deleteExerciseEntry } = require('../controllers/progressController');

// Define routes
router.get('/', getMessage);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/refresh-token', refreshToken);

// Define routes for food progress data
router.get('/progress/food/:date', getFoodProgressByDate);
router.post('/progress/food', addProgressEntry);
router.delete('/progress/food/:date/:id', deleteFoodEntry);

// Define routes for exercise progress data
router.get('/progress/exercise/:date', getExerciseProgressByDate);
router.post('/progress/exercise', addProgressEntry);
router.delete('/progress/exercise/:date/:id', deleteExerciseEntry);

module.exports = router;