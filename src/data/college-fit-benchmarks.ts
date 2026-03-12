// College Fit Dashboard — metric definitions and T1–T5 benchmarks
// T1 = D1 Power 5 prospect, T5 = Developing player

export type MetricKey =
  // Speed / Athleticism
  | 'sprint_60yd_sec'
  | 'sprint_10yd_sec'
  | 'home_to_first_sec'
  // Hitting / Power
  | 'exit_velo_mph'
  | 'exit_velo_max_mph'
  | 'bat_speed_mph'
  | 'hard_hit_pct'
  | 'barrel_pct'
  // Hitting / Traditional & Advanced
  | 'batting_avg'
  | 'obp'
  | 'slg_pct'
  | 'ops'
  | 'iso'
  // Plate Discipline
  | 'k_pct'
  | 'bb_pct'
  // Defense / Arm
  | 'throw_velo_mph'
  | 'pop_time_sec'
  | 'cs_pct'
  // Defense / Range & Traditional
  | 'fielding_pct'
  // Physical / Body
  | 'height_in'
  | 'weight_lb'
  | 'vertical_jump_in'
  | 'broad_jump_in';

export type Category = 'speed' | 'power' | 'hitting' | 'plate_discipline' | 'arm' | 'defense' | 'body';

export interface MetricMeta {
  key: MetricKey;
  label: string;
  unit: string;
  category: Category;
  /** true = lower value is better (dash times, pop time) */
  lowerIsBetter: boolean;
  /** [min, max] valid input range for validation */
  range: [number, number];
  /**
   * Tier thresholds [T1, T2, T3, T4, T5].
   * lowerIsBetter = true  → T1 is the smallest (fastest) value
   * lowerIsBetter = false → T1 is the largest (highest) value
   */
  tiers: [number, number, number, number, number];
  /**
   * Position-specific tier overrides. When a position is selected,
   * the scoring engine uses these tiers instead of the default `tiers`.
   */
  positionTiers?: Partial<Record<Position, [number, number, number, number, number]>>;
  testGuide: string;
  placeholder: string;
}

