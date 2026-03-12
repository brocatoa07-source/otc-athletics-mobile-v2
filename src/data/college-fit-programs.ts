// College Fit — Program Database
// Programs organized by US state (2-letter code), each with a tier and division.
//
// Tier definitions:
//   T1 = D1 Power Conference / Elite D1 (SEC, ACC, Big Ten, Big 12, Pac-12, AAC, Big East, etc.)
//   T2 = D1 Mid-Major (Sun Belt, ASUN, CUSA, WAC, MAC, MVC, OVC, SoCon, WCC, A10, etc.)
//   T3 = D2 / Strong NAIA
//   T4 = JUCO / D3 / Developmental NAIA

export interface ProgramEntry {
  name: string;
  tier: 'T1' | 'T2' | 'T3' | 'T4';
  division: 'D1' | 'D2' | 'D3' | 'NAIA' | 'JUCO';
  conference?: string;
  note?: string;
}

export const PROGRAMS_BY_STATE: Record<string, ProgramEntry[]> = {
  AL: [
    { name: 'Alabama', tier: 'T1', division: 'D1', conference: 'SEC', note: 'National power' },
    { name: 'Auburn', tier: 'T1', division: 'D1', conference: 'SEC' },
    { name: 'Alabama-Birmingham', tier: 'T1', division: 'D1', conference: 'AAC' },
    { name: 'Jacksonville State', tier: 'T2', division: 'D1', conference: 'CUSA' },
    { name: 'South Alabama', tier: 'T2', division: 'D1', conference: 'Sun Belt' },
    { name: 'Troy', tier: 'T2', division: 'D1', conference: 'Sun Belt' },
    { name: 'Samford', tier: 'T2', division: 'D1', conference: 'SoCon' },
    { name: 'Alabama State', tier: 'T2', division: 'D1', conference: 'SWAC' },
    { name: 'Alabama A&M', tier: 'T2', division: 'D1', conference: 'SWAC' },
    { name: 'Spring Hill College', tier: 'T3', division: 'D2' },
    { name: 'Huntingdon College', tier: 'T3', division: 'D2' },
    { name: 'Bevill State CC', tier: 'T4', division: 'JUCO' },
    { name: 'Jefferson State CC', tier: 'T4', division: 'JUCO' },
    { name: 'Snead State CC', tier: 'T4', division: 'JUCO' },
  ],
  AR: [
    { name: 'Arkansas', tier: 'T1', division: 'D1', conference: 'SEC', note: 'National power' },
    { name: 'Arkansas State', tier: 'T2', division: 'D1', conference: 'Sun Belt' },
    { name: 'Central Arkansas', tier: 'T2', division: 'D1', conference: 'ASUN' },
    { name: 'Little Rock', tier: 'T2', division: 'D1', conference: 'Sun Belt' },
    { name: 'Ouachita Baptist', tier: 'T3', division: 'D2' },
    { name: 'Henderson State', tier: 'T3', division: 'D2' },
    { name: 'Arkansas Tech', tier: 'T3', division: 'D2' },
    { name: 'Harding University', tier: 'T3', division: 'D2' },
    { name: 'Arkansas State-Beebe', tier: 'T4', division: 'JUCO' },
    { name: 'National Park College', tier: 'T4', division: 'JUCO' },
  ],
  AZ: [
    { name: 'Arizona', tier: 'T1', division: 'D1', conference: 'Big 12' },
    { name: 'Arizona State', tier: 'T1', division: 'D1', conference: 'Big 12', note: 'National power' },
    { name: 'Grand Canyon', tier: 'T1', division: 'D1', conference: 'WAC' },
    { name: 'Northern Arizona', tier: 'T2', division: 'D1', conference: 'Big Sky' },
    { name: 'Arizona Christian', tier: 'T3', division: 'NAIA' },
    { name: 'Ottawa University-AZ', tier: 'T3', division: 'NAIA' },
    { name: 'Mesa CC', tier: 'T4', division: 'JUCO' },
    { name: 'Arizona Western', tier: 'T4', division: 'JUCO' },
    { name: 'Phoenix College', tier: 'T4', division: 'JUCO' },
    { name: 'Glendale CC', tier: 'T4', division: 'JUCO' },
    { name: 'Chandler-Gilbert CC', tier: 'T4', division: 'JUCO' },
  ],
  CA: [
    { name: 'UCLA', tier: 'T1', division: 'D1', conference: 'Big Ten', note: 'National power' },
    { name: 'USC', tier: 'T1', division: 'D1', conference: 'Big Ten' },
    { name: 'Stanford', tier: 'T1', division: 'D1', conference: 'ACC' },
    { name: 'Cal', tier: 'T1', division: 'D1', conference: 'ACC' },
    { name: 'San Diego State', tier: 'T1', division: 'D1', conference: 'Mountain West' },
    { name: 'Cal State Fullerton', tier: 'T1', division: 'D1', conference: 'Big West', note: 'National power' },
    { name: 'Long Beach State', tier: 'T1', division: 'D1', conference: 'Big West' },
    { name: 'UC Santa Barbara', tier: 'T1', division: 'D1', conference: 'Big West' },
    { name: 'UC Irvine', tier: 'T1', division: 'D1', conference: 'Big West' },
    { name: 'Fresno State', tier: 'T1', division: 'D1', conference: 'Mountain West' },
    { name: 'Sacramento State', tier: 'T1', division: 'D1', conference: 'Big West' },
    { name: 'Cal Poly SLO', tier: 'T1', division: 'D1', conference: 'Big West' },
    { name: 'San Jose State', tier: 'T1', division: 'D1', conference: 'Mountain West' },
    { name: 'Pepperdine', tier: 'T1', division: 'D1', conference: 'WCC' },
    { name: 'San Francisco', tier: 'T1', division: 'D1', conference: 'WCC' },
    { name: 'LMU', tier: 'T1', division: 'D1', conference: 'WCC' },
    { name: 'San Diego', tier: 'T1', division: 'D1', conference: 'WCC' },
    { name: 'Saint Mary\'s', tier: 'T2', division: 'D1', conference: 'WCC' },
    { name: 'UC Davis', tier: 'T2', division: 'D1', conference: 'Big West' },
    { name: 'UC Riverside', tier: 'T2', division: 'D1', conference: 'Big West' },
    { name: 'UC San Diego', tier: 'T2', division: 'D1', conference: 'Big West' },
    { name: 'CSU Northridge', tier: 'T2', division: 'D1', conference: 'Big West' },
    { name: 'Azusa Pacific', tier: 'T3', division: 'D2' },
    { name: 'Point Loma Nazarene', tier: 'T3', division: 'NAIA' },
    { name: 'Cal State LA', tier: 'T3', division: 'D2' },
    { name: 'College of the Canyons', tier: 'T4', division: 'JUCO' },
    { name: 'Riverside City College', tier: 'T4', division: 'JUCO' },
    { name: 'Cypress College', tier: 'T4', division: 'JUCO' },
    { name: 'Orange Coast College', tier: 'T4', division: 'JUCO' },
    { name: 'Fresno City College', tier: 'T4', division: 'JUCO' },
  ],
  CO: [
    { name: 'Colorado', tier: 'T1', division: 'D1', conference: 'Big 12' },
    { name: 'Colorado State', tier: 'T2', division: 'D1', conference: 'Mountain West' },
    { name: 'Air Force', tier: 'T2', division: 'D1', conference: 'Mountain West' },
    { name: 'Denver', tier: 'T2', division: 'D1', conference: 'Summit' },
    { name: 'Colorado Mesa', tier: 'T3', division: 'D2' },
    { name: 'Regis University', tier: 'T3', division: 'D2' },
    { name: 'Western Colorado', tier: 'T3', division: 'D2' },
    { name: 'Otero College', tier: 'T4', division: 'JUCO' },
    { name: 'Aims Community College', tier: 'T4', division: 'JUCO' },
  ],
  CT: [
    { name: 'Connecticut', tier: 'T1', division: 'D1', conference: 'Big East' },
    { name: 'Yale', tier: 'T1', division: 'D1', conference: 'Ivy League' },
    { name: 'Central Connecticut', tier: 'T2', division: 'D1', conference: 'NEC' },
    { name: 'Sacred Heart', tier: 'T2', division: 'D1', conference: 'NEC' },
    { name: 'Quinnipiac', tier: 'T2', division: 'D1', conference: 'MAAC' },
    { name: 'Fairfield', tier: 'T2', division: 'D1', conference: 'MAAC' },
    { name: 'Post University', tier: 'T3', division: 'D2' },
    { name: 'Naugatuck Valley CC', tier: 'T4', division: 'JUCO' },
  ],
  FL: [
    { name: 'Florida', tier: 'T1', division: 'D1', conference: 'SEC', note: 'National power' },
    { name: 'Florida State', tier: 'T1', division: 'D1', conference: 'ACC', note: 'National power' },
    { name: 'Miami', tier: 'T1', division: 'D1', conference: 'ACC', note: 'National power' },
    { name: 'UCF', tier: 'T1', division: 'D1', conference: 'Big 12' },
    { name: 'South Florida', tier: 'T1', division: 'D1', conference: 'AAC' },
    { name: 'Florida Atlantic', tier: 'T1', division: 'D1', conference: 'Sun Belt' },
    { name: 'Florida International', tier: 'T2', division: 'D1', conference: 'CUSA' },
    { name: 'FGCU', tier: 'T2', division: 'D1', conference: 'ASUN' },
    { name: 'Stetson', tier: 'T2', division: 'D1', conference: 'ASUN' },
    { name: 'Jacksonville', tier: 'T2', division: 'D1', conference: 'ASUN' },
    { name: 'North Florida', tier: 'T2', division: 'D1', conference: 'ASUN' },
    { name: 'Bethune-Cookman', tier: 'T2', division: 'D1', conference: 'SWAC' },
    { name: 'Florida A&M', tier: 'T2', division: 'D1', conference: 'SWAC' },
    { name: 'Florida Southern', tier: 'T3', division: 'D2', note: 'National power at D2' },
    { name: 'Nova Southeastern', tier: 'T3', division: 'D2' },
    { name: 'Lynn University', tier: 'T3', division: 'D2' },
    { name: 'Rollins College', tier: 'T3', division: 'D2' },
    { name: 'Eckerd College', tier: 'T3', division: 'D2' },
    { name: 'Barry University', tier: 'T3', division: 'D2' },
    { name: 'St. Thomas (FL)', tier: 'T3', division: 'D2' },
    { name: 'Palm Beach State College', tier: 'T4', division: 'JUCO' },
    { name: 'Hillsborough CC', tier: 'T4', division: 'JUCO' },
    { name: 'Tallahassee CC', tier: 'T4', division: 'JUCO' },
    { name: 'Indian River State College', tier: 'T4', division: 'JUCO' },
    { name: 'Polk State College', tier: 'T4', division: 'JUCO' },
    { name: 'Santa Fe College', tier: 'T4', division: 'JUCO' },
    { name: 'Seminole State College', tier: 'T4', division: 'JUCO' },
  ],
  GA: [
    { name: 'Georgia', tier: 'T1', division: 'D1', conference: 'SEC', note: 'National power' },
    { name: 'Georgia Tech', tier: 'T1', division: 'D1', conference: 'ACC' },
    { name: 'Georgia State', tier: 'T1', division: 'D1', conference: 'Sun Belt' },
    { name: 'Kennesaw State', tier: 'T1', division: 'D1', conference: 'ASUN' },
    { name: 'Georgia Southern', tier: 'T1', division: 'D1', conference: 'Sun Belt' },
    { name: 'Mercer', tier: 'T2', division: 'D1', conference: 'SoCon' },
    { name: 'Savannah State', tier: 'T2', division: 'D1', conference: 'SIAC' },
    { name: 'Columbus State', tier: 'T3', division: 'D2' },
    { name: 'Young Harris College', tier: 'T3', division: 'D2' },
    { name: 'LaGrange College', tier: 'T4', division: 'D3' },
    { name: 'Georgia Highlands College', tier: 'T4', division: 'JUCO' },
    { name: 'Georgia Military College', tier: 'T4', division: 'JUCO' },
    { name: 'Atlanta Metropolitan State', tier: 'T4', division: 'JUCO' },
  ],
  ID: [
    { name: 'Idaho', tier: 'T2', division: 'D1', conference: 'Big Sky' },
    { name: 'Idaho State', tier: 'T2', division: 'D1', conference: 'Big Sky' },
    { name: 'Lewis-Clark State', tier: 'T3', division: 'NAIA', note: 'Multiple NAIA national titles' },
    { name: 'College of Idaho', tier: 'T3', division: 'NAIA' },
    { name: 'North Idaho College', tier: 'T4', division: 'JUCO' },
    { name: 'College of Southern Idaho', tier: 'T4', division: 'JUCO' },
  ],
  IL: [
    { name: 'Illinois', tier: 'T1', division: 'D1', conference: 'Big Ten' },
    { name: 'Northwestern', tier: 'T1', division: 'D1', conference: 'Big Ten' },
    { name: 'Illinois State', tier: 'T2', division: 'D1', conference: 'MVC' },
    { name: 'Southern Illinois', tier: 'T2', division: 'D1', conference: 'MVC' },
    { name: 'Eastern Illinois', tier: 'T2', division: 'D1', conference: 'MVC' },
    { name: 'Northern Illinois', tier: 'T2', division: 'D1', conference: 'MAC' },
    { name: 'Bradley', tier: 'T2', division: 'D1', conference: 'MVC' },
    { name: 'Loyola Chicago', tier: 'T2', division: 'D1', conference: 'MVC' },
    { name: 'UIC', tier: 'T2', division: 'D1', conference: 'Horizon' },
    { name: 'Western Illinois', tier: 'T2', division: 'D1', conference: 'Summit' },
    { name: 'SIU Edwardsville', tier: 'T2', division: 'D1', conference: 'OVC' },
    { name: 'Chicago State', tier: 'T2', division: 'D1', conference: 'WAC' },
    { name: 'Lewis University', tier: 'T3', division: 'D2' },
    { name: 'St. Francis (IL)', tier: 'T3', division: 'D2' },
    { name: 'Benedictine University', tier: 'T4', division: 'D3' },
    { name: 'Parkland College', tier: 'T4', division: 'JUCO' },
    { name: 'Triton College', tier: 'T4', division: 'JUCO' },
  ],
  IN: [
    { name: 'Indiana', tier: 'T1', division: 'D1', conference: 'Big Ten' },
    { name: 'Purdue', tier: 'T1', division: 'D1', conference: 'Big Ten' },
    { name: 'Notre Dame', tier: 'T1', division: 'D1', conference: 'ACC' },
    { name: 'Ball State', tier: 'T2', division: 'D1', conference: 'MAC' },
    { name: 'Indiana State', tier: 'T2', division: 'D1', conference: 'MVC' },
    { name: 'Purdue-Fort Wayne', tier: 'T2', division: 'D1', conference: 'Horizon' },
    { name: 'Butler', tier: 'T2', division: 'D1', conference: 'Big East' },
    { name: 'Valparaiso', tier: 'T2', division: 'D1', conference: 'MVC' },
    { name: 'Indiana Wesleyan', tier: 'T3', division: 'NAIA' },
    { name: 'Taylor University', tier: 'T3', division: 'NAIA' },
    { name: 'St. Francis (IN)', tier: 'T3', division: 'NAIA' },
    { name: 'Vincennes University', tier: 'T4', division: 'JUCO' },
    { name: 'Ivy Tech CC', tier: 'T4', division: 'JUCO' },
  ],
  IA: [
    { name: 'Iowa', tier: 'T1', division: 'D1', conference: 'Big Ten' },
    { name: 'Iowa State', tier: 'T1', division: 'D1', conference: 'Big 12' },
    { name: 'Drake', tier: 'T2', division: 'D1', conference: 'MVC' },
    { name: 'Northern Iowa', tier: 'T2', division: 'D1', conference: 'MVC' },
    { name: 'Iowa Wesleyan', tier: 'T3', division: 'NAIA' },
    { name: 'Loras College', tier: 'T4', division: 'D3' },
    { name: 'Iowa Western CC', tier: 'T4', division: 'JUCO' },
    { name: 'Des Moines Area CC', tier: 'T4', division: 'JUCO' },
  ],
  KS: [
    { name: 'Kansas', tier: 'T1', division: 'D1', conference: 'Big 12' },
    { name: 'Kansas State', tier: 'T1', division: 'D1', conference: 'Big 12' },
    { name: 'Wichita State', tier: 'T1', division: 'D1', conference: 'AAC' },
    { name: 'Oral Roberts', tier: 'T2', division: 'D1', conference: 'Summit' },
    { name: 'Washburn University', tier: 'T3', division: 'D2' },
    { name: 'Emporia State', tier: 'T3', division: 'D2' },
    { name: 'Pittsburg State', tier: 'T3', division: 'D2' },
    { name: 'Kansas Wesleyan', tier: 'T3', division: 'NAIA' },
    { name: 'Hutchinson CC', tier: 'T4', division: 'JUCO' },
    { name: 'Barton County CC', tier: 'T4', division: 'JUCO' },
    { name: 'Garden City CC', tier: 'T4', division: 'JUCO' },
    { name: 'Seward County CC', tier: 'T4', division: 'JUCO' },
  ],
  KY: [
    { name: 'Kentucky', tier: 'T1', division: 'D1', conference: 'SEC' },
    { name: 'Louisville', tier: 'T1', division: 'D1', conference: 'ACC', note: 'National power' },
    { name: 'Eastern Kentucky', tier: 'T2', division: 'D1', conference: 'ASUN' },
    { name: 'Western Kentucky', tier: 'T2', division: 'D1', conference: 'CUSA' },
    { name: 'Morehead State', tier: 'T2', division: 'D1', conference: 'OVC' },
    { name: 'Murray State', tier: 'T2', division: 'D1', conference: 'OVC' },
    { name: 'Northern Kentucky', tier: 'T2', division: 'D1', conference: 'Horizon' },
    { name: 'Bellarmine', tier: 'T2', division: 'D1', conference: 'ASUN' },
    { name: 'Campbellsville University', tier: 'T3', division: 'NAIA' },
    { name: 'Pikeville College', tier: 'T3', division: 'NAIA' },
    { name: 'Hazard Community College', tier: 'T4', division: 'JUCO' },
  ],
  LA: [
    { name: 'LSU', tier: 'T1', division: 'D1', conference: 'SEC', note: 'National power' },
    { name: 'Tulane', tier: 'T1', division: 'D1', conference: 'AAC' },
    { name: 'Louisiana-Lafayette', tier: 'T1', division: 'D1', conference: 'Sun Belt' },
    { name: 'Louisiana Tech', tier: 'T2', division: 'D1', conference: 'CUSA' },
    { name: 'McNeese', tier: 'T2', division: 'D1', conference: 'Sun Belt' },
    { name: 'Southeastern Louisiana', tier: 'T2', division: 'D1', conference: 'Sun Belt' },
    { name: 'New Orleans', tier: 'T2', division: 'D1', conference: 'Sun Belt' },
    { name: 'Northwestern State', tier: 'T2', division: 'D1', conference: 'Sun Belt' },
    { name: 'Louisiana-Monroe', tier: 'T2', division: 'D1', conference: 'Sun Belt' },
    { name: 'Nicholls State', tier: 'T2', division: 'D1', conference: 'SBC' },
    { name: 'Grambling State', tier: 'T2', division: 'D1', conference: 'SWAC' },
    { name: 'Southern University', tier: 'T2', division: 'D1', conference: 'SWAC' },
    { name: 'Delgado Community College', tier: 'T4', division: 'JUCO' },
    { name: 'Bossier Parish CC', tier: 'T4', division: 'JUCO' },
    { name: 'LSU Eunice', tier: 'T4', division: 'JUCO' },
  ],
  MD: [
    { name: 'Maryland', tier: 'T1', division: 'D1', conference: 'Big Ten' },
    { name: 'Towson', tier: 'T2', division: 'D1', conference: 'CAA' },
    { name: 'UMBC', tier: 'T2', division: 'D1', conference: 'America East' },
    { name: 'Navy', tier: 'T2', division: 'D1', conference: 'Patriot' },
    { name: 'Loyola Maryland', tier: 'T2', division: 'D1', conference: 'Patriot' },
    { name: 'Mount St. Mary\'s', tier: 'T2', division: 'D1', conference: 'NEC' },
    { name: 'Coppin State', tier: 'T2', division: 'D1', conference: 'MEAC' },
    { name: 'Morgan State', tier: 'T2', division: 'D1', conference: 'MEAC' },
    { name: 'McDaniel College', tier: 'T4', division: 'D3' },
    { name: 'Salisbury University', tier: 'T4', division: 'D3' },
    { name: 'CCBC Essex', tier: 'T4', division: 'JUCO' },
    { name: 'Anne Arundel CC', tier: 'T4', division: 'JUCO' },
  ],
  MA: [
    { name: 'Massachusetts', tier: 'T1', division: 'D1', conference: 'Atlantic 10' },
    { name: 'Harvard', tier: 'T1', division: 'D1', conference: 'Ivy League' },
    { name: 'Northeastern', tier: 'T2', division: 'D1', conference: 'CAA' },
    { name: 'Holy Cross', tier: 'T2', division: 'D1', conference: 'Patriot' },
    { name: 'Merrimack', tier: 'T2', division: 'D1', conference: 'NEC' },
    { name: 'Stonehill', tier: 'T2', division: 'D1', conference: 'NEC' },
    { name: 'Springfield College', tier: 'T4', division: 'D3' },
    { name: 'Tufts University', tier: 'T4', division: 'D3' },
  ],
  MI: [
    { name: 'Michigan', tier: 'T1', division: 'D1', conference: 'Big Ten' },
    { name: 'Michigan State', tier: 'T1', division: 'D1', conference: 'Big Ten' },
    { name: 'Central Michigan', tier: 'T2', division: 'D1', conference: 'MAC' },
    { name: 'Eastern Michigan', tier: 'T2', division: 'D1', conference: 'MAC' },
    { name: 'Western Michigan', tier: 'T2', division: 'D1', conference: 'MAC' },
    { name: 'Oakland University', tier: 'T2', division: 'D1', conference: 'Horizon' },
    { name: 'Detroit Mercy', tier: 'T2', division: 'D1', conference: 'Horizon' },
    { name: 'Grand Valley State', tier: 'T3', division: 'D2', note: 'Elite D2 program' },
    { name: 'Saginaw Valley State', tier: 'T3', division: 'D2' },
    { name: 'Northwood University', tier: 'T3', division: 'D2' },
    { name: 'Ferris State', tier: 'T3', division: 'D2' },
    { name: 'Hope College', tier: 'T4', division: 'D3' },
    { name: 'Lansing CC', tier: 'T4', division: 'JUCO' },
    { name: 'Kalamazoo Valley CC', tier: 'T4', division: 'JUCO' },
  ],
  MN: [
    { name: 'Minnesota', tier: 'T1', division: 'D1', conference: 'Big Ten' },
    { name: 'Minnesota State-Mankato', tier: 'T3', division: 'D2', note: 'Elite D2 program' },
    { name: 'St. Cloud State', tier: 'T3', division: 'D2' },
    { name: 'Winona State', tier: 'T3', division: 'D2' },
    { name: 'St. John\'s (MN)', tier: 'T4', division: 'D3' },
    { name: 'Riverland CC', tier: 'T4', division: 'JUCO' },
    { name: 'Rochester CC', tier: 'T4', division: 'JUCO' },
  ],
  MS: [
    { name: 'Mississippi', tier: 'T1', division: 'D1', conference: 'SEC', note: 'National power' },
    { name: 'Mississippi State', tier: 'T1', division: 'D1', conference: 'SEC', note: 'National power' },
    { name: 'Southern Miss', tier: 'T1', division: 'D1', conference: 'Sun Belt' },
    { name: 'Jackson State', tier: 'T2', division: 'D1', conference: 'SWAC' },
    { name: 'Alcorn State', tier: 'T2', division: 'D1', conference: 'SWAC' },
    { name: 'Mississippi Valley State', tier: 'T2', division: 'D1', conference: 'SWAC' },
    { name: 'Delta State', tier: 'T3', division: 'D2' },
    { name: 'Mississippi College', tier: 'T3', division: 'D2' },
    { name: 'Belhaven University', tier: 'T3', division: 'NAIA' },
    { name: 'Itawamba CC', tier: 'T4', division: 'JUCO' },
    { name: 'East Mississippi CC', tier: 'T4', division: 'JUCO' },
    { name: 'Hinds CC', tier: 'T4', division: 'JUCO' },
    { name: 'Jones College', tier: 'T4', division: 'JUCO' },
  ],
  MO: [
    { name: 'Missouri', tier: 'T1', division: 'D1', conference: 'SEC' },
    { name: 'Missouri State', tier: 'T2', division: 'D1', conference: 'MVC' },
    { name: 'Southeast Missouri State', tier: 'T2', division: 'D1', conference: 'OVC' },
    { name: 'Saint Louis', tier: 'T2', division: 'D1', conference: 'Atlantic 10' },
    { name: 'Drury University', tier: 'T3', division: 'D2' },
    { name: 'Missouri Southern', tier: 'T3', division: 'D2' },
    { name: 'Missouri Western', tier: 'T3', division: 'D2' },
    { name: 'Lindenwood', tier: 'T3', division: 'D2' },
    { name: 'Mineral Area College', tier: 'T4', division: 'JUCO' },
    { name: 'State Fair CC', tier: 'T4', division: 'JUCO' },
    { name: 'Three Rivers College', tier: 'T4', division: 'JUCO' },
  ],
  MT: [
    { name: 'Montana', tier: 'T2', division: 'D1', conference: 'Big Sky' },
    { name: 'Montana State', tier: 'T2', division: 'D1', conference: 'Big Sky' },
    { name: 'Carroll College', tier: 'T3', division: 'NAIA', note: 'Strong NAIA program' },
    { name: 'Miles CC', tier: 'T4', division: 'JUCO' },
  ],
  NE: [
    { name: 'Nebraska', tier: 'T1', division: 'D1', conference: 'Big Ten' },
    { name: 'Creighton', tier: 'T1', division: 'D1', conference: 'Big East' },
    { name: 'Nebraska Omaha', tier: 'T2', division: 'D1', conference: 'Summit' },
    { name: 'Hastings College', tier: 'T3', division: 'NAIA' },
    { name: 'Concordia (NE)', tier: 'T3', division: 'NAIA' },
    { name: 'Nebraska Wesleyan', tier: 'T4', division: 'D3' },
    { name: 'Western Nebraska CC', tier: 'T4', division: 'JUCO' },
    { name: 'Central Community College', tier: 'T4', division: 'JUCO' },
    { name: 'Southeast CC', tier: 'T4', division: 'JUCO' },
  ],
  NV: [
    { name: 'Nevada', tier: 'T2', division: 'D1', conference: 'Mountain West' },
    { name: 'Nevada-Las Vegas', tier: 'T2', division: 'D1', conference: 'Mountain West' },
    { name: 'College of Southern Nevada', tier: 'T4', division: 'JUCO' },
    { name: 'Western Nevada College', tier: 'T4', division: 'JUCO' },
    { name: 'Great Basin College', tier: 'T4', division: 'JUCO' },
  ],
  NJ: [
    { name: 'Rutgers', tier: 'T1', division: 'D1', conference: 'Big Ten' },
    { name: 'Seton Hall', tier: 'T1', division: 'D1', conference: 'Big East' },
    { name: 'Rider', tier: 'T2', division: 'D1', conference: 'MAAC' },
    { name: 'Monmouth', tier: 'T2', division: 'D1', conference: 'MAAC' },
    { name: 'Fairleigh Dickinson', tier: 'T2', division: 'D1', conference: 'NEC' },
    { name: 'NJIT', tier: 'T2', division: 'D1', conference: 'America East' },
    { name: 'Rowan University', tier: 'T4', division: 'D3', note: 'Strong D3 program' },
    { name: 'Montclair State', tier: 'T4', division: 'D3' },
    { name: 'Brookdale CC', tier: 'T4', division: 'JUCO' },
    { name: 'Camden County College', tier: 'T4', division: 'JUCO' },
  ],
  NM: [
    { name: 'New Mexico', tier: 'T1', division: 'D1', conference: 'Mountain West' },
    { name: 'New Mexico State', tier: 'T2', division: 'D1', conference: 'WAC' },
    { name: 'Eastern New Mexico', tier: 'T3', division: 'D2' },
    { name: 'New Mexico Highlands', tier: 'T3', division: 'D2' },
    { name: 'New Mexico JC', tier: 'T4', division: 'JUCO' },
    { name: 'Eastern NM-Roswell', tier: 'T4', division: 'JUCO' },
  ],
  NY: [
    { name: 'Columbia', tier: 'T1', division: 'D1', conference: 'Ivy League' },
    { name: 'Cornell', tier: 'T1', division: 'D1', conference: 'Ivy League' },
    { name: 'St. John\'s', tier: 'T1', division: 'D1', conference: 'Big East' },
    { name: 'Fordham', tier: 'T1', division: 'D1', conference: 'Atlantic 10' },
    { name: 'Army', tier: 'T2', division: 'D1', conference: 'Patriot' },
    { name: 'Manhattan', tier: 'T2', division: 'D1', conference: 'MAAC' },
    { name: 'Binghamton', tier: 'T2', division: 'D1', conference: 'America East' },
    { name: 'Albany', tier: 'T2', division: 'D1', conference: 'America East' },
    { name: 'Stony Brook', tier: 'T2', division: 'D1', conference: 'CAA' },
    { name: 'Siena', tier: 'T2', division: 'D1', conference: 'MAAC' },
    { name: 'Niagara', tier: 'T2', division: 'D1', conference: 'MAAC' },
    { name: 'Canisius', tier: 'T2', division: 'D1', conference: 'MAAC' },
    { name: 'Long Island University', tier: 'T2', division: 'D1', conference: 'NEC' },
    { name: 'Ithaca College', tier: 'T4', division: 'D3' },
    { name: 'RIT', tier: 'T4', division: 'D3' },
    { name: 'Cortland State', tier: 'T4', division: 'D3' },
    { name: 'Suffolk CC', tier: 'T4', division: 'JUCO' },
    { name: 'Nassau CC', tier: 'T4', division: 'JUCO' },
  ],
  NC: [
    { name: 'North Carolina', tier: 'T1', division: 'D1', conference: 'ACC', note: 'National power' },
    { name: 'NC State', tier: 'T1', division: 'D1', conference: 'ACC', note: 'National power' },
    { name: 'Duke', tier: 'T1', division: 'D1', conference: 'ACC' },
    { name: 'Wake Forest', tier: 'T1', division: 'D1', conference: 'ACC' },
    { name: 'Charlotte', tier: 'T1', division: 'D1', conference: 'AAC' },
    { name: 'East Carolina', tier: 'T1', division: 'D1', conference: 'AAC', note: 'Strong regional program' },
    { name: 'App State', tier: 'T2', division: 'D1', conference: 'Sun Belt' },
    { name: 'UNC Wilmington', tier: 'T2', division: 'D1', conference: 'CAA' },
    { name: 'Campbell', tier: 'T2', division: 'D1', conference: 'ASUN' },
    { name: 'Elon', tier: 'T2', division: 'D1', conference: 'CAA' },
    { name: 'High Point', tier: 'T2', division: 'D1', conference: 'Big South' },
    { name: 'Western Carolina', tier: 'T2', division: 'D1', conference: 'SoCon' },
    { name: 'Gardner-Webb', tier: 'T2', division: 'D1', conference: 'Big South' },
    { name: 'Davidson', tier: 'T2', division: 'D1', conference: 'Atlantic 10' },
    { name: 'UNC Greensboro', tier: 'T2', division: 'D1', conference: 'SoCon' },
    { name: 'Belmont Abbey', tier: 'T3', division: 'D2' },
    { name: 'Pfeiffer University', tier: 'T3', division: 'D2' },
    { name: 'Barton College', tier: 'T3', division: 'D2' },
    { name: 'Catawba Valley CC', tier: 'T4', division: 'JUCO' },
    { name: 'Pitt CC', tier: 'T4', division: 'JUCO' },
    { name: 'Caldwell CC', tier: 'T4', division: 'JUCO' },
  ],
  OH: [
    { name: 'Ohio State', tier: 'T1', division: 'D1', conference: 'Big Ten' },
    { name: 'Cincinnati', tier: 'T1', division: 'D1', conference: 'Big 12' },
    { name: 'Ohio', tier: 'T1', division: 'D1', conference: 'MAC' },
    { name: 'Bowling Green', tier: 'T2', division: 'D1', conference: 'MAC' },
    { name: 'Kent State', tier: 'T2', division: 'D1', conference: 'MAC' },
    { name: 'Akron', tier: 'T2', division: 'D1', conference: 'MAC' },
    { name: 'Toledo', tier: 'T2', division: 'D1', conference: 'MAC' },
    { name: 'Miami (OH)', tier: 'T2', division: 'D1', conference: 'MAC' },
    { name: 'Xavier', tier: 'T2', division: 'D1', conference: 'Big East' },
    { name: 'Dayton', tier: 'T2', division: 'D1', conference: 'Atlantic 10' },
    { name: 'Wright State', tier: 'T2', division: 'D1', conference: 'Horizon' },
    { name: 'Cleveland State', tier: 'T2', division: 'D1', conference: 'Horizon' },
    { name: 'Youngstown State', tier: 'T2', division: 'D1', conference: 'Horizon' },
    { name: 'Ashland University', tier: 'T3', division: 'D2' },
    { name: 'Ohio Dominican', tier: 'T3', division: 'D2' },
    { name: 'Tiffin University', tier: 'T3', division: 'D2' },
    { name: 'Cuyahoga CC', tier: 'T4', division: 'JUCO' },
    { name: 'Columbus State CC', tier: 'T4', division: 'JUCO' },
  ],
  OK: [
    { name: 'Oklahoma', tier: 'T1', division: 'D1', conference: 'Big 12' },
    { name: 'Oklahoma State', tier: 'T1', division: 'D1', conference: 'Big 12' },
    { name: 'Oral Roberts', tier: 'T2', division: 'D1', conference: 'Summit' },
    { name: 'Southwestern Oklahoma State', tier: 'T3', division: 'D2' },
    { name: 'Southeastern Oklahoma', tier: 'T3', division: 'D2' },
    { name: 'East Central Oklahoma', tier: 'T3', division: 'D2' },
    { name: 'Northwestern Oklahoma State', tier: 'T3', division: 'D2' },
    { name: 'Oklahoma Christian', tier: 'T3', division: 'D2' },
    { name: 'Rose State College', tier: 'T4', division: 'JUCO' },
    { name: 'Northeastern Oklahoma A&M', tier: 'T4', division: 'JUCO' },
    { name: 'Tulsa CC', tier: 'T4', division: 'JUCO' },
  ],
  OR: [
    { name: 'Oregon State', tier: 'T1', division: 'D1', conference: 'Pac-12', note: 'National power' },
    { name: 'Oregon', tier: 'T1', division: 'D1', conference: 'Big Ten' },
    { name: 'Gonzaga', tier: 'T2', division: 'D1', conference: 'WCC' },
    { name: 'Portland', tier: 'T2', division: 'D1', conference: 'WCC' },
    { name: 'Portland State', tier: 'T2', division: 'D1', conference: 'Big Sky' },
    { name: 'Pacific University', tier: 'T2', division: 'D1', conference: 'WCC' },
    { name: 'Corban University', tier: 'T3', division: 'NAIA' },
    { name: 'Linfield University', tier: 'T4', division: 'D3' },
    { name: 'Chemeketa CC', tier: 'T4', division: 'JUCO' },
    { name: 'Lane CC', tier: 'T4', division: 'JUCO' },
  ],
  PA: [
    { name: 'Penn State', tier: 'T1', division: 'D1', conference: 'Big Ten' },
    { name: 'Pitt', tier: 'T1', division: 'D1', conference: 'ACC' },
    { name: 'Penn', tier: 'T1', division: 'D1', conference: 'Ivy League' },
    { name: 'Temple', tier: 'T1', division: 'D1', conference: 'AAC' },
    { name: 'Villanova', tier: 'T2', division: 'D1', conference: 'Big East' },
    { name: 'Bucknell', tier: 'T2', division: 'D1', conference: 'Patriot' },
    { name: 'Lafayette', tier: 'T2', division: 'D1', conference: 'Patriot' },
    { name: 'Lehigh', tier: 'T2', division: 'D1', conference: 'Patriot' },
    { name: 'Saint Joseph\'s', tier: 'T2', division: 'D1', conference: 'Atlantic 10' },
    { name: 'La Salle', tier: 'T2', division: 'D1', conference: 'Atlantic 10' },
    { name: 'Drexel', tier: 'T2', division: 'D1', conference: 'CAA' },
    { name: 'West Chester', tier: 'T3', division: 'D2' },
    { name: 'East Stroudsburg', tier: 'T3', division: 'D2' },
    { name: 'Kutztown University', tier: 'T3', division: 'D2' },
    { name: 'Shippensburg University', tier: 'T3', division: 'D2' },
    { name: 'Community College of Philadelphia', tier: 'T4', division: 'JUCO' },
    { name: 'Delaware County CC', tier: 'T4', division: 'JUCO' },
  ],
  SC: [
    { name: 'South Carolina', tier: 'T1', division: 'D1', conference: 'SEC', note: 'National power' },
    { name: 'Clemson', tier: 'T1', division: 'D1', conference: 'ACC', note: 'National power' },
    { name: 'Coastal Carolina', tier: 'T1', division: 'D1', conference: 'Sun Belt', note: 'National power' },
    { name: 'Charleston', tier: 'T2', division: 'D1', conference: 'CAA' },
    { name: 'The Citadel', tier: 'T2', division: 'D1', conference: 'SoCon' },
    { name: 'Wofford', tier: 'T2', division: 'D1', conference: 'SoCon' },
    { name: 'Presbyterian College', tier: 'T2', division: 'D1', conference: 'Big South' },
    { name: 'Furman', tier: 'T2', division: 'D1', conference: 'SoCon' },
    { name: 'Limestone University', tier: 'T3', division: 'D2' },
    { name: 'Erskine College', tier: 'T3', division: 'D2' },
    { name: 'Newberry College', tier: 'T3', division: 'D2' },
    { name: 'North Greenville University', tier: 'T3', division: 'D2' },
    { name: 'Spartanburg Methodist', tier: 'T4', division: 'JUCO' },
    { name: 'Florence-Darlington TC', tier: 'T4', division: 'JUCO' },
  ],
  TN: [
    { name: 'Tennessee', tier: 'T1', division: 'D1', conference: 'SEC', note: 'National power' },
    { name: 'Vanderbilt', tier: 'T1', division: 'D1', conference: 'SEC', note: 'National power' },
    { name: 'Memphis', tier: 'T1', division: 'D1', conference: 'AAC' },
    { name: 'Tennessee Tech', tier: 'T2', division: 'D1', conference: 'OVC' },
    { name: 'Belmont', tier: 'T2', division: 'D1', conference: 'ASUN' },
    { name: 'Austin Peay', tier: 'T2', division: 'D1', conference: 'ASUN' },
    { name: 'East Tennessee State', tier: 'T2', division: 'D1', conference: 'SoCon' },
    { name: 'Tennessee-Martin', tier: 'T2', division: 'D1', conference: 'OVC' },
    { name: 'Tennessee State', tier: 'T2', division: 'D1', conference: 'OVC' },
    { name: 'Lipscomb', tier: 'T2', division: 'D1', conference: 'ASUN' },
    { name: 'Chattanooga', tier: 'T2', division: 'D1', conference: 'SoCon' },
    { name: 'Middle Tennessee', tier: 'T2', division: 'D1', conference: 'CUSA' },
    { name: 'Freed-Hardeman', tier: 'T3', division: 'D2' },
    { name: 'Trevecca Nazarene', tier: 'T3', division: 'D2' },
    { name: 'Bryan College', tier: 'T3', division: 'D2' },
    { name: 'Volunteer State CC', tier: 'T4', division: 'JUCO' },
    { name: 'Roane State CC', tier: 'T4', division: 'JUCO' },
    { name: 'Cleveland State CC', tier: 'T4', division: 'JUCO' },
    { name: 'Chattanooga State CC', tier: 'T4', division: 'JUCO' },
  ],
  TX: [
    { name: 'Texas', tier: 'T1', division: 'D1', conference: 'SEC', note: 'National power' },
    { name: 'Texas A&M', tier: 'T1', division: 'D1', conference: 'SEC', note: 'National power' },
    { name: 'TCU', tier: 'T1', division: 'D1', conference: 'Big 12', note: 'National power' },
    { name: 'Baylor', tier: 'T1', division: 'D1', conference: 'Big 12' },
    { name: 'Texas Tech', tier: 'T1', division: 'D1', conference: 'Big 12' },
    { name: 'Houston', tier: 'T1', division: 'D1', conference: 'Big 12' },
    { name: 'Rice', tier: 'T1', division: 'D1', conference: 'AAC', note: 'Strong academic + baseball' },
    { name: 'Dallas Baptist', tier: 'T1', division: 'D1', conference: 'MVC', note: 'National power' },
    { name: 'Texas State', tier: 'T1', division: 'D1', conference: 'Sun Belt' },
    { name: 'Texas-Arlington', tier: 'T1', division: 'D1', conference: 'Sun Belt' },
    { name: 'Lamar', tier: 'T2', division: 'D1', conference: 'Sun Belt' },
    { name: 'Sam Houston', tier: 'T2', division: 'D1', conference: 'WAC' },
    { name: 'UTSA', tier: 'T2', division: 'D1', conference: 'AAC' },
    { name: 'Stephen F. Austin', tier: 'T2', division: 'D1', conference: 'WAC' },
    { name: 'Abilene Christian', tier: 'T2', division: 'D1', conference: 'WAC' },
    { name: 'Incarnate Word', tier: 'T2', division: 'D1', conference: 'WAC' },
    { name: 'Tarleton State', tier: 'T2', division: 'D1', conference: 'WAC' },
    { name: 'Texas A&M-Corpus Christi', tier: 'T2', division: 'D1', conference: 'WAC' },
    { name: 'Texas-Rio Grande Valley', tier: 'T2', division: 'D1', conference: 'WAC' },
    { name: 'Texas Southern', tier: 'T2', division: 'D1', conference: 'SWAC' },
    { name: 'Prairie View A&M', tier: 'T2', division: 'D1', conference: 'SWAC' },
    { name: 'West Texas A&M', tier: 'T3', division: 'D2' },
    { name: 'Lubbock Christian', tier: 'T3', division: 'D2' },
    { name: 'Texas Wesleyan', tier: 'T3', division: 'NAIA' },
    { name: 'Navarro College', tier: 'T4', division: 'JUCO', note: 'Featured on Netflix\'s "The Chair"' },
    { name: 'San Jacinto College', tier: 'T4', division: 'JUCO' },
    { name: 'Blinn College', tier: 'T4', division: 'JUCO' },
    { name: 'Odessa College', tier: 'T4', division: 'JUCO' },
    { name: 'Angelina College', tier: 'T4', division: 'JUCO' },
    { name: 'Hill College', tier: 'T4', division: 'JUCO' },
  ],
  UT: [
    { name: 'Utah', tier: 'T1', division: 'D1', conference: 'Big 12' },
    { name: 'BYU', tier: 'T1', division: 'D1', conference: 'Big 12' },
    { name: 'Utah State', tier: 'T2', division: 'D1', conference: 'Mountain West' },
    { name: 'Utah Valley', tier: 'T2', division: 'D1', conference: 'WAC' },
    { name: 'Utah Tech', tier: 'T2', division: 'D1', conference: 'WAC' },
    { name: 'Southern Utah', tier: 'T2', division: 'D1', conference: 'WAC' },
    { name: 'Weber State', tier: 'T2', division: 'D1', conference: 'Big Sky' },
    { name: 'Salt Lake CC', tier: 'T4', division: 'JUCO' },
    { name: 'Snow College', tier: 'T4', division: 'JUCO' },
  ],
  VA: [
    { name: 'Virginia', tier: 'T1', division: 'D1', conference: 'ACC', note: 'National power' },
    { name: 'Virginia Tech', tier: 'T1', division: 'D1', conference: 'ACC' },
    { name: 'Old Dominion', tier: 'T1', division: 'D1', conference: 'Sun Belt' },
    { name: 'Liberty', tier: 'T1', division: 'D1', conference: 'ASUN' },
    { name: 'James Madison', tier: 'T2', division: 'D1', conference: 'Sun Belt' },
    { name: 'VCU', tier: 'T2', division: 'D1', conference: 'Atlantic 10' },
    { name: 'George Mason', tier: 'T2', division: 'D1', conference: 'Atlantic 10' },
    { name: 'William & Mary', tier: 'T2', division: 'D1', conference: 'CAA' },
    { name: 'Radford', tier: 'T2', division: 'D1', conference: 'Big South' },
    { name: 'Longwood', tier: 'T2', division: 'D1', conference: 'Big South' },
    { name: 'Hampton', tier: 'T2', division: 'D1', conference: 'CAA' },
    { name: 'Norfolk State', tier: 'T2', division: 'D1', conference: 'MEAC' },
    { name: 'VMI', tier: 'T2', division: 'D1', conference: 'SoCon' },
    { name: 'Lynchburg University', tier: 'T4', division: 'D3' },
    { name: 'Randolph-Macon', tier: 'T4', division: 'D3' },
    { name: 'Patrick Henry CC', tier: 'T4', division: 'JUCO' },
    { name: 'New River Community College', tier: 'T4', division: 'JUCO' },
  ],
  WA: [
    { name: 'Washington', tier: 'T1', division: 'D1', conference: 'Big Ten' },
    { name: 'Washington State', tier: 'T1', division: 'D1', conference: 'Pac-12' },
    { name: 'Gonzaga', tier: 'T2', division: 'D1', conference: 'WCC' },
    { name: 'Seattle University', tier: 'T2', division: 'D1', conference: 'WAC' },
    { name: 'Eastern Washington', tier: 'T2', division: 'D1', conference: 'Big Sky' },
    { name: 'Central Washington', tier: 'T3', division: 'D2' },
    { name: 'Whitworth University', tier: 'T4', division: 'D3' },
    { name: 'Lower Columbia College', tier: 'T4', division: 'JUCO' },
    { name: 'Yakima Valley College', tier: 'T4', division: 'JUCO' },
    { name: 'Big Bend CC', tier: 'T4', division: 'JUCO' },
  ],
  WV: [
    { name: 'West Virginia', tier: 'T1', division: 'D1', conference: 'Big 12' },
    { name: 'Marshall', tier: 'T2', division: 'D1', conference: 'Sun Belt' },
    { name: 'West Virginia State', tier: 'T3', division: 'D2' },
    { name: 'Alderson Broaddus', tier: 'T3', division: 'D2' },
    { name: 'Mountwest CC', tier: 'T4', division: 'JUCO' },
    { name: 'New River CC', tier: 'T4', division: 'JUCO' },
  ],
  WI: [
    { name: 'Wisconsin', tier: 'T1', division: 'D1', conference: 'Big Ten' },
    { name: 'Milwaukee', tier: 'T2', division: 'D1', conference: 'Horizon' },
    { name: 'Wisconsin-Whitewater', tier: 'T4', division: 'D3', note: 'Elite D3 program' },
    { name: 'Wisconsin-Oshkosh', tier: 'T4', division: 'D3' },
    { name: 'Carthage College', tier: 'T4', division: 'D3' },
    { name: 'Madison Area Technical College', tier: 'T4', division: 'JUCO' },
  ],
  // Additional states with smaller programs
  DC: [
    { name: 'Georgetown', tier: 'T1', division: 'D1', conference: 'Big East' },
    { name: 'George Washington', tier: 'T2', division: 'D1', conference: 'Atlantic 10' },
    { name: 'Howard', tier: 'T2', division: 'D1', conference: 'MEAC' },
    { name: 'American University', tier: 'T2', division: 'D1', conference: 'Patriot' },
  ],
  DE: [
    { name: 'Delaware', tier: 'T2', division: 'D1', conference: 'CAA' },
    { name: 'Delaware State', tier: 'T2', division: 'D1', conference: 'MEAC' },
    { name: 'Wilmington University', tier: 'T3', division: 'D2' },
    { name: 'Delaware Technical CC', tier: 'T4', division: 'JUCO' },
  ],
  HI: [
    { name: 'Hawaii', tier: 'T2', division: 'D1', conference: 'Big West' },
    { name: 'Hawaii Pacific', tier: 'T3', division: 'D2' },
    { name: 'Chaminade', tier: 'T4', division: 'D3' },
  ],
  ME: [
    { name: 'Maine', tier: 'T2', division: 'D1', conference: 'America East' },
    { name: 'Maine-Presque Isle', tier: 'T3', division: 'NAIA' },
    { name: 'Husson University', tier: 'T4', division: 'D3' },
  ],
  NH: [
    { name: 'New Hampshire', tier: 'T2', division: 'D1', conference: 'America East' },
    { name: 'Dartmouth', tier: 'T2', division: 'D1', conference: 'Ivy League' },
    { name: 'Southern New Hampshire', tier: 'T3', division: 'D2' },
    { name: 'Great Bay CC', tier: 'T4', division: 'JUCO' },
  ],
  RI: [
    { name: 'Rhode Island', tier: 'T2', division: 'D1', conference: 'Atlantic 10' },
    { name: 'Brown', tier: 'T2', division: 'D1', conference: 'Ivy League' },
    { name: 'Providence', tier: 'T2', division: 'D1', conference: 'Big East' },
    { name: 'Bryant', tier: 'T2', division: 'D1', conference: 'NEC' },
    { name: 'New England Institute of Technology', tier: 'T4', division: 'D3' },
  ],
  VT: [
    { name: 'Vermont', tier: 'T2', division: 'D1', conference: 'America East' },
    { name: 'Norwich University', tier: 'T4', division: 'D3' },
  ],
  WY: [
    { name: 'Wyoming', tier: 'T2', division: 'D1', conference: 'Mountain West' },
    { name: 'Northwest College', tier: 'T4', division: 'JUCO' },
    { name: 'Eastern Wyoming College', tier: 'T4', division: 'JUCO' },
  ],
  SD: [
    { name: 'South Dakota State', tier: 'T2', division: 'D1', conference: 'Summit' },
    { name: 'South Dakota', tier: 'T2', division: 'D1', conference: 'Summit' },
    { name: 'Augustana (SD)', tier: 'T3', division: 'D2' },
    { name: 'Dakota Wesleyan', tier: 'T3', division: 'NAIA' },
    { name: 'Southeast Tech', tier: 'T4', division: 'JUCO' },
  ],
  ND: [
    { name: 'North Dakota State', tier: 'T2', division: 'D1', conference: 'Summit' },
    { name: 'North Dakota', tier: 'T2', division: 'D1', conference: 'Summit' },
    { name: 'Minot State', tier: 'T3', division: 'D2' },
    { name: 'Bismarck State College', tier: 'T4', division: 'JUCO' },
  ],
};

