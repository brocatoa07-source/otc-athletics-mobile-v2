import { Ionicons } from '@expo/vector-icons';

/* ────────────────────────────────────────────────────
 * NUTRITION LIBRARY
 * Game-day fuel, recovery meals, hydration
 * ──────────────────────────────────────────────────── */

export interface NutritionItem {
  name: string;
  detail: string;
  timing?: string;
}

export interface NutritionSection {
  key: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  desc: string;
  items: NutritionItem[];
}

export const NUTRITION_SECTIONS: NutritionSection[] = [
  {
    key: 'Game-Day Timeline',
    icon: 'time-outline',
    color: '#f59e0b',
    desc: 'Hour-by-hour nutrition plan on game days.',
    items: [
      { name: '3-4 Hours Before', detail: 'Full balanced meal: lean protein + complex carbs + veggies. Ex: grilled chicken, rice, steamed broccoli.', timing: 'Pre-game' },
      { name: '1-2 Hours Before', detail: 'Light snack: easily digestible carbs + small protein. Ex: banana + peanut butter, granola bar, or toast with honey.', timing: 'Pre-game' },
      { name: '30 Min Before', detail: 'Quick fuel: a few bites of fruit, handful of pretzels, or a sports drink. Nothing heavy.', timing: 'Pre-game' },
      { name: 'During Game', detail: 'Sip water or sports drink between innings. Small snacks (orange slices, gummy chews) for energy if needed.', timing: 'In-game' },
      { name: 'Within 30 Min After', detail: 'Protein shake or chocolate milk + banana. Start the recovery window immediately.', timing: 'Post-game' },
      { name: '1-2 Hours After', detail: 'Full recovery meal: protein + carbs + healthy fats. Ex: salmon, sweet potato, avocado.', timing: 'Post-game' },
    ],
  },
  {
    key: 'Pre-Game Meals',
    icon: 'flash-outline',
    color: '#22c55e',
    desc: 'Fuel for output. Eat clean, play clean.',
    items: [
      { name: 'Grilled Chicken + White Rice + Broccoli', detail: 'The staple. Lean protein, fast-digesting carbs, micronutrients. 3-4 hrs before game.' },
      { name: 'Turkey Wrap with Avocado', detail: 'Whole wheat tortilla, sliced turkey, avocado, spinach. Easy to eat on the go.' },
      { name: 'Oatmeal + Banana + Honey + Protein', detail: 'Morning game fuel. Slow-release energy with quick sugar from honey and banana.' },
      { name: 'Pasta + Lean Ground Turkey + Marinara', detail: 'Carb-heavy for sustained energy. Keep portions moderate, not stuffed.' },
      { name: 'Eggs + Toast + Fruit', detail: 'Simple breakfast option. 3 eggs, whole grain toast, berries or an apple.' },
      { name: 'PB&J on Whole Wheat', detail: 'Classic for a reason. Quick, portable, balanced macros. Great 1-2 hrs before.' },
    ],
  },
  {
    key: 'Post-Game Recovery',
    icon: 'medkit-outline',
    color: '#3b82f6',
    desc: 'Rebuild muscle, replenish glycogen, reduce inflammation.',
    items: [
      { name: 'Chocolate Milk', detail: 'Proven recovery drink. 3:1 carb-to-protein ratio. Drink within 30 min post-game.' },
      { name: 'Protein Shake + Banana', detail: '30-40g whey protein + banana for quick glycogen replenishment.' },
      { name: 'Salmon + Sweet Potato + Greens', detail: 'Omega-3s reduce inflammation, sweet potato reloads glycogen, greens for vitamins.' },
      { name: 'Steak + Rice + Avocado', detail: 'Iron, creatine, complex carbs, healthy fats. Full rebuild meal.' },
      { name: 'Greek Yogurt + Granola + Berries', detail: 'Quick option. High protein, antioxidants, and carbs.' },
      { name: 'Chicken Stir-Fry with Veggies', detail: 'Lean protein + variety of veggies + rice. Anti-inflammatory spices like turmeric and ginger.' },
    ],
  },
  {
    key: 'Hydration',
    icon: 'water-outline',
    color: '#06b6d4',
    desc: 'Dehydration = slower reaction time, less power, more injuries.',
    items: [
      { name: 'Daily Baseline', detail: 'Drink half your bodyweight in ounces daily. 180 lbs = 90 oz minimum.' },
      { name: 'Game Day', detail: 'Add 16-20 oz on top of baseline. Start hydrating the night before.' },
      { name: 'Electrolytes', detail: 'Add electrolytes (LMNT, Liquid IV, Pedialyte) on training and game days. Sodium, potassium, magnesium.' },
      { name: 'Signs of Dehydration', detail: 'Dark urine, headache, fatigue, cramping, dizziness. If you feel thirsty, you are already behind.' },
      { name: 'Avoid Before Games', detail: 'No soda, excess caffeine, energy drinks, or high-sugar juices. They spike then crash.' },
      { name: 'Water Timing', detail: '16 oz upon waking. Sip throughout the day. 8-12 oz every 15-20 min during activity.' },
    ],
  },
  {
    key: 'Suggested Meals & Snacks',
    icon: 'restaurant-outline',
    color: '#8b5cf6',
    desc: 'Go-to meals and snacks to keep in your rotation.',
    items: [
      { name: 'Overnight Oats', detail: 'Oats + protein powder + almond milk + chia seeds + berries. Prep night before, grab and go.' },
      { name: 'Turkey & Rice Bowl', detail: 'Ground turkey, jasmine rice, black beans, salsa, avocado. Meal prep staple.' },
      { name: 'Smoothie Bowl', detail: 'Frozen berries + spinach + protein + almond butter + banana. Blend thick, top with granola.' },
      { name: 'Trail Mix (homemade)', detail: 'Almonds, cashews, dark chocolate chips, dried cranberries. Portable energy between games.' },
      { name: 'Hard-Boiled Eggs + Fruit', detail: 'Quick protein + vitamins. Prep a batch for the week.' },
      { name: 'Chicken Quesadilla', detail: 'Whole wheat tortilla + grilled chicken + cheese + peppers. Quick, balanced, and satisfying.' },
    ],
  },
  {
    key: 'Macro Targets & Body Comp',
    icon: 'analytics-outline',
    color: '#10b981',
    desc: 'How much to eat by goal. Protein, carbs, and fats — dialed in for baseball athletes.',
    items: [
      { name: 'Daily Protein Target', detail: '0.8–1.2g per pound of body weight. 180 lb athlete = 145–215g protein/day. Non-negotiable for muscle repair and growth.' },
      { name: 'Daily Carb Target', detail: '2–3g per pound on training/game days. 1.5–2g on off days. Carbs = energy. Do not cut them during the season.' },
      { name: 'Daily Fat Target', detail: '0.3–0.5g per pound. Focus on healthy sources: avocado, olive oil, nuts, salmon. Supports hormones and joint health.' },
      { name: 'Calorie Range — Gaining Weight', detail: 'Eat 300–500 calories above maintenance. Prioritize protein and carbs. Gain 0.5–1 lb/week. Slow and steady wins.' },
      { name: 'Calorie Range — Maintaining', detail: 'Bodyweight (lbs) × 15–17 = rough maintenance calories. Adjust based on activity level and body response.' },
      { name: 'Calorie Range — Leaning Out', detail: 'Cut 300–500 below maintenance. Keep protein HIGH (1g/lb+). Reduce fats slightly, keep carbs around training. Lose slow, stay strong.' },
      { name: 'Body Comp for Baseball', detail: 'Baseball rewards functional mass, not bodybuilder aesthetics. Gain muscle that moves — priority is power-to-weight ratio, not abs.' },
      { name: 'Weighing Yourself', detail: 'Weigh first thing in the morning, same conditions. Track weekly average, not daily fluctuations. Trends matter, not single days.' },
    ],
  },
  {
    key: 'Supplement Guidance',
    icon: 'flask-outline',
    color: '#6366f1',
    desc: 'Evidence-based supplements. No gimmicks. What actually works for teenage and college athletes.',
    items: [
      { name: 'Creatine Monohydrate', detail: '3–5g/day, every day. Most researched supplement in sports science. Improves power output, recovery, and lean mass. Safe for teens 16+.' },
      { name: 'Whey Protein Powder', detail: '1 scoop (25–30g) post-workout or when you can\'t get a real meal. Not a meal replacement — it\'s a convenience tool.' },
      { name: 'Electrolytes', detail: 'LMNT, Liquid IV, or Pedialyte on training and game days. Sodium, potassium, magnesium. Critical in heat. Don\'t just drink water.' },
      { name: 'Vitamin D', detail: '2,000–5,000 IU/day if you\'re not getting regular sun. Most athletes are deficient. Supports bone health, immune function, and testosterone.' },
      { name: 'Fish Oil (Omega-3)', detail: '2–3g/day (EPA + DHA combined). Reduces inflammation, supports joint health, and aids recovery. Take with food.' },
      { name: 'Magnesium', detail: '200–400mg before bed. Improves sleep quality, reduces cramping, supports recovery. Glycinate form is best absorbed.' },
      { name: 'What to AVOID', detail: 'Fat burners, testosterone boosters, pre-workouts with proprietary blends, "mass gainers" with 1,000 cal of sugar. Eat real food first.' },
      { name: 'Caffeine (if used)', detail: '100–200mg, 30 min before training. Coffee or caffeine pill. Don\'t rely on it. Skip on game days if you feel anxious or jittery.' },
    ],
  },
  {
    key: 'Tournament & Travel Nutrition',
    icon: 'airplane-outline',
    color: '#f97316',
    desc: 'How to eat when you\'re away from home. Hotels, road trips, and doubleheaders.',
    items: [
      { name: 'Cooler Essentials', detail: 'Pack: turkey/chicken wraps, PB&J, protein shakes, fruit, trail mix, water bottles, electrolyte packets. Don\'t depend on concession stands.' },
      { name: 'Between-Game Fuel', detail: 'Light and fast: banana + PB, granola bar, rice cake + almond butter, fruit snacks. Nothing heavy. Eat within 15 min of game end.' },
      { name: 'Hotel Breakfast Strategy', detail: 'Eggs, oatmeal, fruit, toast, yogurt — hit the buffet with purpose. Load up on protein and carbs. Skip the pastries and sugary cereal.' },
      { name: 'Fast Food — Best Choices', detail: 'Chick-fil-A: grilled nuggets + fruit. Chipotle: bowl with double chicken + rice. Subway: turkey sub on wheat. Make the best call available.' },
      { name: 'Doubleheader Fuel Plan', detail: 'Big breakfast 3 hrs before Game 1. Light snack between games. Recovery shake after Game 1. Full meal after Game 2. Stay ahead of the energy curve.' },
      { name: 'Gas Station Emergency', detail: 'Beef jerky, mixed nuts, banana, Gatorade, protein bar. Avoid chips, candy, and energy drinks. Not ideal but better than nothing.' },
      { name: 'Night-Before Protocol', detail: 'Carb-heavy dinner (pasta, rice, potatoes) the night before a big game. Hydrate with electrolytes. Lights out early — sleep is the best PED.' },
    ],
  },
  {
    key: 'Meal Prep & Budget Fueling',
    icon: 'cart-outline',
    color: '#ec4899',
    desc: 'Eat like a pro on a student budget. Meal prep templates and cheap-but-effective staples.',
    items: [
      { name: 'Sunday Meal Prep (2 hrs)', detail: 'Cook 3 lbs chicken, 4 cups rice, roast 2 trays veggies, hard-boil 12 eggs, prep overnight oats × 5. You\'re set for the week.' },
      { name: 'Budget Protein Sources', detail: 'Eggs ($0.15/ea), canned tuna ($1), chicken thighs ($2/lb), Greek yogurt ($0.80), cottage cheese ($3/tub), ground turkey ($4/lb). Cheap gains.' },
      { name: 'Budget Carb Sources', detail: 'Rice (25 lb bag = $15), oats ($3), potatoes ($4/5lb), pasta ($1/box), bananas ($0.25/ea), bread ($3). Fuel is affordable.' },
      { name: 'Budget Fat Sources', detail: 'Peanut butter ($3), olive oil ($6), eggs, canned sardines ($2), mixed nuts ($6/lb). Don\'t need fancy avocado toast every day.' },
      { name: '5-Minute Meals', detail: 'PB&J + protein shake. Eggs + toast + fruit. Greek yogurt + granola. Canned tuna + rice (microwave). No excuses for skipping meals.' },
      { name: 'Grocery List Template', detail: 'Chicken/turkey, eggs, rice, oats, bread, PB, bananas, frozen veggies, Greek yogurt, pasta, canned tuna, olive oil, mixed nuts, protein powder.' },
      { name: 'Eating at School', detail: 'Pack lunch: wrap + protein + fruit + trail mix. If buying, pick the protein-heavy option. Supplement with a protein bar or shake in your bag.' },
      { name: 'Parent Tip: Stock the Kitchen', detail: 'Keep the pantry loaded with athlete-friendly staples. Make it easy for your kid to eat well. If healthy food is accessible, they\'ll eat it.' },
    ],
  },
];

// Foundation users get the first 3 categories free
export const FREE_CATEGORY_COUNT = 3;
