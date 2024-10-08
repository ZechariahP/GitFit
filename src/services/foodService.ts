const API_KEY = 'efdb49bc1amshce946bcdffcbae3p13da85jsn099f2670d519';
const API_HOST = 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com';

export const fetchFoodData = async (food: string) => {
  const response = await fetch(`https://${API_HOST}/food/ingredients/search?query=${food}`, {
    method: 'GET',
    headers: {
      'x-rapidapi-key': API_KEY,
      'x-rapidapi-host': API_HOST,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch food data');
  }

  const data = await response.json();
  return data;
};

export const fetchFoodSuggestions = async (query: string) => {
  const response = await fetch(`https://${API_HOST}/recipes/autocomplete?number=10&query=${query}`, {
    method: 'GET',
    headers: {
      'x-rapidapi-key': API_KEY,
      'x-rapidapi-host': API_HOST,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch food suggestions');
  }

  const data = await response.json();
  return data;
};