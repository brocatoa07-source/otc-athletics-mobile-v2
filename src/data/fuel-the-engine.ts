import { Ionicons } from '@expo/vector-icons';

/* ────────────────────────────────────────────────────
 * FUEL THE ENGINE — Static Educational Content
 *
 * Performance Nutrition for Athletes
 * Pure data — no tracking, no logging, no calculators.
 * ──────────────────────────────────────────────────── */

/* ─── Types ──────────────────────────────────────── */

export interface FuelBullet {
  text: string;
  bold?: boolean;
}

export interface FuelCard {
  title: string;
  description?: string;
  intro?: string;
  bullets?: FuelBullet[];
  examples?: string[];
  note?: string;
  /** Visual plate breakdown or swap pairs */
  visual?: string[];
}

export type FuelCategory = 'foundations' | 'real_world';

export interface FuelSection {
  key: FuelSectionKey;
  label: string;
  sub: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  category: FuelCategory;
  intro: string;
  cards: FuelCard[];
}

export type FuelSectionKey =
  | 'daily'
  | 'gameday'
  | 'liftday'
  | 'hydration'
  | 'quick-guide'
  | 'tournament'
  | 'travel'
  | 'recovery-snacks'
  | '6pm-game'
  | 'fuel-mistakes';

/* ─── Section Data ───────────────────────────────── */