export const METRICS: MetricMeta[] = [
  // ══════════════════════════════════════════════════════════════════════════
  // SPEED / ATHLETICISM
  // ══════════════════════════════════════════════════════════════════════════
  {
    key: 'sprint_60yd_sec',
    label: '60-Yard Dash',
    unit: 'sec',
    category: 'speed',
    lowerIsBetter: true,
    range: [5.5, 9.0],
    // Default tiers (IF baseline): D1High→NAIA Low
    tiers: [6.7, 6.9, 7.1, 7.2, 7.4],
    positionTiers: {
      C:    [7.0, 7.2, 7.4, 7.5, 7.7],   // Catchers slowest — speed matters least
      '1B': [7.0, 7.2, 7.4, 7.5, 7.7],
      '2B': [6.7, 6.9, 7.1, 7.2, 7.4],
      '3B': [6.7, 6.9, 7.1, 7.2, 7.4],
      SS:   [6.7, 6.9, 7.1, 7.2, 7.4],
      OF:   [6.5, 6.7, 6.9, 7.0, 7.2],   // Outfielders held to highest speed standard
      DH:   [7.0, 7.2, 7.4, 7.5, 7.7],
    },
    placeholder: '7.0',
    testGuide:
      'Timed from first movement. Sub-6.7 is a plus runner at any level. Measure on a flat surface (grass or turf). Mark exactly 60 yards. Standing start. Average your best 3 full-effort runs after a complete warmup.',
  },
  {
    key: 'sprint_10yd_sec',
    label: '10-Yard Burst',
    unit: 'sec',
    category: 'speed',
    lowerIsBetter: true,
    range: [1.2, 2.5],
    tiers: [1.47, 1.54, 1.62, 1.72, 1.82],
    placeholder: '1.65',
    testGuide:
      'Use turf or a flat surface. Mark 10 yards from a standing start line. Time from first movement to crossing the 10-yd mark. 3 attempts, record the best. This measures initial burst and first-step quickness.',
  },
  {
    key: 'home_to_first_sec',
    label: 'Home to 1B',
    unit: 'sec',
    category: 'speed',
    lowerIsBetter: true,
    range: [3.8, 6.0],
    tiers: [3.9, 4.1, 4.3, 4.55, 4.9],
    placeholder: '4.4',
    testGuide:
      'Simulate a contact swing from your actual batting stance, then sprint to first base. Time from the swing to crossing the bag. Use RH times as standard (LH times are typically 0.1–0.15s faster). Average of 3 attempts.',
  },
  // ══════════════════════════════════════════════════════════════════════════
  // POWER
  // ══════════════════════════════════════════════════════════════════════════
  {
    key: 'exit_velo_mph',
    label: 'Exit Velo (Avg)',
    unit: 'mph',
    category: 'power',
    lowerIsBetter: false,
    range: [50, 110],
    // Default (IF baseline): avg exit velo across all batted balls
    tiers: [91, 85, 82, 79, 76],
    positionTiers: {
      C:    [90, 84, 81, 78, 76],
      '1B': [91, 85, 82, 79, 76],
      '2B': [91, 85, 82, 79, 76],
      '3B': [91, 85, 82, 79, 76],
      SS:   [91, 85, 82, 79, 76],
      OF:   [93, 87, 84, 81, 78],
      DH:   [91, 85, 82, 79, 76],
    },
    placeholder: '86',
    testGuide:
      'Average exit velocity across all batted balls. Measured via Rapsodo, HitTrax, or Trackman in games or BP. This is your overall quality-of-contact number — not your single best hit.',
  },
  {
    key: 'exit_velo_max_mph',
    label: 'Exit Velo (Max)',
    unit: 'mph',
    category: 'power',
    lowerIsBetter: false,
    range: [60, 120],
    // Default (IF baseline): peak exit velo reading
    tiers: [102, 94, 90, 86, 82],
    positionTiers: {
      C:    [100, 92, 88, 84, 80],
      '1B': [102, 94, 90, 86, 82],
      '2B': [102, 94, 90, 86, 82],
      '3B': [102, 94, 90, 86, 82],
      SS:   [102, 94, 90, 86, 82],
      OF:   [105, 97, 93, 89, 85],
      DH:   [102, 94, 90, 86, 82],
    },
    placeholder: '95',
    testGuide:
      'Peak exit velocity — your single hardest batted ball. Measured via Rapsodo, HitTrax, or radar gun at a showcase. Hit off a tee or soft toss at max effort. Record the highest reading from a full round.',
  },
  {
    key: 'bat_speed_mph',
    label: 'Bat Speed',
    unit: 'mph',
    category: 'power',
    lowerIsBetter: false,
    range: [40, 95],
    tiers: [83, 76, 69, 63, 56],
    placeholder: '68',
    testGuide:
      'Measured via Blast Motion sensor (attached to knob) or Rapsodo Hitting. Take 5–10 max-effort full swings — dry or live. Use the average of your top 5 readings. Bat speed is measured at peak barrel speed through the zone.',
  },
  {
    key: 'hard_hit_pct',
    label: 'Hard Hit %',
    unit: '%',
    category: 'power',
    lowerIsBetter: false,
    range: [5, 60],
    // Default (IF baseline)
    tiers: [38, 26, 22, 18, 14],
    positionTiers: {
      C:    [36, 24, 20, 16, 12],
      '1B': [38, 26, 22, 18, 14],
      '2B': [38, 26, 22, 18, 14],
      '3B': [38, 26, 22, 18, 14],
      SS:   [38, 26, 22, 18, 14],
      OF:   [42, 30, 26, 22, 18],
      DH:   [38, 26, 22, 18, 14],
    },
    placeholder: '28',
    testGuide:
      'Percentage of batted balls with exit velocity 95+ mph. Measured via HitTrax, Rapsodo, or Trackman during games or BP sessions. Higher is better — MLB All-Stars hit 45%+.',
  },
  {
    key: 'barrel_pct',
    label: 'Barrel %',
    unit: '%',
    category: 'power',
    lowerIsBetter: false,
    range: [0, 30],
    tiers: [15, 11, 8, 5, 2],
    placeholder: '9',
    testGuide:
      'Percentage of batted balls classified as "barreled" — optimal combination of exit velocity and launch angle. Available from Trackman, HitTrax, or Statcast. An elite barrel rate means consistent hard, elevated contact.',
  },
  // ══════════════════════════════════════════════════════════════════════════
  // HITTING (Traditional & Advanced)
  // ══════════════════════════════════════════════════════════════════════════
  {
    key: 'batting_avg',
    label: 'Batting Average',
    unit: '',
    category: 'hitting',
    lowerIsBetter: false,
    range: [0.100, 0.500],
    // Default (IF baseline)
    tiers: [0.305, 0.260, 0.250, 0.245, 0.230],
    positionTiers: {
      C:    [0.300, 0.255, 0.245, 0.240, 0.225],
      '1B': [0.305, 0.260, 0.250, 0.245, 0.230],
      '2B': [0.305, 0.260, 0.250, 0.245, 0.230],
      '3B': [0.305, 0.260, 0.250, 0.245, 0.230],
      SS:   [0.305, 0.260, 0.250, 0.245, 0.230],
      OF:   [0.310, 0.265, 0.255, 0.250, 0.235],
      DH:   [0.305, 0.260, 0.250, 0.245, 0.230],
    },
    placeholder: '.270',
    testGuide:
      'Hits divided by at-bats. Use your most recent full season stats. High school averages tend to run higher than college — coaches adjust for competition level. Include the league and level (HS, travel, wood bat).',
  },
  {
    key: 'obp',
    label: 'On-Base %',
    unit: '',
    category: 'hitting',
    lowerIsBetter: false,
    range: [0.150, 0.550],
    // Default (IF baseline)
    tiers: [0.380, 0.325, 0.313, 0.303, 0.285],
    positionTiers: {
      C:    [0.375, 0.320, 0.308, 0.298, 0.280],
      '1B': [0.380, 0.325, 0.313, 0.303, 0.285],
      '2B': [0.380, 0.325, 0.313, 0.303, 0.285],
      '3B': [0.380, 0.325, 0.313, 0.303, 0.285],
      SS:   [0.380, 0.325, 0.313, 0.303, 0.285],
      OF:   [0.385, 0.330, 0.318, 0.308, 0.290],
      DH:   [0.380, 0.325, 0.313, 0.303, 0.285],
    },
    placeholder: '.340',
    testGuide:
      'Hits + walks + HBP divided by plate appearances. Measures your ability to get on base. An OBP above .350 projects well at the D1 level. Use your most recent full season stats.',
  },
  {
    key: 'slg_pct',
    label: 'Slugging %',
    unit: '',
    category: 'hitting',
    lowerIsBetter: false,
    range: [0.100, 1.000],
    // Default (IF baseline)
    tiers: [0.480, 0.395, 0.368, 0.348, 0.315],
    positionTiers: {
      C:    [0.460, 0.375, 0.348, 0.328, 0.295],
      '1B': [0.480, 0.395, 0.368, 0.348, 0.315],
      '2B': [0.480, 0.395, 0.368, 0.348, 0.315],
      '3B': [0.480, 0.395, 0.368, 0.348, 0.315],
      SS:   [0.480, 0.395, 0.368, 0.348, 0.315],
      OF:   [0.510, 0.425, 0.398, 0.378, 0.345],
      DH:   [0.480, 0.395, 0.368, 0.348, 0.315],
    },
    placeholder: '.420',
    testGuide:
      'Total bases divided by at-bats. Measures power production. SLG above .450 projects well at most D1 programs. Use your most recent full season. Wood bat league stats are weighted more heavily by college coaches.',
  },
  {
    key: 'ops',
    label: 'OPS',
    unit: '',
    category: 'hitting',
    lowerIsBetter: false,
    range: [0.300, 1.500],
    tiers: [0.860, 0.720, 0.680, 0.650, 0.600],
    placeholder: '.750',
    testGuide:
      'On-base percentage + slugging percentage. The single best traditional stat for overall offensive production. An OPS above .800 projects well at the D1 level. Use your most recent full season stats.',
  },
  {
    key: 'iso',
    label: 'Isolated Power (ISO)',
    unit: '',
    category: 'hitting',
    lowerIsBetter: false,
    range: [0.000, 0.500],
    tiers: [0.280, 0.220, 0.170, 0.120, 0.070],
    placeholder: '.180',
    testGuide:
      'Slugging percentage minus batting average. Measures raw extra-base power. An ISO above .200 indicates legitimate power. Calculate from your season stats: SLG - AVG.',
  },
  // ══════════════════════════════════════════════════════════════════════════
  // PLATE DISCIPLINE
  // ══════════════════════════════════════════════════════════════════════════
  {
    key: 'k_pct',
    label: 'Strikeout %',
    unit: '%',
    category: 'plate_discipline',
    lowerIsBetter: true,
    range: [5, 45],
    // Default (IF baseline) — lower is better
    tiers: [20, 24, 28, 30, 34],
    positionTiers: {
      C:    [22, 26, 30, 32, 36],   // Catchers slightly higher K% tolerated
      '1B': [20, 24, 28, 30, 34],
      '2B': [20, 24, 28, 30, 34],
      '3B': [20, 24, 28, 30, 34],
      SS:   [20, 24, 28, 30, 34],
      OF:   [22, 26, 30, 32, 36],
      DH:   [20, 24, 28, 30, 34],
    },
    placeholder: '22',
    testGuide:
      'Strikeouts divided by plate appearances × 100. Lower is better — elite hitters control the zone. Calculate from your most recent full season. D1 High above avg is sub-20% for IF, sub-22% for OF/C.',
  },
  {
    key: 'bb_pct',
    label: 'Walk %',
    unit: '%',
    category: 'plate_discipline',
    lowerIsBetter: false,
    range: [2, 25],
    // Default (IF baseline)
    tiers: [12, 9, 7, 6, 4],
    positionTiers: {
      C:    [11, 8, 6, 5, 4],
      '1B': [12, 9, 7, 6, 4],
      '2B': [12, 9, 7, 6, 4],
      '3B': [12, 9, 7, 6, 4],
      SS:   [12, 9, 7, 6, 4],
      OF:   [11, 8, 6, 5, 4],
      DH:   [12, 9, 7, 6, 4],
    },
    placeholder: '8',
    testGuide:
      'Walks divided by plate appearances × 100. Measures plate discipline and pitch recognition. A BB% above 10% shows a patient, disciplined approach that college coaches value. MLB All-Star level is 12-13%.',
  },
  // ══════════════════════════════════════════════════════════════════════════
  // ARM
  // ══════════════════════════════════════════════════════════════════════════
  {
    key: 'throw_velo_mph',
    label: 'Arm Velocity',
    unit: 'mph',
    category: 'arm',
    lowerIsBetter: false,
    range: [50, 110],
    // Default tiers (IF baseline)
    tiers: [90, 84, 81, 78, 75],
    // Position-specific from OTC scouting benchmarks
    // C = throwing to 2B | IF = infield throw across diamond | OF = crow hop throw
    positionTiers: {
      C:    [82, 76, 73, 70, 67],   // Catchers — arm to 2B
      '1B': [85, 80, 78, 75, 72],   // Corner IF — shorter throws
      '2B': [87, 82, 79, 76, 74],   // Middle IF — across diamond
      '3B': [90, 84, 81, 78, 75],   // Hot corner — long throws
      SS:   [90, 84, 81, 78, 75],   // Premium IF — strong arm required
      OF:   [93, 87, 84, 81, 78],   // OF crow hop throw — highest standard
      SP:   [94, 90, 85, 80, 74],   // Pitchers — off the mound
      RP:   [94, 90, 85, 80, 74],
      DH:   [82, 78, 74, 69, 63],   // Arm almost irrelevant
    },
    placeholder: '85',
    testGuide:
      'Use a radar gun or Rapsodo. Throw from your primary defensive position at full effort. C = throw to 2B, IF = throw across diamond, OF = crow hop throw. Average of best 3 max-effort throws after a complete arm warmup.',
  },
  {
    key: 'pop_time_sec',
    label: 'Pop Time (C)',
    unit: 'sec',
    category: 'arm',
    lowerIsBetter: true,
    range: [1.6, 3.0],
    // From OTC catcher benchmarks: D1High above=<1.97, D1Mid above=<2.00,
    // D2Mid above=<2.04, D3High above=<2.04, NAIALow avg=2.15
    tiers: [1.97, 2.00, 2.04, 2.08, 2.15],
    placeholder: '2.02',
    testGuide:
      "Catchers only. Sub-2.00 is D1 standard. Sub-1.95 gets pro attention. 1.88 is elite MLB. Measured from ball hitting the catcher's mitt to ball reaching the fielder's glove at 2B. Time 5 throws and average the best 3.",
  },
  {
    key: 'cs_pct',
    label: 'Caught Stealing % (C)',
    unit: '%',
    category: 'arm',
    lowerIsBetter: false,
    range: [10, 60],
    tiers: [42, 35, 28, 22, 15],
    placeholder: '30',
    testGuide:
      "Catchers only. Runners caught stealing divided by total steal attempts × 100. The combination of pop time and CS% tells the full arm story. Include your season stats and the level of competition.",
  },
  // ══════════════════════════════════════════════════════════════════════════
  // DEFENSE
  // ══════════════════════════════════════════════════════════════════════════
  {
    key: 'fielding_pct',
    label: 'Fielding %',
    unit: '',
    category: 'defense',
    lowerIsBetter: false,
    range: [0.850, 1.000],
    tiers: [0.985, 0.975, 0.960, 0.940, 0.910],
    placeholder: '.970',
    testGuide:
      'Putouts + assists divided by total chances. Use your most recent full season stats. Fielding percentage varies by position — SS/3B have lower norms than 1B/OF. Coaches also evaluate range and arm, not just errors.',
  },
  // ══════════════════════════════════════════════════════════════════════════
  // BODY / PHYSICAL
  // ══════════════════════════════════════════════════════════════════════════
  {
    key: 'height_in',
    label: 'Height',
    unit: 'in',
    category: 'body',
    lowerIsBetter: false,
    range: [58, 84],
    tiers: [75, 72, 70, 68, 65],
    placeholder: '71',
    testGuide:
      'Stand without shoes on a hard, flat floor. Stand straight, heels together. Have a partner mark the top of your head against a wall and measure from floor to mark in inches. 1 in = 1/12 of a foot.',
  },
  {
    key: 'weight_lb',
    label: 'Weight',
    unit: 'lbs',
    category: 'body',
    lowerIsBetter: false,
    range: [120, 280],
    tiers: [205, 190, 178, 165, 150],
    placeholder: '175',
    testGuide:
      'Weigh first thing in the morning in light athletic clothing. Use a consistent digital scale on a hard surface. Weight is used as a projection metric — scouts look for athletic build relative to height and frame.',
  },
  {
    key: 'vertical_jump_in',
    label: 'Vertical Jump',
    unit: 'in',
    category: 'body',
    lowerIsBetter: false,
    range: [10, 48],
    tiers: [34, 29, 24, 19, 14],
    placeholder: '25',
    testGuide:
      'Stand-reach method: measure your standing reach (fingertips on wall, flat feet). Jump straight up at max effort — no step. Touch the wall as high as possible. Subtract standing reach from jump reach. Average of 3 attempts.',
  },
  {
    key: 'broad_jump_in',
    label: 'Broad Jump',
    unit: 'in',
    category: 'body',
    lowerIsBetter: false,
    range: [50, 130],
    tiers: [102, 93, 85, 77, 68],
    placeholder: '84',
    testGuide:
      'Stand with toes at the takeoff line, feet shoulder-width apart. Jump forward as far as possible, landing on both feet. Measure from takeoff line to the nearest heel. Best of 3 attempts.',
  },
];

