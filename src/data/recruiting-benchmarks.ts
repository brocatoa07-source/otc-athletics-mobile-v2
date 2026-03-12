/* ════════════════════════════════════════════════════════
   RECRUITING BENCHMARKS ENGINE

   Scores an athlete's measurables against real college
   baseball averages across D1, D2, D3, NAIA, and JUCO.
   Then recommends schools in the athlete's preferred states.
   ════════════════════════════════════════════════════════ */

export type DivisionLevel = 'D1' | 'D2' | 'D3' | 'NAIA' | 'JUCO';
export type PositionGroup = 'OF' | 'IF' | 'C' | 'UTIL';

/* ── Division benchmark ranges ────────────────── */

interface BenchmarkRange {
  low: number;
  high: number;
}

interface DivisionBenchmarks {
  level: DivisionLevel;
  label: string;
  color: string;
  height: BenchmarkRange;       // inches
  weight: BenchmarkRange;       // lbs
  sixtyYard: BenchmarkRange;    // seconds (lower = better)
  batSpeed: BenchmarkRange;     // mph
  exitVelo: BenchmarkRange;     // mph
  throwVeloOF: BenchmarkRange;  // mph
  throwVeloIF: BenchmarkRange;  // mph
  broadJump: BenchmarkRange;    // inches
  verticalJump: BenchmarkRange; // inches
}

export const DIVISION_BENCHMARKS: DivisionBenchmarks[] = [
  {
    level: 'D1',
    label: 'NCAA Division I',
    color: '#e11d48',
    height: { low: 72, high: 75 },       // 6'0" – 6'3"
    weight: { low: 185, high: 215 },
    sixtyYard: { low: 6.60, high: 6.90 },
    batSpeed: { low: 70, high: 78 },
    exitVelo: { low: 95, high: 102 },
    throwVeloOF: { low: 88, high: 94 },
    throwVeloIF: { low: 84, high: 90 },
    broadJump: { low: 114, high: 126 },   // 9'6" – 10'6"
    verticalJump: { low: 24, high: 30 },
  },
  {
    level: 'D2',
    label: 'NCAA Division II',
    color: '#8b5cf6',
    height: { low: 71, high: 74 },       // 5'11" – 6'2"
    weight: { low: 180, high: 205 },
    sixtyYard: { low: 6.80, high: 7.10 },
    batSpeed: { low: 67, high: 75 },
    exitVelo: { low: 92, high: 100 },
    throwVeloOF: { low: 85, high: 91 },
    throwVeloIF: { low: 82, high: 88 },
    broadJump: { low: 108, high: 120 },   // 9'0" – 10'0"
    verticalJump: { low: 22, high: 27 },
  },
  {
    level: 'D3',
    label: 'NCAA Division III',
    color: '#22c55e',
    height: { low: 70, high: 73 },       // 5'10" – 6'1"
    weight: { low: 175, high: 200 },
    sixtyYard: { low: 7.00, high: 7.30 },
    batSpeed: { low: 63, high: 72 },
    exitVelo: { low: 88, high: 97 },
    throwVeloOF: { low: 80, high: 87 },
    throwVeloIF: { low: 80, high: 87 },
    broadJump: { low: 102, high: 114 },   // 8'6" – 9'6"
    verticalJump: { low: 20, high: 25 },
  },
  {
    level: 'NAIA',
    label: 'NAIA',
    color: '#f59e0b',
    height: { low: 71, high: 74 },       // 5'11" – 6'2"
    weight: { low: 180, high: 210 },
    sixtyYard: { low: 6.85, high: 7.15 },
    batSpeed: { low: 66, high: 74 },
    exitVelo: { low: 90, high: 98 },
    throwVeloOF: { low: 83, high: 89 },
    throwVeloIF: { low: 83, high: 89 },
    broadJump: { low: 105, high: 117 },
    verticalJump: { low: 21, high: 26 },
  },
  {
    level: 'JUCO',
    label: 'JUCO',
    color: '#06b6d4',
    height: { low: 70, high: 75 },       // 5'10" – 6'3"
    weight: { low: 180, high: 215 },
    sixtyYard: { low: 6.70, high: 7.20 },
    batSpeed: { low: 65, high: 76 },
    exitVelo: { low: 90, high: 100 },
    throwVeloOF: { low: 82, high: 92 },
    throwVeloIF: { low: 82, high: 92 },
    broadJump: { low: 104, high: 120 },
    verticalJump: { low: 21, high: 27 },
  },
];

/* ── Quiz input shape ─────────────────────────── */

export interface RecruitingQuizInput {
  position: PositionGroup;
  heightInches: number;
  weight: number;
  sixtyYard?: number;
  batSpeed?: number;
  exitVelo?: number;
  throwVelo?: number;
  broadJump?: number;      // inches
  verticalJump?: number;   // inches
  preferredStates: string[];  // up to 3 state codes
}