export const FUEL_SECTIONS: FuelSection[] = [
  /* ═══════════════════════════════════════════════════
   * FOUNDATIONS
   * ═══════════════════════════════════════════════════ */

  {
    key: 'daily',
    label: 'Daily Fuel Targets',
    sub: 'The big rocks of daily fueling',
    icon: 'nutrition-outline',
    color: '#22c55e',
    category: 'foundations',
    intro:
      'Most athletes underperform because they under-fuel. Your body needs enough protein, enough carbs, and enough total food to support output, recovery, and adaptation.',
    cards: [
      {
        title: 'Protein',
        description: 'Muscle repair and recovery.',
        bullets: [
          { text: '~0.7–1.0 grams per pound of bodyweight daily', bold: true },
          { text: 'Consistent protein intake helps support training adaptation and recovery' },
        ],
        examples: ['Chicken', 'Turkey', 'Lean beef', 'Eggs', 'Greek yogurt', 'Cottage cheese', 'Protein shakes'],
      },
      {
        title: 'Carbohydrates',
        description: 'Primary fuel source for speed, power, lifting, sprinting, throwing, and game output.',
        bullets: [
          { text: 'Athletes typically need more carbs than the general population', bold: true },
          { text: 'Carbs fuel explosive movement and help maintain energy, performance, and nervous system output' },
        ],
        examples: ['Rice', 'Potatoes', 'Pasta', 'Oats', 'Fruit', 'Bagels', 'Cereal', 'Toast'],
      },
      {
        title: 'Fats',
        description: 'Hormone health, recovery support, and energy balance.',
        bullets: [
          { text: 'Fats should support the athlete diet, but should not dominate pre-lift or pre-game meals' },
        ],
        examples: ['Avocado', 'Olive oil', 'Nuts', 'Nut butter', 'Eggs', 'Salmon', 'Fatty fish'],
      },
      {
        title: 'Build a Balanced Plate',
        visual: [
          '½ plate — Carbs',
          '¼ plate — Protein',
          '¼ plate — Fats + Vegetables',
        ],
        note: 'This is a simple starting framework — especially for athletes who overcomplicate nutrition.',
      },
      {
        title: 'Easy Food Swaps',
        visual: [
          'rice ↔ potatoes ↔ pasta',
          'chicken ↔ turkey ↔ lean beef',
          'Greek yogurt ↔ protein shake ↔ eggs',
          'bagel ↔ toast ↔ oats',
          'banana ↔ applesauce ↔ fruit cup',
        ],
      },
    ],
  },

  {
    key: 'gameday',
    label: 'Game Day Fuel',
    sub: 'Before, during, and after competition',
    icon: 'baseball-outline',
    color: '#3b82f6',
    category: 'foundations',
    intro:
      'Game day fuel should help you feel energized, focused, and ready to perform — not heavy, sluggish, or empty.',
    cards: [
      {
        title: 'Pre-Game Meal (2–3 Hours Before)',
        intro: 'Easy digestion · High carb · Moderate protein · Lower fat',
        examples: [
          'Chicken + rice + fruit',
          'Turkey sandwich + pretzels',
          'Pasta + grilled chicken',
          'Bagel + peanut butter + banana',
        ],
      },
      {
        title: '60–90 Minute Pre-Game Snack',
        description: 'Top off energy without heavy digestion.',
        examples: ['Banana', 'Applesauce', 'Granola bar', 'Sports drink', 'Small yogurt', 'Dry cereal', 'Pretzels'],
      },
      {
        title: 'During the Game',
        description: 'Maintain energy during long games, tournaments, and doubleheaders.',
        examples: ['Sports drink', 'Fruit', 'Banana', 'Pretzels', 'Gummies', 'Granola bar', 'Applesauce pouch'],
      },
      {
        title: 'Post-Game Recovery',
        description: 'Replace carbs and begin recovery as soon as possible.',
        bullets: [
          { text: 'Try to refuel within about 60 minutes after the game', bold: true },
        ],
        examples: ['Rice bowl + protein', 'Burrito bowl', 'Chocolate milk', 'Protein shake + banana', 'Sandwich + fruit'],
      },
      {
        title: 'Common Game Day Mistakes',
        bullets: [
          { text: 'Skipping meals' },
          { text: 'Eating too little before first pitch' },
          { text: 'Too much greasy or heavy food right before play' },
          { text: 'No carbs during long days' },
          { text: 'Waiting too long to recover after the game' },
        ],
      },
    ],
  },

  {
    key: 'liftday',
    label: 'Lift Day Fuel',
    sub: 'Fuel strength and power training',
    icon: 'barbell-outline',
    color: '#f59e0b',
    category: 'foundations',
    intro:
      'If you want quality output in the weight room, you need fuel in the system. Under-fueling kills intensity, power, and recovery.',
    cards: [
      {
        title: 'Pre-Lift Fuel (60–120 Minutes Before)',
        description: 'Support explosive training and prevent low energy.',
        examples: ['Oatmeal + fruit', 'Bagel + eggs', 'Yogurt + granola', 'Chicken + rice', 'Toast + peanut butter + banana'],
      },
      {
        title: 'Post-Lift Recovery',
        description: 'Support muscle repair and replenish glycogen.',
        bullets: [
          { text: 'Both protein and carbs matter after training', bold: true },
        ],
        examples: ['Protein shake + banana', 'Chicken + rice bowl', 'Eggs + toast + fruit', 'Yogurt + granola', 'Turkey sandwich + fruit'],
      },
      {
        title: 'Easy Substitutions',
        visual: [
          'oatmeal ↔ bagel ↔ cereal',
          'eggs ↔ Greek yogurt ↔ shake',
          'chicken + rice ↔ turkey sandwich + fruit',
          'banana ↔ applesauce ↔ fruit cup',
        ],
      },
      {
        title: 'Common Lift Day Mistakes',
        bullets: [
          { text: 'Training fasted when output matters' },
          { text: 'Only eating protein and avoiding carbs' },
          { text: 'Under-eating all day' },
          { text: 'Not refueling after training' },
          { text: 'Expecting recovery without enough food' },
        ],
      },
    ],
  },

  {
    key: 'hydration',
    label: 'Hydration & Electrolytes',
    sub: 'Stay fueled and focused',
    icon: 'water-outline',
    color: '#06b6d4',
    category: 'foundations',
    intro:
      'Hydration affects energy, focus, output, recovery, and how you feel under pressure. Most athletes don\'t have a conditioning problem — they have a hydration problem.',
    cards: [
      {
        title: 'Daily Hydration Baseline',
        description: 'Use about ½ your bodyweight in ounces of water per day as a simple baseline.',
        bullets: [
          { text: '180 lb athlete → around 90 oz daily baseline', bold: true },
        ],
        note: 'Needs can go up with heat, sweat rate, long practices, and doubleheaders.',
      },
      {
        title: 'Before Training or Games',
        bullets: [
          { text: 'Drink water consistently during the day' },
          { text: 'Try to get fluids in 60–90 minutes before activity' },
        ],
      },
      {
        title: 'During Training or Games',
        description: 'Use water for normal sessions. Use electrolyte drinks when sessions are long, hot, or high sweat.',
        examples: ['Water', 'Sports drink', 'Electrolyte mix'],
      },
      {
        title: 'After Activity',
        bullets: [
          { text: 'Replace fluids lost through sweat' },
          { text: 'Keep drinking after practice, lifts, and games' },
        ],
      },
      {
        title: 'Hot Weather & Doubleheaders',
        description: 'Hydration needs go up when heat and sweat go up.',
        bullets: [
          { text: 'More water' },
          { text: 'Electrolyte drinks' },
          { text: 'Sodium replacement' },
          { text: 'Consistent sipping between games, innings, and training blocks' },
        ],
      },
      {
        title: 'Signs You\'re Behind',
        bullets: [
          { text: 'Headaches' },
          { text: 'Low energy' },
          { text: 'Cramps' },
          { text: 'Sluggish legs' },
          { text: 'Dry mouth' },
          { text: 'Darker urine' },
          { text: 'Drop in focus' },
        ],
      },
    ],
  },

  /* ═══════════════════════════════════════════════════
   * REAL-WORLD FUELING
   * ═══════════════════════════════════════════════════ */

  {
    key: 'quick-guide',
    label: 'Game Day Quick Guide',
    sub: 'If you only remember one thing',
    icon: 'flash-outline',
    color: '#8b5cf6',
    category: 'real_world',
    intro:
      'When game day gets busy, keep fueling simple. The goal is not perfection. The goal is being ready to perform.',
    cards: [
      {
        title: '3 Simple Rules',
        bullets: [
          { text: 'Eat before the game', bold: true },
          { text: 'Keep carbs in', bold: true },
          { text: 'Recover after', bold: true },
        ],
      },
      {
        title: 'Best Pre-Game Setup',
        bullets: [
          { text: '2–3 hours before: carb-heavy meal + moderate protein' },
          { text: '60–90 minutes before: light snack if needed' },
        ],
      },
      {
        title: 'Best During-Game Options',
        examples: ['Banana', 'Pretzels', 'Sports drink', 'Gummies', 'Granola bar'],
      },
      {
        title: 'Best Post-Game Recovery',
        bullets: [
          { text: 'Protein + carbs' },
          { text: 'Eat within about 60 minutes when possible' },
        ],
      },
      {
        title: 'Keep It Simple',
        bullets: [
          { text: 'Don\'t chase perfection' },
          { text: 'Don\'t try new foods on game day' },
          { text: 'Don\'t show up under-fueled' },
        ],
      },
    ],
  },

  {
    key: 'tournament',
    label: 'Tournament Fueling',
    sub: 'Survive long baseball days',
    icon: 'trophy-outline',
    color: '#ef4444',
    category: 'real_world',
    intro:
      'Tournaments expose bad fueling fast. If you wait until you feel dead, you\'re already late.',
    cards: [
      {
        title: 'Before First Game',
        bullets: [
          { text: 'Eat a real meal 2–3 hours before first game' },
          { text: 'Prioritize carbs + moderate protein' },
        ],
        examples: ['Rice + chicken + fruit', 'Bagel sandwich + banana', 'Oatmeal + fruit + yogurt'],
      },
      {
        title: 'Between Games',
        description: 'Quick digestion · Refill energy · Avoid getting too full.',
        examples: ['Banana', 'Pretzels', 'Applesauce', 'Granola bar', 'Sports drink', 'Half sandwich', 'Fruit snacks'],
      },
      {
        title: 'Long Breaks Between Games',
        description: 'Have a bigger refuel meal if enough time exists.',
        examples: ['Rice bowl', 'Turkey sandwich + fruit', 'Burrito bowl', 'Pasta + chicken'],
      },
      {
        title: 'What Usually Goes Wrong',
        bullets: [
          { text: 'Athletes eat nothing between games' },
          { text: 'Athletes eat junk only' },
          { text: 'Athletes wait until they crash' },
          { text: 'Too much greasy or heavy food mid-day' },
          { text: 'Not enough fluids and sodium' },
        ],
      },
      {
        title: 'Tournament Survival Rule',
        bullets: [
          { text: 'Eat early', bold: true },
          { text: 'Snack often', bold: true },
          { text: 'Sip constantly', bold: true },
        ],
      },
    ],
  },

  {
    key: 'travel',
    label: 'Travel Day Fuel',
    sub: 'Better choices on the road',
    icon: 'car-outline',
    color: '#f97316',
    category: 'real_world',
    intro:
      'Travel is where routines fall apart. The answer is not perfection — it\'s preparation.',
    cards: [
      {
        title: 'Travel Priorities',
        bullets: [
          { text: 'Don\'t go hours without eating' },
          { text: 'Keep fluids with you' },
          { text: 'Choose simple, reliable foods' },
          { text: 'Avoid showing up dehydrated' },
        ],
      },
      {
        title: 'Easy Packable Options',
        examples: [
          'Protein shake', 'Jerky', 'Bagels', 'Fruit', 'Applesauce pouches',
          'Granola bars', 'Trail mix', 'Pretzels', 'Sandwiches', 'Electrolyte packets',
        ],
      },
      {
        title: 'Gas Station / Airport Survival Choices',
        examples: [
          'Water', 'Sports drink', 'Fruit cup', 'Yogurt', 'Turkey sandwich',
          'Protein drink', 'Pretzels', 'Oatmeal cup', 'Trail mix',
        ],
      },
      {
        title: 'Travel Mistakes',
        bullets: [
          { text: 'Relying on one giant meal late in the day' },
          { text: 'Too much fast food right before play' },
          { text: 'Not drinking during travel' },
          { text: 'Under-eating because options are limited' },
        ],
      },
      {
        title: 'Travel Rule',
        bullets: [
          { text: 'Something is better than nothing', bold: true },
          { text: 'Simple beats perfect', bold: true },
        ],
      },
    ],
  },

  {
    key: 'recovery-snacks',
    label: 'Recovery Snacks',
    sub: 'Quick bridge back into fuel',
    icon: 'cafe-outline',
    color: '#a855f7',
    category: 'real_world',
    intro:
      'Recovery does not need to be fancy. You just need a quick bridge back into fuel when a full meal is delayed.',
    cards: [
      {
        title: 'Fast Recovery Goal',
        bullets: [
          { text: 'Get carbs + protein in soon after training or games' },
          { text: 'Use a snack when a full meal is delayed' },
        ],
      },
      {
        title: 'Good Recovery Snack Options',
        examples: [
          'Protein shake + banana', 'Chocolate milk', 'Greek yogurt + fruit',
          'Turkey sandwich', 'Granola bar + shake', 'String cheese + pretzels',
          'Yogurt drink + cereal', 'Peanut butter sandwich',
        ],
      },
      {
        title: 'Locker Bag / On-the-Go Ideas',
        examples: [
          'Shelf-stable protein shakes', 'Bars', 'Pretzels', 'Fruit snacks',
          'Applesauce', 'Trail mix', 'Jerky',
        ],
      },
      {
        title: 'When Snacks Matter Most',
        bullets: [
          { text: 'After late games' },
          { text: 'After lifting' },
          { text: 'Long drives home' },
          { text: 'Between tournament games' },
          { text: 'When dinner is delayed' },
        ],
      },
    ],
  },

  {
    key: '6pm-game',
    label: 'What To Eat Before a 6 PM Game',
    sub: 'Practical timeline for evening games',
    icon: 'time-outline',
    color: '#ec4899',
    category: 'real_world',
    intro:
      'A 6 PM game usually gets ruined by one of two things: eating too little all day or eating too much too late.',
    cards: [
      {
        title: 'Simple Timeline',
        bullets: [
          { text: 'Breakfast: normal meal with protein + carbs' },
          { text: 'Lunch: solid balanced meal' },
          { text: '2:30–3:30 PM: main pre-game meal' },
          { text: '4:30–5:00 PM: light snack if needed' },
        ],
      },
      {
        title: 'Breakfast Ideas',
        examples: ['Eggs + toast + fruit', 'Oatmeal + yogurt + banana', 'Bagel + eggs'],
      },
      {
        title: 'Lunch Ideas',
        examples: ['Chicken + rice bowl', 'Turkey sandwich + fruit + pretzels', 'Pasta + protein'],
      },
      {
        title: 'Main Pre-Game Meal (2.5–3.5 Hours Before)',
        examples: [
          'Chicken + rice + fruit', 'Turkey sandwich + pretzels',
          'Pasta + grilled chicken', 'Bagel + peanut butter + banana',
        ],
      },
      {
        title: 'Light Top-Off Snack (60–90 Min Before)',
        examples: ['Banana', 'Applesauce', 'Granola bar', 'Sports drink', 'Small yogurt'],
      },
      {
        title: 'What Not To Do',
        bullets: [
          { text: 'Skip breakfast' },
          { text: 'Barely eat lunch' },
          { text: 'Crush a huge heavy meal at 5 PM' },
          { text: 'Show up running on caffeine only' },
        ],
      },
    ],
  },

  {
    key: 'fuel-mistakes',
    label: 'Fuel Mistakes That Kill Performance',
    sub: 'Habits that hold athletes back',
    icon: 'warning-outline',
    color: '#dc2626',
    category: 'real_world',
    intro:
      'Most athletes do not struggle because they don\'t care. They struggle because they repeat the same fueling mistakes and act surprised when performance drops.',
    cards: [
      {
        title: 'Mistake 1: Not Eating Enough',
        bullets: [
          { text: 'Low fuel = low output', bold: true },
          { text: 'Poor energy hurts speed, focus, strength, and recovery' },
        ],
      },
      {
        title: 'Mistake 2: Fear of Carbs',
        bullets: [
          { text: 'Carbs are fuel, not the enemy', bold: true },
          { text: 'Baseball players need carbs for explosive output and long days' },
        ],
      },
      {
        title: 'Mistake 3: Training or Playing Half-Fasted',
        bullets: [
          { text: 'Under-fueled sessions usually mean flat output' },
          { text: 'Intensity drops when energy isn\'t there' },
        ],
      },
      {
        title: 'Mistake 4: Waiting Too Long After Games or Lifts',
        bullets: [
          { text: 'Delayed refueling slows recovery' },
          { text: 'Especially bad during tournament stretches and frequent training' },
        ],
      },
      {
        title: 'Mistake 5: Heavy Greasy Food at the Wrong Time',
        bullets: [
          { text: 'Hard to digest' },
          { text: 'Can leave athletes sluggish or nauseous before performance' },
        ],
      },
      {
        title: 'Mistake 6: Hydrating Too Late',
        bullets: [
          { text: 'Trying to catch up right before game time usually fails' },
          { text: 'Hydration is built over the full day' },
        ],
      },
      {
        title: 'Mistake 7: Confusing "Eating Clean" with "Fueling to Perform"',
        bullets: [
          { text: 'Athletes sometimes eat too little because they are trying to be overly strict' },
          { text: 'Performance nutrition is about support, not food guilt' },
        ],
      },
      {
        title: 'Mistake 8: No Plan for Long Days',
        bullets: [
          { text: 'No snacks' },
          { text: 'No fluids' },
          { text: 'No backup options' },
          { text: 'No structure' },
        ],
      },
      {
        title: 'Final Reminder',
        bullets: [
          { text: 'Simple beats perfect', bold: true },
          { text: 'Fueled beats empty', bold: true },
          { text: 'Prepared beats reactive', bold: true },
        ],
      },
    ],
  },
];

/* ─── Grouped access ────────────────────────────── */

export const FUEL_FOUNDATIONS = FUEL_SECTIONS.filter((s) => s.category === 'foundations');
export const FUEL_REAL_WORLD = FUEL_SECTIONS.filter((s) => s.category === 'real_world');

/* ─── Lookup helper ─────────────────────────────── */

export function getFuelSection(key: FuelSectionKey): FuelSection | undefined {
  return FUEL_SECTIONS.find((s) => s.key === key);
}