export const METRICS_BY_KEY = Object.fromEntries(
  METRICS.map((m) => [m.key, m])
) as Record<MetricKey, MetricMeta>;

export const CATEGORY_METRICS: Record<Category, MetricKey[]> = {
  speed:            ['sprint_60yd_sec', 'sprint_10yd_sec', 'home_to_first_sec'],
  power:            ['exit_velo_mph', 'exit_velo_max_mph', 'bat_speed_mph', 'hard_hit_pct', 'barrel_pct'],
  hitting:          ['batting_avg', 'obp', 'slg_pct', 'ops', 'iso'],
  plate_discipline: ['k_pct', 'bb_pct'],
  arm:              ['throw_velo_mph', 'pop_time_sec', 'cs_pct'],
  defense:          ['fielding_pct'],
  body:             ['height_in', 'weight_lb', 'vertical_jump_in', 'broad_jump_in'],
};

export const CATEGORY_WEIGHTS: Record<Category, number> = {
  speed:            0.15,
  power:            0.20,
  hitting:          0.15,
  plate_discipline: 0.10,
  arm:              0.15,
  defense:          0.10,
  body:             0.15,
};

export const CATEGORIES: Category[] = ['speed', 'power', 'hitting', 'plate_discipline', 'arm', 'defense', 'body'];

