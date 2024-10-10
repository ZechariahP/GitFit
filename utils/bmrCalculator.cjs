const calculateBMR = (height, weight, dob) => {
    const age = new Date().getFullYear() - new Date(dob).getFullYear();
    // Using Mifflin-St Jeor Equation for BMR calculation
    const bmr = 10 * weight + 6.25 * height - 5 * age + 5; // For men
    // const bmr = 10 * weight + 6.25 * height - 5 * age - 161; // For women
    return bmr;
  };
  
  module.exports = { calculateBMR };