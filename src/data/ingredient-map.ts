export type GrocerySection = 'Produce' | 'Protein' | 'Dairy' | 'Pantry' | 'Frozen';

export interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
  section: GrocerySection;
}

export const INGREDIENT_MAP: Record<string, Ingredient[]> = {
  /* ── BREAKFAST ── */
  'Oatmeal + Banana + Honey + Protein': [
    { name: 'Oats', quantity: 0.5, unit: 'cups', section: 'Pantry' },
    { name: 'Banana', quantity: 1, unit: 'each', section: 'Produce' },
    { name: 'Honey', quantity: 1, unit: 'tbsp', section: 'Pantry' },
    { name: 'Protein Powder', quantity: 1, unit: 'scoops', section: 'Pantry' },
  ],
  'Eggs + Toast + Fruit': [
    { name: 'Eggs', quantity: 3, unit: 'each', section: 'Dairy' },
    { name: 'Whole Wheat Bread', quantity: 2, unit: 'slices', section: 'Pantry' },
    { name: 'Mixed Fruit', quantity: 1, unit: 'cups', section: 'Produce' },
  ],
  'Overnight Oats': [
    { name: 'Oats', quantity: 0.5, unit: 'cups', section: 'Pantry' },
    { name: 'Almond Milk', quantity: 0.5, unit: 'cups', section: 'Dairy' },
    { name: 'Chia Seeds', quantity: 1, unit: 'tbsp', section: 'Pantry' },
    { name: 'Berries', quantity: 0.5, unit: 'cups', section: 'Produce' },
    { name: 'Protein Powder', quantity: 0.5, unit: 'scoops', section: 'Pantry' },
  ],
  'Smoothie Bowl': [
    { name: 'Frozen Berries', quantity: 1, unit: 'cups', section: 'Frozen' },
    { name: 'Banana', quantity: 1, unit: 'each', section: 'Produce' },
    { name: 'Spinach', quantity: 1, unit: 'cups', section: 'Produce' },
    { name: 'Protein Powder', quantity: 1, unit: 'scoops', section: 'Pantry' },
    { name: 'Almond Butter', quantity: 1, unit: 'tbsp', section: 'Pantry' },
  ],
  'Greek Yogurt + Granola + Berries': [
    { name: 'Greek Yogurt', quantity: 1, unit: 'cups', section: 'Dairy' },
    { name: 'Granola', quantity: 0.5, unit: 'cups', section: 'Pantry' },
    { name: 'Berries', quantity: 0.5, unit: 'cups', section: 'Produce' },
  ],

  /* ── SNACKS ── */
  'PB&J on Whole Wheat': [
    { name: 'Whole Wheat Bread', quantity: 2, unit: 'slices', section: 'Pantry' },
    { name: 'Peanut Butter', quantity: 2, unit: 'tbsp', section: 'Pantry' },
    { name: 'Jelly / Jam', quantity: 1, unit: 'tbsp', section: 'Pantry' },
  ],
  'Trail Mix (homemade)': [
    { name: 'Almonds', quantity: 0.25, unit: 'cups', section: 'Pantry' },
    { name: 'Cashews', quantity: 0.25, unit: 'cups', section: 'Pantry' },
    { name: 'Dark Chocolate Chips', quantity: 2, unit: 'tbsp', section: 'Pantry' },
    { name: 'Dried Cranberries', quantity: 2, unit: 'tbsp', section: 'Pantry' },
  ],
  'Hard-Boiled Eggs + Fruit': [
    { name: 'Eggs', quantity: 2, unit: 'each', section: 'Dairy' },
    { name: 'Apple', quantity: 1, unit: 'each', section: 'Produce' },
  ],
  'Banana + Peanut Butter': [
    { name: 'Banana', quantity: 1, unit: 'each', section: 'Produce' },
    { name: 'Peanut Butter', quantity: 2, unit: 'tbsp', section: 'Pantry' },
  ],
  'Granola Bar + Apple': [
    { name: 'Granola Bar', quantity: 1, unit: 'each', section: 'Pantry' },
    { name: 'Apple', quantity: 1, unit: 'each', section: 'Produce' },
  ],

  /* ── LUNCH ── */
  'Grilled Chicken + White Rice + Broccoli': [
    { name: 'Chicken Breast', quantity: 6, unit: 'oz', section: 'Protein' },
    { name: 'White Rice', quantity: 1, unit: 'cups', section: 'Pantry' },
    { name: 'Broccoli', quantity: 1, unit: 'cups', section: 'Produce' },
  ],
  'Turkey & Rice Bowl': [
    { name: 'Ground Turkey', quantity: 6, unit: 'oz', section: 'Protein' },
    { name: 'White Rice', quantity: 1, unit: 'cups', section: 'Pantry' },
    { name: 'Black Beans', quantity: 0.5, unit: 'cups', section: 'Pantry' },
    { name: 'Salsa', quantity: 2, unit: 'tbsp', section: 'Pantry' },
    { name: 'Avocado', quantity: 0.5, unit: 'each', section: 'Produce' },
  ],
  'Turkey Wrap with Avocado': [
    { name: 'Deli Turkey', quantity: 4, unit: 'oz', section: 'Protein' },
    { name: 'Tortilla (large)', quantity: 1, unit: 'each', section: 'Pantry' },
    { name: 'Avocado', quantity: 0.5, unit: 'each', section: 'Produce' },
    { name: 'Lettuce', quantity: 1, unit: 'cups', section: 'Produce' },
    { name: 'Tomato', quantity: 0.5, unit: 'each', section: 'Produce' },
  ],
  'Chicken Quesadilla': [
    { name: 'Chicken Breast', quantity: 4, unit: 'oz', section: 'Protein' },
    { name: 'Tortilla (large)', quantity: 1, unit: 'each', section: 'Pantry' },
    { name: 'Shredded Cheese', quantity: 0.25, unit: 'cups', section: 'Dairy' },
    { name: 'Bell Peppers', quantity: 0.5, unit: 'cups', section: 'Produce' },
  ],
  'Pasta + Lean Ground Turkey + Marinara': [
    { name: 'Pasta', quantity: 2, unit: 'oz', section: 'Pantry' },
    { name: 'Ground Turkey', quantity: 5, unit: 'oz', section: 'Protein' },
    { name: 'Marinara Sauce', quantity: 0.5, unit: 'cups', section: 'Pantry' },
  ],

  /* ── SNACK 2 ── */
  'Protein Shake + Banana': [
    { name: 'Protein Powder', quantity: 1, unit: 'scoops', section: 'Pantry' },
    { name: 'Almond Milk', quantity: 1, unit: 'cups', section: 'Dairy' },
    { name: 'Banana', quantity: 1, unit: 'each', section: 'Produce' },
  ],
  'Pretzels + Hummus': [
    { name: 'Pretzels', quantity: 1, unit: 'cups', section: 'Pantry' },
    { name: 'Hummus', quantity: 0.25, unit: 'cups', section: 'Dairy' },
  ],
  // 'Trail Mix (homemade)' — already mapped above
  // 'Hard-Boiled Eggs + Fruit' — already mapped above
  // 'Greek Yogurt + Granola + Berries' — already mapped above

  /* ── DINNER ── */
  'Salmon + Sweet Potato + Greens': [
    { name: 'Salmon Fillet', quantity: 5, unit: 'oz', section: 'Protein' },
    { name: 'Sweet Potato', quantity: 1, unit: 'each', section: 'Produce' },
    { name: 'Mixed Greens', quantity: 2, unit: 'cups', section: 'Produce' },
  ],
  'Steak + Rice + Avocado': [
    { name: 'Sirloin Steak', quantity: 6, unit: 'oz', section: 'Protein' },
    { name: 'White Rice', quantity: 1, unit: 'cups', section: 'Pantry' },
    { name: 'Avocado', quantity: 0.5, unit: 'each', section: 'Produce' },
  ],
  'Chicken Stir-Fry with Veggies': [
    { name: 'Chicken Breast', quantity: 6, unit: 'oz', section: 'Protein' },
    { name: 'Stir-Fry Vegetables', quantity: 2, unit: 'cups', section: 'Frozen' },
    { name: 'Soy Sauce', quantity: 1, unit: 'tbsp', section: 'Pantry' },
    { name: 'White Rice', quantity: 1, unit: 'cups', section: 'Pantry' },
  ],
  // 'Grilled Chicken + White Rice + Broccoli' — already mapped above
  // 'Pasta + Lean Ground Turkey + Marinara' — already mapped above
};