export const CATEGORY_LABELS: Record<Category, string> = {
  speed:            'Speed',
  power:            'Power',
  hitting:          'Hitting',
  plate_discipline: 'Plate Discipline',
  arm:              'Arm',
  defense:          'Defense',
  body:             'Body',
};

export const CATEGORY_ACCENTS: Record<Category, string> = {
  speed:            '#f97316',
  power:            '#ef4444',
  hitting:          '#3b82f6',
  plate_discipline: '#eab308',
  arm:              '#22c55e',
  defense:          '#06b6d4',
  body:             '#8b5cf6',
};

export const TIER_FULL_LABELS: Record<string, string> = {
  T1: 'D1 Power 5',
  T2: 'D1 Mid-Major',
  T3: 'D2 / High D3',
  T4: 'D3 / JUCO',
  T5: 'Developing',
};

export const TIER_COLORS: Record<string, string> = {
  T1: '#f59e0b',
  T2: '#22c55e',
  T3: '#3b82f6',
  T4: '#8b5cf6',
  T5: '#6b7280',
};

// ── Position System ───────────────────────────────────────────────────────────

export type Position = 'C' | '1B' | '2B' | '3B' | 'SS' | 'OF' | 'SP' | 'RP' | 'DH';

export const POSITIONS: Position[] = ['C', '1B', '2B', '3B', 'SS', 'OF', 'SP', 'RP', 'DH'];