/* ── Scoring algorithm ────────────────────────── */

interface MetricScore {
  metric: string;
  value: number;
  divisionFits: { level: DivisionLevel; fit: 'above' | 'in-range' | 'below' }[];
}

export interface DivisionFitResult {
  level: DivisionLevel;
  label: string;
  color: string;
  score: number;          // 0-100
  fit: 'strong' | 'good' | 'developing';
  metricBreakdown: { metric: string; rating: 'above' | 'in-range' | 'below' }[];
}

export interface RecruitingQuizResult {
  divisionFits: DivisionFitResult[];
  bestFit: DivisionLevel;
  reachFit: DivisionLevel | null;
  suggestedSchools: SchoolSuggestion[];
  metricScores: MetricScore[];
  completedAt: string;
}

function scoreMetricForDivision(
  value: number,
  range: BenchmarkRange,
  inverted: boolean = false, // true for metrics where lower is better (60yd)
): 'above' | 'in-range' | 'below' {
  if (inverted) {
    if (value <= range.low) return 'above';
    if (value <= range.high) return 'in-range';
    return 'below';
  }
  if (value >= range.high) return 'above';
  if (value >= range.low) return 'in-range';
  return 'below';
}

const FIT_POINTS = { above: 3, 'in-range': 2, below: 0 };

export function computeRecruitingFit(input: RecruitingQuizInput): RecruitingQuizResult {
  const metricScores: MetricScore[] = [];
  const divisionScores: Record<DivisionLevel, { total: number; max: number; breakdown: { metric: string; rating: 'above' | 'in-range' | 'below' }[] }> = {
    D1: { total: 0, max: 0, breakdown: [] },
    D2: { total: 0, max: 0, breakdown: [] },
    D3: { total: 0, max: 0, breakdown: [] },
    NAIA: { total: 0, max: 0, breakdown: [] },
    JUCO: { total: 0, max: 0, breakdown: [] },
  };

  const isOF = input.position === 'OF';

  // Build metric list based on what's provided
  const metrics: { key: string; label: string; value: number; getRange: (b: DivisionBenchmarks) => BenchmarkRange; inverted: boolean; weight: number }[] = [];

  metrics.push({ key: 'height', label: 'Height', value: input.heightInches, getRange: (b) => b.height, inverted: false, weight: 0.5 });
  metrics.push({ key: 'weight', label: 'Weight', value: input.weight, getRange: (b) => b.weight, inverted: false, weight: 0.5 });

  if (input.sixtyYard) {
    metrics.push({ key: 'sixtyYard', label: '60-Yard Dash', value: input.sixtyYard, getRange: (b) => b.sixtyYard, inverted: true, weight: 1.5 });
  }
  if (input.batSpeed) {
    metrics.push({ key: 'batSpeed', label: 'Bat Speed', value: input.batSpeed, getRange: (b) => b.batSpeed, inverted: false, weight: 1.2 });
  }
  if (input.exitVelo) {
    metrics.push({ key: 'exitVelo', label: 'Exit Velocity', value: input.exitVelo, getRange: (b) => b.exitVelo, inverted: false, weight: 1.5 });
  }
  if (input.throwVelo) {
    metrics.push({
      key: 'throwVelo',
      label: 'Throwing Velocity',
      value: input.throwVelo,
      getRange: (b) => isOF ? b.throwVeloOF : b.throwVeloIF,
      inverted: false,
      weight: 1.3,
    });
  }
  if (input.broadJump) {
    metrics.push({ key: 'broadJump', label: 'Broad Jump', value: input.broadJump, getRange: (b) => b.broadJump, inverted: false, weight: 0.8 });
  }
  if (input.verticalJump) {
    metrics.push({ key: 'verticalJump', label: 'Vertical Jump', value: input.verticalJump, getRange: (b) => b.verticalJump, inverted: false, weight: 0.8 });
  }

  // Score each metric against each division
  for (const metric of metrics) {
    const divisionFits: MetricScore['divisionFits'] = [];

    for (const bench of DIVISION_BENCHMARKS) {
      const range = metric.getRange(bench);
      const fit = scoreMetricForDivision(metric.value, range, metric.inverted);
      divisionFits.push({ level: bench.level, fit });
      divisionScores[bench.level].total += FIT_POINTS[fit] * metric.weight;
      divisionScores[bench.level].max += 3 * metric.weight;
      divisionScores[bench.level].breakdown.push({ metric: metric.label, rating: fit });
    }

    metricScores.push({ metric: metric.label, value: metric.value, divisionFits });
  }

  // Calculate final scores
  const divisionFits: DivisionFitResult[] = DIVISION_BENCHMARKS.map((bench) => {
    const ds = divisionScores[bench.level];
    const pct = ds.max > 0 ? (ds.total / ds.max) * 100 : 0;
    const score = Math.round(pct);

    let fit: DivisionFitResult['fit'];
    if (score >= 65) fit = 'strong';
    else if (score >= 45) fit = 'good';
    else fit = 'developing';

    return {
      level: bench.level,
      label: bench.label,
      color: bench.color,
      score,
      fit,
      metricBreakdown: ds.breakdown,
    };
  });

  // Sort by score descending
  divisionFits.sort((a, b) => b.score - a.score);

  const bestFit = divisionFits[0].level;
  const reachFit = divisionFits[0].score < 65 ? null
    : divisionFits.findIndex((d) => d.fit === 'strong') > 0 ? divisionFits[0].level
    : divisionFits.length > 1 && divisionFits[0].score >= 65
      ? (DIVISION_ORDER.indexOf(divisionFits[0].level) > 0
        ? DIVISION_ORDER[DIVISION_ORDER.indexOf(divisionFits[0].level) - 1]
        : null)
      : null;

  // Get suggested schools
  const suggestedSchools = getSuggestedSchools(
    divisionFits.filter((d) => d.fit === 'strong' || d.fit === 'good').map((d) => d.level),
    input.preferredStates,
  );

  return {
    divisionFits,
    bestFit,
    reachFit,
    suggestedSchools,
    metricScores,
    completedAt: new Date().toISOString(),
  };
}