/* ── BULK BUY TIPS ── */

export interface BulkBuyTip {
  item: string;
  store: string;
  note: string;
}

export const BULK_BUY_TIPS: BulkBuyTip[] = [
  {
    item: 'Chicken Breast (10 lb bag)',
    store: 'Costco',
    note: 'Portion into 6oz bags and freeze. Cheapest protein per pound — lasts weeks.',
  },
  {
    item: 'Brown/White Rice (25 lb bag)',
    store: 'Costco / Sam\'s',
    note: 'Store in an airtight container. Lasts months and costs ~$0.03 per serving.',
  },
  {
    item: 'Eggs (5 dozen)',
    store: 'Costco / Sam\'s',
    note: 'Best value per egg. Hard-boil a dozen at a time for grab-and-go protein.',
  },
  {
    item: 'Frozen Broccoli / Veggies (4 lb bag)',
    store: 'Costco / Sam\'s',
    note: 'Just as nutritious as fresh. Steam or roast straight from frozen.',
  },
  {
    item: 'Greek Yogurt (large tub)',
    store: 'Costco',
    note: 'Way cheaper than single cups. Scoop into portions — add granola and berries.',
  },
  {
    item: 'Oats (large canister)',
    store: 'Costco / Sam\'s',
    note: 'Lasts weeks. 5-minute breakfast every morning for under $0.30.',
  },
  {
    item: 'Peanut Butter (2-pack)',
    store: 'Costco',
    note: 'Natural PB with no added sugar. Staple fat source for athletes.',
  },
  {
    item: 'Protein Powder (5 lb tub)',
    store: 'Costco / Sam\'s',
    note: 'Buy whey isolate. Cost per serving drops 40-50% versus small tubs.',
  },
  {
    item: 'Ground Turkey (4 lb pack)',
    store: 'Sam\'s Club',
    note: 'Portion into 1 lb bags and freeze. Lean and versatile — bowls, pasta, wraps.',
  },
  {
    item: 'Canned Tuna (12-pack)',
    store: 'Costco / Sam\'s',
    note: 'Long shelf life, zero prep required. Quick 30g protein any time.',
  },
];