export const POSITION_LABELS: Record<Position, string> = {
  C:    'Catcher',
  '1B': '1st Base',
  '2B': '2nd Base',
  '3B': '3rd Base',
  SS:   'Shortstop',
  OF:   'Outfield',
  SP:   'Starting P',
  RP:   'Relief P',
  DH:   'DH / Hitter',
};

/**
 * Category weight distributions per position.
 * Values must sum to 1.0. These override CATEGORY_WEIGHTS in position-adjusted mode.
 * Pitcher arm weight is concentrated because throw_velo_mph is their primary metric.
 */
export const POSITION_WEIGHTS: Record<Position, Record<Category, number>> = {
  //       speed  power  hitting  disc   arm    def    body
  C:    { speed: 0.05, power: 0.20, hitting: 0.10, plate_discipline: 0.05, arm: 0.30, defense: 0.15, body: 0.15 },
  '1B': { speed: 0.05, power: 0.30, hitting: 0.20, plate_discipline: 0.10, arm: 0.05, defense: 0.10, body: 0.20 },
  '2B': { speed: 0.20, power: 0.10, hitting: 0.15, plate_discipline: 0.10, arm: 0.10, defense: 0.20, body: 0.15 },
  '3B': { speed: 0.10, power: 0.25, hitting: 0.15, plate_discipline: 0.10, arm: 0.15, defense: 0.10, body: 0.15 },
  SS:   { speed: 0.20, power: 0.10, hitting: 0.10, plate_discipline: 0.10, arm: 0.15, defense: 0.25, body: 0.10 },
  OF:   { speed: 0.20, power: 0.20, hitting: 0.15, plate_discipline: 0.10, arm: 0.15, defense: 0.10, body: 0.10 },
  SP:   { speed: 0.03, power: 0.02, hitting: 0.00, plate_discipline: 0.00, arm: 0.65, defense: 0.10, body: 0.20 },
  RP:   { speed: 0.03, power: 0.02, hitting: 0.00, plate_discipline: 0.00, arm: 0.65, defense: 0.10, body: 0.20 },
  DH:   { speed: 0.03, power: 0.35, hitting: 0.25, plate_discipline: 0.15, arm: 0.02, defense: 0.00, body: 0.20 },
};

export const POSITION_CONTEXT: Record<Position, string> = {
  C:    'Arm (30%) and power (20%) drive your projection. Catchers with elite pop time, CS%, and exit velocity stand out at every level. Defense and blocking ability are equally critical.',
  '1B': 'Power (30%) and hitting stats (20%) are the dominant factors. First base prospects live or die by exit velocity, bat speed, and quality of contact at the college level.',
  '2B': 'Speed (20%) and defense (20%) lead your profile. Middle infield prospects need elite athleticism, range, and consistent contact — a sub-6.8 sixty and sharp glove are essential.',
  '3B': 'Power (25%) and arm (15%) are co-priorities. Third base is the "hot corner" — scouts want bat speed, hard contact, and a cannon arm.',
  SS:   'Defense (25%) and speed (20%) define the position. Shortstop is the highest-scrutinized position in recruiting — range, arm strength, and 60 time matter most.',
  OF:   'Speed (20%) and power (20%) are equally weighted. Arm strength and range matter for RF/CF prospects. Show out on the bases and in BP.',
  SP:   'Arm (65%) is everything. Starting pitchers are evaluated almost exclusively on fastball velocity and pitch mix. Body frame factors into projection.',
  RP:   'Arm (65%) is everything. Relief prospects need a swing-and-miss pitch. Pure velo is king — 90+ opens most D1 conversations.',
  DH:   'Power (35%) and hitting (25%) are your calling card. Scouts need elite exit velocity, bat speed, OPS, and plate discipline when you cannot contribute in the field.',
};

