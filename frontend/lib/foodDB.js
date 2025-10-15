// Rough nutrition per 100g estimates
export const FOOD_DB = [
  { keys: ["chicken breast", "grilled chicken", "chicken"], kcal: 165, protein: 31, carbs: 0, fat: 3.6 },
  { keys: ["salmon", "grilled salmon"], kcal: 208, protein: 20, carbs: 0, fat: 13 },
  { keys: ["steak", "beef"], kcal: 250, protein: 26, carbs: 0, fat: 17 },
  { keys: ["egg", "scrambled eggs", "omelette"], kcal: 155, protein: 13, carbs: 1.1, fat: 11 },
  { keys: ["rice", "white rice"], kcal: 130, protein: 2.4, carbs: 28, fat: 0.3 },
  { keys: ["brown rice"], kcal: 123, protein: 2.6, carbs: 25.6, fat: 1 },
  { keys: ["pasta"], kcal: 131, protein: 5, carbs: 25, fat: 1.1 },
  { keys: ["bread"], kcal: 265, protein: 9, carbs: 49, fat: 3.2 },
  { keys: ["banana"], kcal: 89, protein: 1.1, carbs: 23, fat: 0.3 },
  { keys: ["apple"], kcal: 52, protein: 0.3, carbs: 14, fat: 0.2 },
  { keys: ["avocado"], kcal: 160, protein: 2, carbs: 9, fat: 15 },
  { keys: ["broccoli"], kcal: 55, protein: 3.7, carbs: 11.2, fat: 0.6 },
  { keys: ["salad", "mixed greens", "lettuce"], kcal: 20, protein: 1.5, carbs: 3.5, fat: 0.2 },
  { keys: ["pizza"], kcal: 266, protein: 11, carbs: 33, fat: 10 },
  { keys: ["burger", "cheeseburger"], kcal: 295, protein: 17, carbs: 30, fat: 13 },
  { keys: ["fries"], kcal: 312, protein: 3.4, carbs: 41, fat: 15 },
  { keys: ["sushi"], kcal: 140, protein: 7, carbs: 28, fat: 2 }
];

export function matchFood(label) {
  const lower = label.toLowerCase();
  let best = null, score = 0;
  for (const item of FOOD_DB) {
    for (const k of item.keys) {
      if (lower.includes(k)) {
        const s = k.length;
        if (s > score) { best = item; score = s; }
      }
    }
  }
  return best;
}