const DIVISION_ORDER: DivisionLevel[] = ['D1', 'D2', 'D3', 'NAIA', 'JUCO'];

/* ── School Database ──────────────────────────── */

export interface SchoolInfo {
  name: string;
  level: DivisionLevel;
  state: string;     // 2-letter code
  conference: string;
  note?: string;     // e.g. "Top 25 program" or "Strong development"
}

export interface SchoolSuggestion extends SchoolInfo {
  fitLevel: DivisionFitResult['fit'];
}

// Curated list of college baseball programs by state
const SCHOOL_DATABASE: SchoolInfo[] = [
  // ── ALABAMA ──
  { name: 'Alabama', level: 'D1', state: 'AL', conference: 'SEC' },
  { name: 'Auburn', level: 'D1', state: 'AL', conference: 'SEC' },
  { name: 'UAB', level: 'D1', state: 'AL', conference: 'C-USA' },
  { name: 'South Alabama', level: 'D1', state: 'AL', conference: 'Sun Belt' },
  { name: 'Troy', level: 'D1', state: 'AL', conference: 'Sun Belt' },
  { name: 'Jacksonville State', level: 'D1', state: 'AL', conference: 'C-USA' },
  { name: 'North Alabama', level: 'D1', state: 'AL', conference: 'ASUN' },
  { name: 'West Alabama', level: 'D2', state: 'AL', conference: 'Gulf South' },
  { name: 'Montevallo', level: 'D2', state: 'AL', conference: 'Gulf South' },
  { name: 'Birmingham-Southern', level: 'D3', state: 'AL', conference: 'SAA' },
  { name: 'Faulkner', level: 'NAIA', state: 'AL', conference: 'Southern States' },
  { name: 'Wallace State CC', level: 'JUCO', state: 'AL', conference: 'ACCC' },
  { name: 'Shelton State CC', level: 'JUCO', state: 'AL', conference: 'ACCC' },

  // ── ARIZONA ──
  { name: 'Arizona', level: 'D1', state: 'AZ', conference: 'Big 12', note: 'Perennial powerhouse' },
  { name: 'Arizona State', level: 'D1', state: 'AZ', conference: 'Big 12', note: 'National champion tradition' },
  { name: 'Grand Canyon', level: 'D1', state: 'AZ', conference: 'WAC' },
  { name: 'Central Arizona College', level: 'JUCO', state: 'AZ', conference: 'ACCAC', note: 'Top JUCO program' },
  { name: 'Yavapai College', level: 'JUCO', state: 'AZ', conference: 'ACCAC' },

  // ── ARKANSAS ──
  { name: 'Arkansas', level: 'D1', state: 'AR', conference: 'SEC', note: 'Perennial CWS contender' },
  { name: 'Arkansas State', level: 'D1', state: 'AR', conference: 'Sun Belt' },
  { name: 'Little Rock', level: 'D1', state: 'AR', conference: 'Ohio Valley' },
  { name: 'Harding', level: 'D2', state: 'AR', conference: 'Great American' },
  { name: 'Crowley\'s Ridge College', level: 'NAIA', state: 'AR', conference: 'AMC' },

  // ── CALIFORNIA ──
  { name: 'Stanford', level: 'D1', state: 'CA', conference: 'ACC', note: 'Elite academics + baseball' },
  { name: 'UCLA', level: 'D1', state: 'CA', conference: 'Big Ten' },
  { name: 'USC', level: 'D1', state: 'CA', conference: 'Big Ten' },
  { name: 'Cal State Fullerton', level: 'D1', state: 'CA', conference: 'Big West', note: 'Historic program' },
  { name: 'Long Beach State', level: 'D1', state: 'CA', conference: 'Big West' },
  { name: 'UC Santa Barbara', level: 'D1', state: 'CA', conference: 'Big West' },
  { name: 'UC Irvine', level: 'D1', state: 'CA', conference: 'Big West' },
  { name: 'San Diego', level: 'D1', state: 'CA', conference: 'WCC' },
  { name: 'Pepperdine', level: 'D1', state: 'CA', conference: 'WCC' },
  { name: 'Fresno State', level: 'D1', state: 'CA', conference: 'Mountain West' },
  { name: 'San Jose State', level: 'D1', state: 'CA', conference: 'Mountain West' },
  { name: 'Cal Poly', level: 'D1', state: 'CA', conference: 'Big West' },
  { name: 'UC San Diego', level: 'D1', state: 'CA', conference: 'Big West' },
  { name: 'Cal Baptist', level: 'D1', state: 'CA', conference: 'WAC' },
  { name: 'Academy of Art', level: 'D2', state: 'CA', conference: 'PacWest' },
  { name: 'Azusa Pacific', level: 'D2', state: 'CA', conference: 'PacWest' },
  { name: 'Point Loma', level: 'D2', state: 'CA', conference: 'PacWest' },
  { name: 'Cal Lutheran', level: 'D3', state: 'CA', conference: 'SCIAC' },
  { name: 'Chapman', level: 'D3', state: 'CA', conference: 'SCIAC' },
  { name: 'Claremont-Mudd-Scripps', level: 'D3', state: 'CA', conference: 'SCIAC' },
  { name: 'Concordia Irvine', level: 'NAIA', state: 'CA', conference: 'GSAC' },
  { name: 'Vanguard', level: 'NAIA', state: 'CA', conference: 'GSAC' },
  { name: 'San Joaquin Delta College', level: 'JUCO', state: 'CA', conference: 'Big Valley' },
  { name: 'Riverside City College', level: 'JUCO', state: 'CA', conference: 'OEC' },
  { name: 'Cypress College', level: 'JUCO', state: 'CA', conference: 'OEC' },

  // ── COLORADO ──
  { name: 'Air Force', level: 'D1', state: 'CO', conference: 'Mountain West' },
  { name: 'Northern Colorado', level: 'D1', state: 'CO', conference: 'Summit' },
  { name: 'Colorado Mesa', level: 'D2', state: 'CO', conference: 'RMAC' },
  { name: 'Regis', level: 'D2', state: 'CO', conference: 'RMAC' },

  // ── CONNECTICUT ──
  { name: 'UConn', level: 'D1', state: 'CT', conference: 'Big East' },
  { name: 'Yale', level: 'D1', state: 'CT', conference: 'Ivy League' },
  { name: 'Southern Connecticut', level: 'D2', state: 'CT', conference: 'NE-10' },
  { name: 'Trinity (CT)', level: 'D3', state: 'CT', conference: 'NESCAC' },

  // ── FLORIDA ──
  { name: 'Florida', level: 'D1', state: 'FL', conference: 'SEC', note: 'National champion' },
  { name: 'Florida State', level: 'D1', state: 'FL', conference: 'ACC', note: 'Omaha regulars' },
  { name: 'Miami (FL)', level: 'D1', state: 'FL', conference: 'ACC', note: '4x national champions' },
  { name: 'UCF', level: 'D1', state: 'FL', conference: 'Big 12' },
  { name: 'USF', level: 'D1', state: 'FL', conference: 'AAC' },
  { name: 'FAU', level: 'D1', state: 'FL', conference: 'AAC' },
  { name: 'FIU', level: 'D1', state: 'FL', conference: 'C-USA' },
  { name: 'Stetson', level: 'D1', state: 'FL', conference: 'ASUN' },
  { name: 'Jacksonville', level: 'D1', state: 'FL', conference: 'ASUN' },
  { name: 'FGCU', level: 'D1', state: 'FL', conference: 'ASUN' },
  { name: 'Florida Atlantic', level: 'D1', state: 'FL', conference: 'AAC' },
  { name: 'Tampa', level: 'D2', state: 'FL', conference: 'SSC', note: 'D2 powerhouse' },
  { name: 'Nova Southeastern', level: 'D2', state: 'FL', conference: 'SSC' },
  { name: 'Lynn', level: 'D2', state: 'FL', conference: 'SSC' },
  { name: 'Rollins', level: 'D2', state: 'FL', conference: 'SSC' },
  { name: 'Embry-Riddle', level: 'D2', state: 'FL', conference: 'SSC' },
  { name: 'Southeastern (FL)', level: 'NAIA', state: 'FL', conference: 'Sun' },
  { name: 'Florida State College Jax', level: 'JUCO', state: 'FL', conference: 'Panhandle' },
  { name: 'Chipola College', level: 'JUCO', state: 'FL', conference: 'Panhandle', note: 'Top JUCO' },
  { name: 'Santa Fe College', level: 'JUCO', state: 'FL', conference: 'Mid-Florida' },
  { name: 'State College of Florida', level: 'JUCO', state: 'FL', conference: 'Suncoast' },

  // ── GEORGIA ──
  { name: 'Georgia', level: 'D1', state: 'GA', conference: 'SEC' },
  { name: 'Georgia Tech', level: 'D1', state: 'GA', conference: 'ACC' },
  { name: 'Georgia Southern', level: 'D1', state: 'GA', conference: 'Sun Belt' },
  { name: 'Kennesaw State', level: 'D1', state: 'GA', conference: 'C-USA' },
  { name: 'Mercer', level: 'D1', state: 'GA', conference: 'SoCon' },
  { name: 'Valdosta State', level: 'D2', state: 'GA', conference: 'Gulf South' },
  { name: 'Georgia College', level: 'D2', state: 'GA', conference: 'PBC' },
  { name: 'Berry', level: 'D3', state: 'GA', conference: 'SAA' },
  { name: 'Reinhardt', level: 'NAIA', state: 'GA', conference: 'AAC' },

  // ── ILLINOIS ──
  { name: 'Illinois', level: 'D1', state: 'IL', conference: 'Big Ten' },
  { name: 'Northwestern', level: 'D1', state: 'IL', conference: 'Big Ten' },
  { name: 'Southern Illinois', level: 'D1', state: 'IL', conference: 'MVC' },
  { name: 'Illinois State', level: 'D1', state: 'IL', conference: 'MVC' },
  { name: 'UIC', level: 'D1', state: 'IL', conference: 'MVC' },
  { name: 'Lewis', level: 'D2', state: 'IL', conference: 'GLVC' },
  { name: 'Augustana (IL)', level: 'D3', state: 'IL', conference: 'CCIW' },
  { name: 'St. Francis (IL)', level: 'NAIA', state: 'IL', conference: 'CCAC' },

  // ── INDIANA ──
  { name: 'Indiana', level: 'D1', state: 'IN', conference: 'Big Ten' },
  { name: 'Purdue', level: 'D1', state: 'IN', conference: 'Big Ten' },
  { name: 'Notre Dame', level: 'D1', state: 'IN', conference: 'ACC' },
  { name: 'Ball State', level: 'D1', state: 'IN', conference: 'MAC' },
  { name: 'Indiana State', level: 'D1', state: 'IN', conference: 'MVC' },
  { name: 'Southern Indiana', level: 'D2', state: 'IN', conference: 'GLVC' },

  // ── LOUISIANA ──
  { name: 'LSU', level: 'D1', state: 'LA', conference: 'SEC', note: '7x national champions' },
  { name: 'Louisiana-Lafayette', level: 'D1', state: 'LA', conference: 'Sun Belt' },
  { name: 'Tulane', level: 'D1', state: 'LA', conference: 'AAC' },
  { name: 'La Tech', level: 'D1', state: 'LA', conference: 'C-USA' },
  { name: 'McNeese', level: 'D1', state: 'LA', conference: 'Southland' },
  { name: 'Southeastern Louisiana', level: 'D1', state: 'LA', conference: 'Southland' },
  { name: 'LSU Shreveport', level: 'NAIA', state: 'LA', conference: 'Red River' },
  { name: 'Delgado CC', level: 'JUCO', state: 'LA', conference: 'NJCAA Region 23' },

  // ── MICHIGAN ──
  { name: 'Michigan', level: 'D1', state: 'MI', conference: 'Big Ten' },
  { name: 'Michigan State', level: 'D1', state: 'MI', conference: 'Big Ten' },
  { name: 'Western Michigan', level: 'D1', state: 'MI', conference: 'MAC' },
  { name: 'Central Michigan', level: 'D1', state: 'MI', conference: 'MAC' },
  { name: 'Grand Valley State', level: 'D2', state: 'MI', conference: 'GLIAC' },
  { name: 'Hope', level: 'D3', state: 'MI', conference: 'MIAA' },

  // ── MISSISSIPPI ──
  { name: 'Ole Miss', level: 'D1', state: 'MS', conference: 'SEC', note: 'National champion' },
  { name: 'Mississippi State', level: 'D1', state: 'MS', conference: 'SEC', note: 'National champion' },
  { name: 'Southern Miss', level: 'D1', state: 'MS', conference: 'Sun Belt' },
  { name: 'Delta State', level: 'D2', state: 'MS', conference: 'Gulf South' },
  { name: 'Pearl River CC', level: 'JUCO', state: 'MS', conference: 'MACCC' },
  { name: 'Jones College', level: 'JUCO', state: 'MS', conference: 'MACCC' },

  // ── MISSOURI ──
  { name: 'Missouri', level: 'D1', state: 'MO', conference: 'SEC' },
  { name: 'Missouri State', level: 'D1', state: 'MO', conference: 'MVC' },
  { name: 'Drury', level: 'D2', state: 'MO', conference: 'GLVC' },
  { name: 'Lindenwood', level: 'D1', state: 'MO', conference: 'Ohio Valley' },

  // ── NEW JERSEY ──
  { name: 'Rutgers', level: 'D1', state: 'NJ', conference: 'Big Ten' },
  { name: 'Seton Hall', level: 'D1', state: 'NJ', conference: 'Big East' },
  { name: 'NJIT', level: 'D1', state: 'NJ', conference: 'America East' },
  { name: 'Ramapo', level: 'D3', state: 'NJ', conference: 'NJAC' },

  // ── NEW YORK ──
  { name: 'St. John\'s', level: 'D1', state: 'NY', conference: 'Big East' },
  { name: 'Army', level: 'D1', state: 'NY', conference: 'Patriot' },
  { name: 'Stony Brook', level: 'D1', state: 'NY', conference: 'CAA' },
  { name: 'Adelphi', level: 'D2', state: 'NY', conference: 'NE-10' },

  // ── NORTH CAROLINA ──
  { name: 'North Carolina', level: 'D1', state: 'NC', conference: 'ACC' },
  { name: 'NC State', level: 'D1', state: 'NC', conference: 'ACC' },
  { name: 'Duke', level: 'D1', state: 'NC', conference: 'ACC' },
  { name: 'Wake Forest', level: 'D1', state: 'NC', conference: 'ACC' },
  { name: 'East Carolina', level: 'D1', state: 'NC', conference: 'AAC', note: 'Perennial contender' },
  { name: 'UNC Wilmington', level: 'D1', state: 'NC', conference: 'CAA' },
  { name: 'Charlotte', level: 'D1', state: 'NC', conference: 'AAC' },
  { name: 'Campbell', level: 'D1', state: 'NC', conference: 'Big South' },
  { name: 'Catawba', level: 'D2', state: 'NC', conference: 'SAC' },
  { name: 'Mount Olive', level: 'D2', state: 'NC', conference: 'CCSC' },
  { name: 'Louisburg College', level: 'JUCO', state: 'NC', conference: 'Region 10' },

  // ── OHIO ──
  { name: 'Ohio State', level: 'D1', state: 'OH', conference: 'Big Ten' },
  { name: 'Cincinnati', level: 'D1', state: 'OH', conference: 'Big 12' },
  { name: 'Xavier', level: 'D1', state: 'OH', conference: 'Big East' },
  { name: 'Kent State', level: 'D1', state: 'OH', conference: 'MAC' },
  { name: 'Dayton', level: 'D1', state: 'OH', conference: 'A-10' },
  { name: 'Ashland', level: 'D2', state: 'OH', conference: 'GMAC' },
  { name: 'Marietta', level: 'D3', state: 'OH', conference: 'OAC' },
  { name: 'Wooster', level: 'D3', state: 'OH', conference: 'NCAC' },

  // ── OKLAHOMA ──
  { name: 'Oklahoma', level: 'D1', state: 'OK', conference: 'SEC' },
  { name: 'Oklahoma State', level: 'D1', state: 'OK', conference: 'Big 12' },
  { name: 'Oral Roberts', level: 'D1', state: 'OK', conference: 'Summit' },
  { name: 'Oklahoma Baptist', level: 'D2', state: 'OK', conference: 'Great American' },
  { name: 'Oklahoma City', level: 'NAIA', state: 'OK', conference: 'Sooner' },

  // ── OREGON ──
  { name: 'Oregon State', level: 'D1', state: 'OR', conference: 'Pac-12', note: '3x national champions' },
  { name: 'Oregon', level: 'D1', state: 'OR', conference: 'Big Ten' },
  { name: 'Portland', level: 'D1', state: 'OR', conference: 'WCC' },
  { name: 'Corban', level: 'NAIA', state: 'OR', conference: 'CCC' },

  // ── PENNSYLVANIA ──
  { name: 'Penn State', level: 'D1', state: 'PA', conference: 'Big Ten' },
  { name: 'Pittsburgh', level: 'D1', state: 'PA', conference: 'ACC' },
  { name: 'Villanova', level: 'D1', state: 'PA', conference: 'Big East' },
  { name: 'Millersville', level: 'D2', state: 'PA', conference: 'PSAC' },
  { name: 'Ursinus', level: 'D3', state: 'PA', conference: 'Centennial' },

  // ── SOUTH CAROLINA ──
  { name: 'South Carolina', level: 'D1', state: 'SC', conference: 'SEC', note: '2x national champions' },
  { name: 'Clemson', level: 'D1', state: 'SC', conference: 'ACC' },
  { name: 'Coastal Carolina', level: 'D1', state: 'SC', conference: 'Sun Belt', note: 'National champion' },
  { name: 'Winthrop', level: 'D1', state: 'SC', conference: 'Big South' },
  { name: 'USC Aiken', level: 'D2', state: 'SC', conference: 'PBC' },
  { name: 'Lander', level: 'D2', state: 'SC', conference: 'PBC' },

  // ── TENNESSEE ──
  { name: 'Tennessee', level: 'D1', state: 'TN', conference: 'SEC' },
  { name: 'Vanderbilt', level: 'D1', state: 'TN', conference: 'SEC', note: '2x national champions' },
  { name: 'Tennessee Tech', level: 'D1', state: 'TN', conference: 'Ohio Valley' },
  { name: 'Lipscomb', level: 'D1', state: 'TN', conference: 'ASUN' },
  { name: 'Belmont', level: 'D1', state: 'TN', conference: 'MVC' },
  { name: 'Middle Tennessee', level: 'D1', state: 'TN', conference: 'C-USA' },

  // ── TEXAS ──
  { name: 'Texas', level: 'D1', state: 'TX', conference: 'SEC', note: '6x national champions' },
  { name: 'Texas A&M', level: 'D1', state: 'TX', conference: 'SEC' },
  { name: 'TCU', level: 'D1', state: 'TX', conference: 'Big 12' },
  { name: 'Texas Tech', level: 'D1', state: 'TX', conference: 'Big 12' },
  { name: 'Baylor', level: 'D1', state: 'TX', conference: 'Big 12' },
  { name: 'Houston', level: 'D1', state: 'TX', conference: 'Big 12' },
  { name: 'Rice', level: 'D1', state: 'TX', conference: 'AAC', note: 'Strong academics + baseball' },
  { name: 'Dallas Baptist', level: 'D1', state: 'TX', conference: 'MVC' },
  { name: 'Texas State', level: 'D1', state: 'TX', conference: 'Sun Belt' },
  { name: 'Sam Houston', level: 'D1', state: 'TX', conference: 'C-USA' },
  { name: 'UT Arlington', level: 'D1', state: 'TX', conference: 'WAC' },
  { name: 'UTSA', level: 'D1', state: 'TX', conference: 'AAC' },
  { name: 'Lubbock Christian', level: 'D2', state: 'TX', conference: 'LSC' },
  { name: 'Angelo State', level: 'D2', state: 'TX', conference: 'LSC' },
  { name: 'UT Tyler', level: 'D2', state: 'TX', conference: 'LSC' },
  { name: 'St. Thomas (TX)', level: 'D3', state: 'TX', conference: 'SCAC' },
  { name: 'Trinity (TX)', level: 'D3', state: 'TX', conference: 'SCAC' },
  { name: 'Our Lady of the Lake', level: 'NAIA', state: 'TX', conference: 'Red River' },
  { name: 'McLennan CC', level: 'JUCO', state: 'TX', conference: 'NTJCAC', note: 'Top JUCO' },
  { name: 'San Jacinto College', level: 'JUCO', state: 'TX', conference: 'Region 14', note: 'Top JUCO' },
  { name: 'Blinn College', level: 'JUCO', state: 'TX', conference: 'Region 14' },
  { name: 'Grayson College', level: 'JUCO', state: 'TX', conference: 'NTJCAC' },
  { name: 'Wharton County JC', level: 'JUCO', state: 'TX', conference: 'Region 14' },

  // ── VIRGINIA ──
  { name: 'Virginia', level: 'D1', state: 'VA', conference: 'ACC', note: 'National champion' },
  { name: 'Virginia Tech', level: 'D1', state: 'VA', conference: 'ACC' },
  { name: 'Liberty', level: 'D1', state: 'VA', conference: 'C-USA' },
  { name: 'Old Dominion', level: 'D1', state: 'VA', conference: 'Sun Belt' },
  { name: 'VCU', level: 'D1', state: 'VA', conference: 'A-10' },
  { name: 'James Madison', level: 'D1', state: 'VA', conference: 'Sun Belt' },

  // ── WASHINGTON ──
  { name: 'Washington', level: 'D1', state: 'WA', conference: 'Big Ten' },
  { name: 'Gonzaga', level: 'D1', state: 'WA', conference: 'WCC' },

  // ── WISCONSIN ──
  { name: 'Whitewater', level: 'D3', state: 'WI', conference: 'WIAC' },

  // ── ADDITIONAL KEY STATES ──
  // Maryland
  { name: 'Maryland', level: 'D1', state: 'MD', conference: 'Big Ten' },
  // Kentucky
  { name: 'Kentucky', level: 'D1', state: 'KY', conference: 'SEC' },
  { name: 'Louisville', level: 'D1', state: 'KY', conference: 'ACC' },
  // Iowa
  { name: 'Iowa', level: 'D1', state: 'IA', conference: 'Big Ten' },
  // Nebraska
  { name: 'Nebraska', level: 'D1', state: 'NE', conference: 'Big Ten' },
  { name: 'Creighton', level: 'D1', state: 'NE', conference: 'Big East' },
  // Kansas
  { name: 'Kansas', level: 'D1', state: 'KS', conference: 'Big 12' },
  { name: 'Kansas State', level: 'D1', state: 'KS', conference: 'Big 12' },
  { name: 'Wichita State', level: 'D1', state: 'KS', conference: 'AAC' },
  // Minnesota
  { name: 'Minnesota', level: 'D1', state: 'MN', conference: 'Big Ten' },
  // Hawaii
  { name: 'Hawaii', level: 'D1', state: 'HI', conference: 'Big West' },
  // West Virginia
  { name: 'West Virginia', level: 'D1', state: 'WV', conference: 'Big 12' },
];