// ── Tier Detail ───────────────────────────────────────────────────────────────

export interface TierDetail {
  fullLabel: string;
  headline: string;
  description: string;
  conferences: string[];
  examplePrograms: string[];
  scholarshipNote: string;
  recruitingTip: string;
}

export const TIER_DETAIL: Record<string, TierDetail> = {
  T1: {
    fullLabel: 'D1 Power 5',
    headline: 'Elite D1 Prospect',
    description:
      'Your measurables project you as a legitimate Power 5 consideration. These programs recruit nationally, compete for national championships, and develop MLB talent every cycle. You need national showcase exposure and direct relationships with coaching staffs. Time is your biggest asset — use it.',
    conferences: ['SEC', 'ACC', 'Big 12', 'Big Ten', 'Pac-12'],
    examplePrograms: [
      'Vanderbilt', 'LSU', 'Florida', 'Texas', 'Miami (FL)',
      'Arkansas', 'Wake Forest', 'Oregon St', 'TCU', 'Georgia Tech',
      'NC State', 'Oklahoma St', 'Mississippi St', 'Texas A&M',
    ],
    scholarshipNote:
      'D1 baseball: 11.7 scholarships split ~35 players. Most offers are 25–75%. Full rides are rare — reserved for elite pitchers and premium position players. Academic aid stacks on top.',
    recruitingTip:
      'Power 5 coaches attend national events (Perfect Game, PBR Nationals, Area Codes). Your video must be 60–90 seconds, game film preferred. Email the recruiting coordinator — not the head coach first.',
  },
  T2: {
    fullLabel: 'D1 Mid-Major',
    headline: 'D1 Mid-Major Prospect',
    description:
      'You fit the profile for Division I Mid-Major programs — programs that recruit hard, develop players to the next level, and compete in legitimate college baseball. These coaches are accessible, attend regional showcases, and respond to direct contact. Attending their school-run camp is the fastest path to an offer.',
    conferences: ['Conference USA', 'Sun Belt', 'WAC', 'Big West', 'Horizon', 'Missouri Valley', 'MAC', 'A-SUN', 'NEC', 'Big South', 'Patriot', 'MEAC'],
    examplePrograms: [
      'Dallas Baptist (DBU)', 'Coastal Carolina', 'Southern Miss',
      'Sam Houston St', 'Grand Canyon', 'CSUN', 'UC Santa Barbara',
      'Wright State', 'App State', 'UAB', 'Evansville', 'Lamar',
      'Kennesaw State', 'Jacksonville', 'Campbell',
    ],
    scholarshipNote:
      'Same 11.7 scholarships as Power 5, often paired with lower tuition. Athletic + academic aid can realistically cover 40–80% of total cost. Ask coaches to show you the full financial picture.',
    recruitingTip:
      'Register for camps at target programs. Face time with an associate head coach is worth more than 10 emails. Follow up every camp with a thank-you and updated measurables.',
  },
  T3: {
    fullLabel: 'D2 / High-End D3',
    headline: 'D2 / Elite D3 Prospect',
    description:
      'You project into Division II or elite Division III programs — both legitimate paths. D2 features athletic scholarships, competitive schedules, and strong development pipelines. Top D3 programs compete at a high level with outstanding academic environments. Many DIII players earn professional opportunities.',
    conferences: ['NCAA D2', 'NCAA D3 (elite programs)'],
    examplePrograms: [
      'Catawba (D2)', 'UIndy (D2)', 'Rollins (D2)', 'Central Missouri (D2)',
      'Tampa (D2)', 'Nova Southeastern (D2)', 'Seton Hill (D2)',
      'Southern New Hampshire (D2)', 'Embry-Riddle (D2)',
      'Trinity TX (D3)', 'Emory (D3)', 'Chapman (D3)',
      'Mary Hardin-Baylor (D3)', 'Marietta (D3)', 'Trine (D3)',
    ],
    scholarshipNote:
      'D2: 9 scholarships split ~35 players. D3: No athletic scholarships, but merit and need-based aid can cover $15K–$30K+ annually at many schools. The net cost comparison often surprises families.',
    recruitingTip:
      'D2 coaches respond to email and attend regional events. D3 coaches have smaller recruiting budgets — YOU must initiate. Visit the campus, meet the coach, show genuine interest. They recruit athletes who recruit them.',
  },
  T4: {
    fullLabel: 'D3 / JUCO / NAIA',
    headline: 'JUCO / NAIA / D3 Prospect',
    description:
      'JUCO is one of the most underrated development paths in college baseball. With 24 scholarships per team and average tuition under $10K, full rides are common. Two years to develop your tools, then transfer to a 4-year program with real leverage. NAIA (12 scholarships, no dead periods) goes overlooked by most families. Both are legitimate launching pads.',
    conferences: ['NJCAA', 'NAIA', 'NCAA D3'],
    examplePrograms: [
      'Odessa CC (JUCO)', 'Howard CC (JUCO)', 'McLennan CC (JUCO)',
      'Walters State CC (JUCO)', 'Indian Hills CC (JUCO)',
      'Seminole State (JUCO)', 'Northwest FL State (JUCO)',
      'Olivet Nazarene (NAIA)', 'Lewis-Clark St (NAIA)',
      'Faulkner (NAIA)', 'Blue Mountain (NAIA)', 'Oklahoma Wesleyan (NAIA)',
      'Science & Arts OK (NAIA)',
    ],
    scholarshipNote:
      'JUCO: 24 scholarships, average tuition ~$8K/yr — full rides are standard. NAIA: 12 scholarships, very flexible packaging. D3: merit and need-based aid only.',
    recruitingTip:
      'Call JUCO coaches directly — they recruit late and move fast. NAIA coaches are reachable any time (no dead periods in NAIA). Show up, compete hard, use your eligibility to build 4-year leverage.',
  },
  T5: {
    fullLabel: 'Developing',
    headline: 'Development Phase',
    description:
      'Your current measurables project below standard college thresholds. This is not a closed door — late bloomers earn offers every single year. Players add 5+ mph to their fastball, drop 0.3 seconds off their sixty, and go from T5 to T3 in 12-18 months. Your path is to train specifically for your gaps, retest, and re-apply. The tools come first.',
    conferences: [],
    examplePrograms: [
      'Post-grad prep programs (Northeast, Midwest)',
      'JUCO walk-on opportunities',
      'Summer collegiate leagues (amateur)',
      'Independent leagues (if 18+ and draft-eligible)',
    ],
    scholarshipNote:
      'Focus on development first. The financial conversation comes when the tools are there. One off-season of targeted training can change your projection tier completely.',
    recruitingTip:
      'Identify your 2 biggest gaps using the "Easiest Gains" section below. Build a 90-day training block targeting those exact metrics with specific weekly benchmarks. Coaches recruit athletes who show an improvement arc.',
  },
};

