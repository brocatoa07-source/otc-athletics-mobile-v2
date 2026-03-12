import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';

const HEADER =
  'program_title,week,day_label,day_type,category,order,exercise,sets,reps,load,tempo,rest_sec,notes,superset_group';

// Full Week 1 template — all 5 days, all categories per day type
const ROWS = [
  // ── Upper A (Strength) ──
  'Karteria Template,1,Upper A,strength,Prep,1,Foam Roll T-Spine,1,2 min,,,,',
  'Karteria Template,1,Upper A,strength,Prep,2,90/90 ER Lift-Offs,2,8/side,,,,',
  'Karteria Template,1,Upper A,strength,Plyo,1,Overhead Med Ball Slam,2,5,,,,',
  'Karteria Template,1,Upper A,strength,Plyo,2,Explosive Push-Up,2,5,,,,',
  'Karteria Template,1,Upper A,strength,Loaded Power,1,Hang Clean,3,3,RPE 7,,,',
  'Karteria Template,1,Upper A,strength,Main Superset,1,Neutral Grip DB Bench Press,4,6,RPE 8,3010,120,,A',
  'Karteria Template,1,Upper A,strength,Main Superset,2,Scap Y ISO Hold,4,20-30s,,,,A',
  'Karteria Template,1,Upper A,strength,Secondary Lifts,1,Chest-Supported DB Row,3,8,RPE 7,,,',
  'Karteria Template,1,Upper A,strength,Accessories,1,Face Pulls,3,12,,,,',
  'Karteria Template,1,Upper A,strength,Accessories,2,Band Pull-Aparts,3,15,,,,',
  'Karteria Template,1,Upper A,strength,Core,1,Pallof Press,3,10/side,,,,',
  'Karteria Template,1,Upper A,strength,Finisher,1,Battle Ropes,3,30s,,,60,',

  // ── Lower A (Strength) ──
  'Karteria Template,1,Lower A,strength,Prep,1,Foam Roll Quads & Adductors,1,2 min,,,,',
  'Karteria Template,1,Lower A,strength,Prep,2,World\'s Greatest Stretch,2,5/side,,,,',
  'Karteria Template,1,Lower A,strength,Plyo,1,Broad Jump,3,4,,,,',
  'Karteria Template,1,Lower A,strength,Loaded Power,1,Trap Bar Jump Shrug,3,3,BW+50%,,,',
  'Karteria Template,1,Lower A,strength,Main Superset,1,Back Squat,4,5,RPE 8,3110,150,,A',
  'Karteria Template,1,Lower A,strength,Main Superset,2,Banded Hip Flexor March,4,10/side,,,,A',
  'Karteria Template,1,Lower A,strength,Secondary Lifts,1,Romanian Deadlift,3,8,RPE 7,,,',
  'Karteria Template,1,Lower A,strength,Accessories,1,Walking Lunges,3,10/side,,,,',
  'Karteria Template,1,Lower A,strength,Core,1,Dead Bug,3,8/side,,,,',
  'Karteria Template,1,Lower A,strength,Finisher,1,Sled Push,3,40 yds,,,90,',

  // ── Active Recovery ──
  'Karteria Template,1,AR Day,active_recovery,Prep & Mobility,1,Hip 90/90 Stretch,2,8/side,,,,',
  'Karteria Template,1,AR Day,active_recovery,Prep & Mobility,2,Cat-Cow,2,10,,,,',
  'Karteria Template,1,AR Day,active_recovery,Isometrics,1,Wall Sit,3,30s,,,,',
  'Karteria Template,1,AR Day,active_recovery,Isometrics,2,Copenhagen Plank,3,20s/side,,,,',
  'Karteria Template,1,AR Day,active_recovery,Full Body Circuit,1,Goblet Squat,2,10,BW,,,',
  'Karteria Template,1,AR Day,active_recovery,Full Body Circuit,2,Push-Up,2,12,,,,',
  'Karteria Template,1,AR Day,active_recovery,Elasticity,1,Pogo Hops,3,15s,,,,',
  'Karteria Template,1,AR Day,active_recovery,Sprint Mechanics,1,A-Skip Drill,3,20m,,,,',

  // ── Upper B (Strength) ──
  'Karteria Template,1,Upper B,strength,Prep,1,Band Shoulder Dislocates,2,10,,,,',
  'Karteria Template,1,Upper B,strength,Prep,2,Thoracic Rotation,2,8/side,,,,',
  'Karteria Template,1,Upper B,strength,Plyo,1,Rotational Med Ball Throw,3,5/side,,,,',
  'Karteria Template,1,Upper B,strength,Loaded Power,1,DB Push Press,3,4,RPE 7,,,',
  'Karteria Template,1,Upper B,strength,Main Superset,1,Barbell Overhead Press,4,5,RPE 8,2010,120,,A',
  'Karteria Template,1,Upper B,strength,Main Superset,2,Chin-Up,4,6-8,,,,A',
  'Karteria Template,1,Upper B,strength,Secondary Lifts,1,Incline DB Press,3,8,RPE 7,,,',
  'Karteria Template,1,Upper B,strength,Accessories,1,Lateral Raises,3,12,,,,',
  'Karteria Template,1,Upper B,strength,Core,1,Half-Kneeling Cable Chop,3,10/side,,,,',
  'Karteria Template,1,Upper B,strength,Finisher,1,Farmer Walk,3,40 yds,,,60,',

  // ── Lower B (Strength) ──
  'Karteria Template,1,Lower B,strength,Prep,1,Foam Roll IT Band & Glutes,1,2 min,,,,',
  'Karteria Template,1,Lower B,strength,Prep,2,Lateral Lunge to World\'s Greatest,2,5/side,,,,',
  'Karteria Template,1,Lower B,strength,Plyo,1,Single-Leg Lateral Bound,3,4/side,,,,',
  'Karteria Template,1,Lower B,strength,Loaded Power,1,KB Swing,3,8,,,,',
  'Karteria Template,1,Lower B,strength,Main Superset,1,Hex Bar Deadlift,4,5,RPE 8,2010,150,,A',
  'Karteria Template,1,Lower B,strength,Main Superset,2,Single-Leg Glute Bridge,4,8/side,,,,A',
  'Karteria Template,1,Lower B,strength,Secondary Lifts,1,Bulgarian Split Squat,3,8/side,RPE 7,,,',
  'Karteria Template,1,Lower B,strength,Accessories,1,Leg Curl,3,10,,,,',
  'Karteria Template,1,Lower B,strength,Core,1,Suitcase Carry,3,30m/side,,,,',
  'Karteria Template,1,Lower B,strength,Finisher,1,Bike Sprint,3,20s,,,90,',
];

/**
 * Generate a Karteria CSV template and open the share sheet.
 */
export async function generateAndShareTemplate(): Promise<void> {
  const csv = [HEADER, ...ROWS].join('\n');
  const fileUri = FileSystem.cacheDirectory + 'karteria-import-template.csv';

  await FileSystem.writeAsStringAsync(fileUri, csv, {
    encoding: FileSystem.EncodingType.UTF8,
  });

  const canShare = await Sharing.isAvailableAsync();
  if (canShare) {
    await Sharing.shareAsync(fileUri, {
      mimeType: 'text/csv',
      dialogTitle: 'Karteria CSV Template',
      UTI: 'public.comma-separated-values-text',
    });
  }
}
