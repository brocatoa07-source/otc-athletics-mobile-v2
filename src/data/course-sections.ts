/**
 * Completable section registry for each mental course.
 * Excludes `outline` and `video` (read-only informational sections).
 * Keys are `w{weekNum}-{sectionId}` to avoid collisions across weeks.
 */

export interface CourseSection {
  key: string;        // e.g. "w1-ex1"
  weekNum: number;
  sectionId: string;  // matches the SectionToggle `id`
  label: string;
}

export const COURSE_SECTIONS: Record<string, CourseSection[]> = {
  awareness: [
    // Week 1
    { key: 'w1-ponder', weekNum: 1, sectionId: 'ponder', label: 'Questions to Ponder' },
    { key: 'w1-ex1', weekNum: 1, sectionId: 'ex1', label: 'Body Awareness Scan' },
    { key: 'w1-ex2', weekNum: 1, sectionId: 'ex2', label: 'Thought Labeling' },
    { key: 'w1-ex3', weekNum: 1, sectionId: 'ex3', label: 'Autopilot Simulation' },
    { key: 'w1-log', weekNum: 1, sectionId: 'log', label: 'Daily Micro Log' },
    { key: 'w1-assess', weekNum: 1, sectionId: 'assess', label: 'Self-Assessment' },
    // Week 2
    { key: 'w2-ex1', weekNum: 2, sectionId: 'ex1', label: 'Build Your Reset' },
    { key: 'w2-ex2', weekNum: 2, sectionId: 'ex2', label: 'Emotion Map' },
    { key: 'w2-ex3', weekNum: 2, sectionId: 'ex3', label: 'Social Awareness' },
    { key: 'w2-ex4', weekNum: 2, sectionId: 'ex4', label: 'Pressure Micro Sim' },
    { key: 'w2-checkin', weekNum: 2, sectionId: 'checkin', label: 'Daily Check-In' },
    { key: 'w2-assess', weekNum: 2, sectionId: 'assess', label: 'Week 2 Assessment' },
    { key: 'w2-cert', weekNum: 2, sectionId: 'cert', label: 'Certification' },
  ],
  confidence: [
    // Week 3
    { key: 'w3-ponder', weekNum: 3, sectionId: 'ponder', label: 'Questions to Ponder' },
    { key: 'w3-ex1', weekNum: 3, sectionId: 'ex1', label: 'Perfectionism Audit' },
    { key: 'w3-ex2', weekNum: 3, sectionId: 'ex2', label: 'Comparison Trap Reset' },
    { key: 'w3-ex3', weekNum: 3, sectionId: 'ex3', label: 'Build Your Proof List' },
    { key: 'w3-ex4', weekNum: 3, sectionId: 'ex4', label: 'Perfect Trap Sim' },
    { key: 'w3-log', weekNum: 3, sectionId: 'log', label: 'Daily Confidence Log' },
    { key: 'w3-assess', weekNum: 3, sectionId: 'assess', label: 'Self-Assessment' },
    // Week 4
    { key: 'w4-ex1', weekNum: 4, sectionId: 'ex1', label: 'Power Posture Reset' },
    { key: 'w4-ex2', weekNum: 4, sectionId: 'ex2', label: 'If-Then Confidence Plan' },
    { key: 'w4-ex3', weekNum: 4, sectionId: 'ex3', label: 'Slump Visualization' },
    { key: 'w4-ex4', weekNum: 4, sectionId: 'ex4', label: '3-AB Confidence Test' },
    { key: 'w4-box', weekNum: 4, sectionId: 'box', label: 'Build Your Box Routine' },
    { key: 'w4-journal', weekNum: 4, sectionId: 'journal', label: 'Daily Journal' },
    { key: 'w4-dailyproof', weekNum: 4, sectionId: 'dailyproof', label: 'Daily Proof Challenge' },
    { key: 'w4-cert', weekNum: 4, sectionId: 'cert', label: 'Certification' },
  ],
  focus: [
    // Week 5
    { key: 'w5-ex1', weekNum: 5, sectionId: 'ex1', label: 'Focus Stealers Audit' },
    { key: 'w5-ex2', weekNum: 5, sectionId: 'ex2', label: 'Noise Challenge' },
    { key: 'w5-ex3', weekNum: 5, sectionId: 'ex3', label: 'Focus Window Drill' },
    { key: 'w5-tracker', weekNum: 5, sectionId: 'tracker', label: 'Focus Tracker' },
    { key: 'w5-micro', weekNum: 5, sectionId: 'micro', label: 'Daily Micro Rep' },
    { key: 'w5-assess', weekNum: 5, sectionId: 'assess', label: 'Self-Assessment' },
    // Week 6
    { key: 'w6-ex1', weekNum: 6, sectionId: 'ex1', label: 'Build Your Reset Routine' },
    { key: 'w6-ex2', weekNum: 6, sectionId: 'ex2', label: 'Controlled Countdown' },
    { key: 'w6-ex3', weekNum: 6, sectionId: 'ex3', label: 'Eyes & Breath Control' },
    { key: 'w6-sim', weekNum: 6, sectionId: 'sim', label: 'Applied Simulation' },
    { key: 'w6-micro', weekNum: 6, sectionId: 'micro', label: 'Daily Micro Rep' },
    { key: 'w6-cert', weekNum: 6, sectionId: 'cert', label: 'Certification' },
  ],
  'emotional-control': [
    // Week 7
    { key: 'w7-ex1', weekNum: 7, sectionId: 'ex1', label: 'Body-Emotion Map' },
    { key: 'w7-ex2', weekNum: 7, sectionId: 'ex2', label: 'Hot Button Replay' },
    { key: 'w7-ex3', weekNum: 7, sectionId: 'ex3', label: '1-Minute Reset Training' },
    { key: 'w7-log', weekNum: 7, sectionId: 'log', label: 'Emotion Log' },
    { key: 'w7-micro', weekNum: 7, sectionId: 'micro', label: 'Daily Micro Rep' },
    { key: 'w7-assess', weekNum: 7, sectionId: 'assess', label: 'Self-Assessment' },
    // Week 8
    { key: 'w8-ex1', weekNum: 8, sectionId: 'ex1', label: 'Name It to Tame It' },
    { key: 'w8-ex2', weekNum: 8, sectionId: 'ex2', label: 'Fear Reframe' },
    { key: 'w8-ex3', weekNum: 8, sectionId: 'ex3', label: 'Physiological Regulation' },
    { key: 'w8-sim', weekNum: 8, sectionId: 'sim', label: '90-Second Emotion Rule' },
    { key: 'w8-challenge', weekNum: 8, sectionId: 'challenge', label: 'Calm Under Pressure' },
    { key: 'w8-cert', weekNum: 8, sectionId: 'cert', label: 'Certification' },
  ],
  resilience: [
    // Week 9
    { key: 'w9-ex1', weekNum: 9, sectionId: 'ex1', label: 'Shadow Pattern Diagnostic' },
    { key: 'w9-ex2', weekNum: 9, sectionId: 'ex2', label: 'Failure Filter Reframe' },
    { key: 'w9-ex3', weekNum: 9, sectionId: 'ex3', label: 'Bounce-Back Test' },
    { key: 'w9-tracker', weekNum: 9, sectionId: 'tracker', label: 'Bounce-Back Tracker' },
    { key: 'w9-micro', weekNum: 9, sectionId: 'micro', label: 'Daily Micro Rep' },
    { key: 'w9-assess', weekNum: 9, sectionId: 'assess', label: 'Self-Assessment' },
    // Week 10
    { key: 'w10-ex1', weekNum: 10, sectionId: 'ex1', label: 'Controlled Chaos Sim' },
    { key: 'w10-ex2', weekNum: 10, sectionId: 'ex2', label: 'Reframe Board' },
    { key: 'w10-ex3', weekNum: 10, sectionId: 'ex3', label: 'Bounce-Back Blueprint' },
    { key: 'w10-sim', weekNum: 10, sectionId: 'sim', label: 'One Inning Recovery' },
    { key: 'w10-daily', weekNum: 10, sectionId: 'daily', label: 'Daily Rep' },
    { key: 'w10-cert', weekNum: 10, sectionId: 'cert', label: 'Certification' },
  ],
  accountability: [
    // Week 11
    { key: 'w11-ex1', weekNum: 11, sectionId: 'ex1', label: 'Excuse Detector' },
    { key: 'w11-ex2', weekNum: 11, sectionId: 'ex2', label: 'Control Filter' },
    { key: 'w11-ex3', weekNum: 11, sectionId: 'ex3', label: 'Ownership Reset Practice' },
    { key: 'w11-sim', weekNum: 11, sectionId: 'sim', label: 'Ownership Simulation' },
    { key: 'w11-tracker', weekNum: 11, sectionId: 'tracker', label: 'Accountability Tracker' },
    { key: 'w11-micro', weekNum: 11, sectionId: 'micro', label: 'Daily Ownership Rep' },
    { key: 'w11-assess', weekNum: 11, sectionId: 'assess', label: 'Self-Assessment' },
    // Week 12
    { key: 'w12-ex1', weekNum: 12, sectionId: 'ex1', label: 'Build Your Player Standard' },
    { key: 'w12-ex2', weekNum: 12, sectionId: 'ex2', label: 'The Ownership Mirror' },
    { key: 'w12-ex3', weekNum: 12, sectionId: 'ex3', label: 'Feedback Reframe' },
    { key: 'w12-sim', weekNum: 12, sectionId: 'sim', label: 'Standard Simulation' },
    { key: 'w12-tracker', weekNum: 12, sectionId: 'tracker', label: 'Standard Tracker' },
    { key: 'w12-daily', weekNum: 12, sectionId: 'daily', label: 'Daily Rep' },
    { key: 'w12-cert', weekNum: 12, sectionId: 'cert', label: 'Certification' },
  ],
};

/** Get total completable sections for a course */
export function getCourseTotalSections(courseId: string): number {
  return COURSE_SECTIONS[courseId]?.length ?? 0;
}