function getSuggestedSchools(
  fitLevels: DivisionLevel[],
  preferredStates: string[],
): SchoolSuggestion[] {
  if (fitLevels.length === 0 || preferredStates.length === 0) return [];

  const suggestions: SchoolSuggestion[] = [];
  const states = preferredStates.map((s) => s.toUpperCase());

  for (const school of SCHOOL_DATABASE) {
    if (!states.includes(school.state)) continue;
    if (!fitLevels.includes(school.level)) continue;

    const divFitIndex = fitLevels.indexOf(school.level);
    const fitLevel: DivisionFitResult['fit'] = divFitIndex === 0 ? 'strong' : 'good';

    suggestions.push({ ...school, fitLevel });
  }

  // Sort: strong fit first, then alphabetical
  suggestions.sort((a, b) => {
    const fitOrder = { strong: 0, good: 1, developing: 2 };
    const fitDiff = fitOrder[a.fitLevel] - fitOrder[b.fitLevel];
    if (fitDiff !== 0) return fitDiff;
    // Within same fit, sort by division prestige
    const levelOrder = { D1: 0, D2: 1, D3: 2, NAIA: 3, JUCO: 4 };
    const levelDiff = levelOrder[a.level] - levelOrder[b.level];
    if (levelDiff !== 0) return levelDiff;
    return a.name.localeCompare(b.name);
  });

  return suggestions;
}