// ── Helper: tier labels for display ──────────────────────────────────────────

const PROGRAM_TIER_LABELS: Record<'T1' | 'T2' | 'T3' | 'T4', string> = {
  T1: 'T1 · D1 Power',
  T2: 'T2 · D1 Mid-Major',
  T3: 'T3 · D2 / NAIA',
  T4: 'T4 · JUCO / D3',
};

// ── Suggested groups ──────────────────────────────────────────────────────────

export interface SuggestedGroup {
  label: 'Reach' | 'Fit' | 'Safety';
  tierLabel: string;
  programs: ProgramEntry[];
}

/**
 * Given an athlete's overall tier ('T1'–'T5') and selected US state codes,
 * return up to 3 groups (Reach / Fit / Safety) with relevant programs.
 *
 * Tier mapping:
 *   T1 athlete → Fit=T1, Safety=T2
 *   T2 athlete → Reach=T1, Fit=T2, Safety=T3
 *   T3 athlete → Reach=T2, Fit=T3, Safety=T4
 *   T4/T5 → Reach=T3, Fit=T4, Safety=T4
 */
export function getSuggestedGroups(
  overallTier: string,
  states: string[],
): SuggestedGroup[] {
  if (states.length === 0) return [];

  // Collect all programs across selected states
  const poolByTier: Record<string, ProgramEntry[]> = { T1: [], T2: [], T3: [], T4: [] };
  for (const state of states) {
    const programs = PROGRAMS_BY_STATE[state] ?? [];
    for (const p of programs) {
      poolByTier[p.tier].push(p);
    }
  }

  // Remove duplicates by name (in case same school is in multiple state lists)
  for (const tier of ['T1', 'T2', 'T3', 'T4'] as const) {
    const seen = new Set<string>();
    poolByTier[tier] = poolByTier[tier].filter((p) => {
      if (seen.has(p.name)) return false;
      seen.add(p.name);
      return true;
    });
    // Sort: noted programs first, then alphabetically
    poolByTier[tier].sort((a, b) => {
      if (a.note && !b.note) return -1;
      if (!a.note && b.note) return 1;
      return a.name.localeCompare(b.name);
    });
  }

  const MAX_PER_GROUP = 6;

  function makeGroup(
    label: 'Reach' | 'Fit' | 'Safety',
    tier: 'T1' | 'T2' | 'T3' | 'T4',
  ): SuggestedGroup | null {
    const programs = poolByTier[tier].slice(0, MAX_PER_GROUP);
    if (programs.length === 0) return null;
    return { label, tierLabel: PROGRAM_TIER_LABELS[tier], programs };
  }

  const groups: SuggestedGroup[] = [];

  switch (overallTier) {
    case 'T1': {
      const fit = makeGroup('Fit', 'T1');
      const safety = makeGroup('Safety', 'T2');
      if (fit) groups.push(fit);
      if (safety) groups.push(safety);
      break;
    }
    case 'T2': {
      const reach = makeGroup('Reach', 'T1');
      const fit = makeGroup('Fit', 'T2');
      const safety = makeGroup('Safety', 'T3');
      if (reach) groups.push(reach);
      if (fit) groups.push(fit);
      if (safety) groups.push(safety);
      break;
    }
    case 'T3': {
      const reach = makeGroup('Reach', 'T2');
      const fit = makeGroup('Fit', 'T3');
      const safety = makeGroup('Safety', 'T4');
      if (reach) groups.push(reach);
      if (fit) groups.push(fit);
      if (safety) groups.push(safety);
      break;
    }
    default: {
      // T4 or T5
      const reach = makeGroup('Reach', 'T3');
      const fit = makeGroup('Fit', 'T4');
      if (reach) groups.push(reach);
      if (fit) groups.push(fit);
      break;
    }
  }

  return groups;
}