// ── Academic Tier Notes ───────────────────────────────────────────────────────

export interface AcademicNote {
  color: string;
  tier: 'warning' | 'caution' | 'ok' | 'good' | 'elite';
  label: string;
  message: string;
}

export function getAcademicNote(gpa: number): AcademicNote {
  if (gpa < 2.3) {
    return {
      color: '#ef4444',
      tier: 'warning',
      label: 'Eligibility Risk',
      message:
        'NCAA D1/D2 eligibility is at risk below a 2.3 GPA. Contact your guidance counselor about core course requirements immediately. The NCAA Eligibility Center has a sliding scale — your test score partially compensates, but GPA cannot drop below 2.3.',
    };
  }
  if (gpa < 2.5) {
    return {
      color: '#f97316',
      tier: 'caution',
      label: 'Minimum Threshold',
      message:
        'Meets the NCAA minimum on the sliding scale. Your athletic measurables must compensate academically. Work to get above 2.5 — it expands the number of programs that will consider you and unlocks more financial aid.',
    };
  }
  if (gpa < 3.0) {
    return {
      color: '#eab308',
      tier: 'ok',
      label: 'Solid Standing',
      message:
        'Solid academic standing. You qualify at most levels. Aid packages at D2, D3, and NAIA programs supplement athletic money. Register with the NCAA Eligibility Center and confirm all your core courses qualify.',
    };
  }
  if (gpa < 3.5) {
    return {
      color: '#22c55e',
      tier: 'good',
      label: 'Strong Academics',
      message:
        'Strong GPA. Merit scholarships at D2, DIII, and NAIA become available — a significant financial advantage. Academic scholarships can stack on top of athletic money, especially at D2 and NAIA schools. Run the full cost comparison for every school.',
    };
  }
  return {
    color: '#3b82f6',
    tier: 'elite',
    label: 'Elite Academics',
    message:
      'Elite academic profile. You qualify for academic scholarships at every level. D3 and NAIA programs may cover costs that D1 schools cannot. A 3.5+ GPA is a legitimate financial weapon — use it in every recruiting conversation.',
  };
}

// ── School Level & Class ─────────────────────────────────────────────────────

export type SchoolLevel = 'high_school' | 'college';
export type SchoolClass = 'freshman' | 'sophomore' | 'junior' | 'senior';

export const SCHOOL_LEVELS: { key: SchoolLevel; label: string }[] = [
  { key: 'high_school', label: 'High School' },
  { key: 'college', label: 'College' },
];

export const SCHOOL_CLASSES: { key: SchoolClass; label: string }[] = [
  { key: 'freshman', label: 'Freshman' },
  { key: 'sophomore', label: 'Sophomore' },
  { key: 'junior', label: 'Junior' },
  { key: 'senior', label: 'Senior' },
];

export const RECRUITING_TIMELINE: Record<string, string> = {
  'high_school:freshman':
    'Early development window — focus on tools and academics. College coaches cannot contact you yet under NCAA rules.',
  'high_school:sophomore':
    'Development year — build your measurables profile. Coaches begin evaluating prospects. Attend local showcases and start building your highlight video.',
  'high_school:junior':
    'Recruiting window is active now. This is the peak recruiting year — coaches are watching, contacting, and offering. Act with urgency.',
  'high_school:senior':
    'Final recruiting window. Uncommitted seniors should target JUCO, NAIA, and D2/D3 programs that recruit late. Call coaches directly.',
  'college:freshman':
    'Transfer portal opens options. Build your college stats and measurables. If transferring, research portal windows and eligibility rules.',
  'college:sophomore':
    'Key transfer decision year. D1/D2 transfer portal is active. JUCO athletes — this is your transfer year. Measurables matter most now.',
  'college:junior':
    'Final full eligibility year for most. If transferring, act now. If staying, maximize your stats and draft stock.',
  'college:senior':
    'Final season. Focus on maximizing stats, pro day measurables, and post-college opportunities (independent leagues, international ball).',
};