/* ── US States list for picker ────────────────── */

export const US_STATES: { code: string; name: string }[] = [
  { code: 'AL', name: 'Alabama' },
  { code: 'AK', name: 'Alaska' },
  { code: 'AZ', name: 'Arizona' },
  { code: 'AR', name: 'Arkansas' },
  { code: 'CA', name: 'California' },
  { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' },
  { code: 'DE', name: 'Delaware' },
  { code: 'FL', name: 'Florida' },
  { code: 'GA', name: 'Georgia' },
  { code: 'HI', name: 'Hawaii' },
  { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' },
  { code: 'IN', name: 'Indiana' },
  { code: 'IA', name: 'Iowa' },
  { code: 'KS', name: 'Kansas' },
  { code: 'KY', name: 'Kentucky' },
  { code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' },
  { code: 'MD', name: 'Maryland' },
  { code: 'MA', name: 'Massachusetts' },
  { code: 'MI', name: 'Michigan' },
  { code: 'MN', name: 'Minnesota' },
  { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' },
  { code: 'MT', name: 'Montana' },
  { code: 'NE', name: 'Nebraska' },
  { code: 'NV', name: 'Nevada' },
  { code: 'NH', name: 'New Hampshire' },
  { code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' },
  { code: 'NY', name: 'New York' },
  { code: 'NC', name: 'North Carolina' },
  { code: 'ND', name: 'North Dakota' },
  { code: 'OH', name: 'Ohio' },
  { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' },
  { code: 'PA', name: 'Pennsylvania' },
  { code: 'RI', name: 'Rhode Island' },
  { code: 'SC', name: 'South Carolina' },
  { code: 'SD', name: 'South Dakota' },
  { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' },
  { code: 'UT', name: 'Utah' },
  { code: 'VT', name: 'Vermont' },
  { code: 'VA', name: 'Virginia' },
  { code: 'WA', name: 'Washington' },
  { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' },
  { code: 'WY', name: 'Wyoming' },
];

/* ── Helper: parse height string to inches ────── */

export function parseHeightToInches(feet: string, inches: string): number {
  return (parseInt(feet, 10) || 0) * 12 + (parseInt(inches, 10) || 0);
}

/* ── Helper: format inches to height string ───── */

export function formatHeight(inches: number): string {
  const ft = Math.floor(inches / 12);
  const ins = inches % 12;
  return `${ft}'${ins}"`;
}
