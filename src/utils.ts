/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GradingRule, Marks } from './types';

export const GRADING_RULES: GradingRule[] = [
  { grade: 'A', minScore: 70, maxScore: 100, gradePoint: 5, remark: 'Excellent', colorClass: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200' },
  { grade: 'B', minScore: 60, maxScore: 69, gradePoint: 4, remark: 'Very Good', colorClass: 'text-blue-600 bg-blue-50 dark:bg-blue-950/30 border-blue-200' },
  { grade: 'C', minScore: 50, maxScore: 59, gradePoint: 3, remark: 'Good', colorClass: 'text-amber-600 bg-amber-50 dark:bg-amber-950/30 border-amber-200' },
  { grade: 'D', minScore: 45, maxScore: 49, gradePoint: 2, remark: 'Pass', colorClass: 'text-orange-600 bg-orange-50 dark:bg-orange-950/30 border-orange-200' },
  { grade: 'E', minScore: 40, maxScore: 44, gradePoint: 1, remark: 'Weak Pass', colorClass: 'text-purple-600 bg-purple-50 dark:bg-purple-950/30 border-purple-200' },
  { grade: 'F', minScore: 0, maxScore: 39, gradePoint: 0, remark: 'Fail', colorClass: 'text-rose-600 bg-rose-50 dark:bg-rose-950/30 border-rose-200' }
];

export function getGradeAndGP(totalScore: number): { grade: string; gp: number; remark: string } {
  const rounded = Math.min(100, Math.max(0, Math.round(totalScore)));
  const rule = GRADING_RULES.find(r => rounded >= r.minScore && rounded <= r.maxScore);
  if (rule) {
    return {
      grade: rule.grade,
      gp: rule.gradePoint,
      remark: rule.remark
    };
  }
  return { grade: 'F', gp: 0, remark: 'Fail' };
}

export function computeMarks(test: number, assignment: number, exam: number): Omit<Marks, 'studentMatricNo' | 'courseCode'> {
  const t = Math.max(0, Math.min(30, test));
  const a = Math.max(0, Math.min(10, assignment));
  const e = Math.max(0, Math.min(60, exam));
  const total = t + a + e;
  const { grade, gp } = getGradeAndGP(total);
  return {
    test: t,
    assignment: a,
    exam: e,
    total,
    grade,
    gp
  };
}

export function calculateGPA(studentMarks: Marks[], courses: { [code: string]: number }): { gpa: number; totalUnits: number; earnedPoints: number } {
  let totalUnits = 0;
  let weightedPoints = 0;

  studentMarks.forEach(m => {
    const credits = courses[m.courseCode] || 3; // Default to 3 units if not found
    totalUnits += credits;
    weightedPoints += (m.gp * credits);
  });

  return {
    gpa: totalUnits > 0 ? parseFloat((weightedPoints / totalUnits).toFixed(2)) : 0.00,
    totalUnits,
    earnedPoints: weightedPoints
  };
}