export function getPriorityActions(
  tier: string,
  schoolLevel: SchoolLevel | null,
  schoolClass: SchoolClass | null,
  gapAnalysis: { label: string; formattedGap: string }[],
): string[] {
  const actions: string[] = [];

  // 1. Top gap improvements
  for (const gap of gapAnalysis.slice(0, 2)) {
    actions.push(`Improve ${gap.label} (${gap.formattedGap} to next tier)`);
  }

  // 2. Tier-appropriate actions
  const tierNum = parseInt(tier.replace('T', ''), 10) || 3;
  if (tierNum <= 2) {
    actions.push('Attend national/regional showcases (Perfect Game, PBR, or equivalent)');
    actions.push('Film 60-90 second skills video with game footage');
  } else if (tierNum === 3) {
    actions.push('Register for camps at target D2/D3 programs');
    actions.push('Film skills video and send to recruiting coordinators');
  } else if (tierNum === 4) {
    actions.push('Contact JUCO and NAIA coaches directly — they recruit late and move fast');
    actions.push('Film skills video highlighting your top 2 measurables');
  } else {
    actions.push('Build a 90-day training block targeting your biggest gaps');
    actions.push('Research post-grad prep programs or JUCO walk-on opportunities');
  }

  // 3. Timeline-appropriate actions
  if (schoolLevel === 'high_school') {
    if (schoolClass === 'junior' || schoolClass === 'senior') {
      actions.push('Register with the NCAA Eligibility Center if not already done');
      actions.push('Build outreach list of 15-20 target programs');
    } else {
      actions.push('Focus on academics — maintain eligibility-qualifying GPA');
    }
  } else if (schoolLevel === 'college') {
    if (schoolClass === 'freshman' || schoolClass === 'sophomore') {
      actions.push('Research transfer portal eligibility windows');
    }
  }

  // Add verified measurables action if few gaps (athlete may be missing data)
  if (gapAnalysis.length < 2) {
    actions.push('Get verified measurables (exit velo, 60-yard, throw velo) at a showcase or facility');
  }

  return actions.slice(0, 5);
}

// ── Recruiting Action Steps ───────────────────────────────────────────────────

export const RECRUITING_STEPS: Record<string, string[]> = {
  T1: [
    'Attend national showcases — Perfect Game, PBR Nationals, Under Armour All-America, Area Codes (invite-only). Power 5 coaches watch these events. Regional exposure alone is not enough at this level.',
    'Email Power 5 recruiting coordinators directly. Keep it under 200 words: your name, position, class year, top measurables, video link, and when/where they can see you play. Follow up every 3 weeks with updated numbers.',
    'Sign your National Letter of Intent in November (early signing period). Power 5 programs fill their recruiting classes early — early commits have the most leverage on scholarship packages.',
  ],
  T2: [
    'Build a list of 15-20 D1 Mid-Major programs with roster need at your position. Research the recruiting coordinator name — email them first, not the head coach. Include your measurables, video link, and schedule.',
    'Attend school-run camps at programs you are seriously considering. One face-to-face session with a coordinator is worth 10 emails. Introduce yourself before and after every drill.',
    'The T1/T2 gap is smaller than it looks. Keep improving your top 2 measurables — mid-major coaches upgrade players who show continued development. Stay in regular contact.',
  ],
  T3: [
    'Email D2 recruiting contacts directly — they respond faster than D1 programs. Include measurables and video in your first message. D2 recruiting cycles are shorter, so act with urgency.',
    'Visit D2 and elite D3 campuses personally. D3 schools have smaller recruiting budgets and do not recruit hard — you must initiate contact and show up. Your in-person impression matters.',
    'Run the real financial comparison: D3 academic + merit aid can cover 50-80% of total costs at many schools. Ask every coach to show you a realistic net cost estimate, not just the scholarship offer.',
  ],
  T4: [
    'Identify the top 5 JUCO programs in your state or region. Call the head coach or pitching/hitting coordinator directly — JUCO coaches recruit late and move fast. They want players who are ready to compete now.',
    'Explore NAIA programs. 12 scholarships per team, coaches can contact you at any time (no dead periods), and the competition is real. Many NAIA programs are under-recruited and will pursue you aggressively.',
    'Treat your JUCO or NAIA years as the launchpad, not the ceiling. Two years of development with improving measurables gives you real D1/D2 transfer leverage. The players who transfer up commit to the work every day.',
  ],
  T5: [
    'Identify your 2 biggest gaps (see "Easiest Gains" below) and build a 90-day training block targeting those specific metrics. Set bi-weekly benchmarks and document your progress with a radar gun or Rapsodo.',
    'Research post-grad prep programs — a 5th year of high school development is common in baseball and often overlooked. These programs exist specifically for late-developing athletes who need one more growth window.',
    'JUCO walk-on opportunities exist at programs with open rosters. Coaches at developing programs will let you compete for a spot. Make the phone call, show up to practice, earn it. The door is never fully closed.',
  ],
};
