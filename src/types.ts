/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Student {
  matricNo: string; // unique identifier, e.g. "220303010092"
  name: string;
  level: number; // e.g. 100, 200, 300, 400
  department: string;
  email: string;
}

export interface Course {
  code: string; // e.g. "CSC 401"
  title: string;
  creditUnits: number; // e.g. 3
  level: number; // e.g. 400
  semester: 1 | 2; // 1st semester or 2nd semester
}

export interface Marks {
  studentMatricNo: string;
  courseCode: string;
  test: number;       // Continuous Assessment 1 (max 30)
  assignment: number; // Continuous Assessment 2 (max 10)
  exam: number;       // Exam component (max 60)
  total: number;      // sum of test + assignment + exam (max 100)
  grade: string;      // A, B, C, D, E, F
  gp: number;         // 5-point scale: A=5, B=4, C=3, D=2, E=1, F=0
}

export interface GradingRule {
  grade: string;
  minScore: number;
  maxScore: number;
  gradePoint: number;
  remark: string;
  colorClass: string;
}

export type UserRole = 'student' | 'teacher' | 'admin';
