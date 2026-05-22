/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Student, Course, Marks } from '../types';
import { computeMarks, GRADING_RULES } from '../utils';
import { 
  BookOpen, Users, Check, Clock, TrendingUp, AlertTriangle, 
  HelpCircle, Save, Award, RefreshCw, Sparkles, Filter 
} from 'lucide-react';

interface TeacherPanelProps {
  students: Student[];
  courses: Course[];
  marks: Marks[];
  onSaveMarks: (studentMatricNo: string, courseCode: string, test: number, assignment: number, exam: number) => void;
}

export default function TeacherPanel({
  students,
  courses,
  marks,
  onSaveMarks
}: TeacherPanelProps) {
  const [selectedCourseCode, setSelectedCourseCode] = useState<string>(
    courses.length > 0 ? courses[0].code : ''
  );

  // Editing forms state: store scores by student matric number
  // Format: { [studentMatricNo]: { test: number, assignment: number, exam: number } }
  const [editingScores, setEditingScores] = useState<{
    [matricNo: string]: { test: string; assignment: string; exam: string; error?: string };
  }>({});

  const selectedCourse = courses.find(c => c.code === selectedCourseCode);

  // Handle course change
  const handleCourseChange = (code: string) => {
    setSelectedCourseCode(code);
    setEditingScores({}); // clear states
  };

  // Populate or edit state for a specific student's scores
  const initStudentEdit = (studentMatricNo: string, currentMark?: Marks) => {
    setEditingScores(prev => ({
      ...prev,
      [studentMatricNo]: {
        test: currentMark ? String(currentMark.test) : '0',
        assignment: currentMark ? String(currentMark.assignment) : '0',
        exam: currentMark ? String(currentMark.exam) : '0',
        error: ''
      }
    }));
  };

  const cancelStudentEdit = (studentMatricNo: string) => {
    setEditingScores(prev => {
      const copy = { ...prev };
      delete copy[studentMatricNo];
      return copy;
    });
  };

  // Save specific student scores
  const handleSaveClick = (studentMatricNo: string) => {
    const editState = editingScores[studentMatricNo];
    if (!editState) return;

    const testVal = parseFloat(editState.test) || 0;
    const assignVal = parseFloat(editState.assignment) || 0;
    const examVal = parseFloat(editState.exam) || 0;

    // Boundary checks
    if (testVal < 0 || testVal > 30) {
      setEditingScores(prev => ({
        ...prev,
        [studentMatricNo]: { ...editState, error: 'Test score must be between 0 and 30.' }
      }));
      return;
    }

    if (assignVal < 0 || assignVal > 10) {
      setEditingScores(prev => ({
        ...prev,
        [studentMatricNo]: { ...editState, error: 'Assignment score must be between 0 and 10.' }
      }));
      return;
    }

    if (examVal < 0 || examVal > 60) {
      setEditingScores(prev => ({
        ...prev,
        [studentMatricNo]: { ...editState, error: 'Exam score must be between 0 and 60.' }
      }));
      return;
    }

    // Call save handler
    onSaveMarks(studentMatricNo, selectedCourseCode, testVal, assignVal, examVal);

    // Remove editing state on success
    cancelStudentEdit(studentMatricNo);
  };

  // Populate dynamic quick fills for marks
  const handleQuickFill = () => {
    if (!selectedCourseCode) return;
    students.forEach(student => {
      // Find current mark, if not exists, create with random realistic scores
      const exist = marks.find(m => m.studentMatricNo === student.matricNo && m.courseCode === selectedCourseCode);
      if (!exist) {
        // Generate nice score
        const randTest = Math.floor(Math.random() * 11) + 18; // 18-28
        const randAssign = Math.floor(Math.random() * 4) + 6; // 6-9
        const randExam = Math.floor(Math.random() * 22) + 33; // 33-54
        onSaveMarks(student.matricNo, selectedCourseCode, randTest, randAssign, randExam);
      }
    });
  };

  // Compute analytics for this course
  const courseMarks = marks.filter(m => m.courseCode === selectedCourseCode);
  const enrolledCount = students.length; // assumes all students of relevant level are enrolled
  
  const scoresWithGrades = courseMarks.filter(m => m.total !== undefined);
  const totalPassed = scoresWithGrades.filter(m => m.total >= 40).length;
  const passRate = scoresWithGrades.length > 0 ? parseFloat(((totalPassed / scoresWithGrades.length) * 100).toFixed(1)) : 0;
  
  const classScoresList = scoresWithGrades.map(m => m.total);
  const classAvg = classScoresList.length > 0 ? parseFloat((classScoresList.reduce((a, b) => a + b, 0) / classScoresList.length).toFixed(1)) : 0;
  const classMax = classScoresList.length > 0 ? Math.max(...classScoresList) : 0;

  // Grade distributions
  const gradeCounts: { [grade: string]: number } = { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0 };
  scoresWithGrades.forEach(m => {
    if (gradeCounts[m.grade] !== undefined) {
      gradeCounts[m.grade]++;
    }
  });

  return (
    <div className="space-y-6" id="teacher_panel_container">
      {/* Selection Banner */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex-1">
          <label className="block text-xs font-semibold uppercase text-teal-600 dark:text-teal-400 tracking-wider mb-2">Subject Selection</label>
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={selectedCourseCode}
              onChange={(e) => handleCourseChange(e.target.value)}
              className="px-4 py-2.5 bg-gray-55 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 rounded-xl text-sm font-semibold focus:ring-1 focus:ring-teal-500 max-w-sm w-full"
              id="teacher_course_selector"
            >
              {courses.map(course => (
                <option key={course.code} value={course.code}>
                  [{course.code}] {course.title} ({course.creditUnits} Units) - {course.level}L
                </option>
              ))}
            </select>

            {selectedCourse && (
              <div className="flex items-center gap-2 text-xs bg-gray-50 dark:bg-gray-800/40 px-3 py-1.5 rounded-lg border border-gray-100 dark:border-gray-800 text-gray-500">
                <Clock className="w-3.5 h-3.5" />
                <span>Semester {selectedCourse.semester} • Level {selectedCourse.level}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleQuickFill}
            className="flex items-center gap-1.5 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-750 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-250 px-4 py-2 rounded-xl text-xs font-semibold transition"
            title="Auto-fills empty student slots with mock grades for demonstration"
            id="quick_add_mock_btn"
          >
            <Sparkles className="w-3.5 h-3.5 text-yellow-500" />
            Quickly Fill Simulated Scores
          </button>
        </div>
      </div>

      {/* Analytics widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="course_key_analytics">
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-5 rounded-2xl flex items-center gap-4 shadow-3xs">
          <div className="p-3 bg-teal-50 dark:bg-teal-950/30 text-teal-650 dark:text-teal-400 rounded-xl">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Graded Students</p>
            <h4 className="text-xl font-bold text-gray-900 dark:text-white mt-0.5">
              {scoresWithGrades.length} <span className="text-xs font-normal text-gray-400">/ {enrolledCount} in view</span>
            </h4>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-5 rounded-2xl flex items-center gap-4 shadow-3xs">
          <div className="p-3 bg-blue-50 dark:bg-blue-950/30 text-blue-650 dark:text-blue-400 rounded-xl">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Class Average Total</p>
            <h4 className="text-xl font-bold text-gray-900 dark:text-white mt-0.5">{classAvg} <span className="text-xs font-normal text-gray-400">/ 100</span></h4>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-5 rounded-2xl flex items-center gap-4 shadow-3xs">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-650 dark:text-emerald-400 rounded-xl">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Highest Grade Score</p>
            <h4 className="text-xl font-bold text-gray-900 dark:text-white mt-0.5">{classMax} <span className="text-xs font-normal text-gray-400">/ 100</span></h4>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-5 rounded-2xl flex items-center gap-4 shadow-3xs">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-650 dark:text-indigo-400 rounded-xl">
            <Check className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Passing Threshold Ratio</p>
            <h4 className="text-xl font-bold text-gray-900 dark:text-white mt-0.5">{passRate}% <span className="text-xs font-normal text-gray-400">({totalPassed} Passed)</span></h4>
          </div>
        </div>
      </div>

      {/* Main split: Grade entry list and distribution bar chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Score Entry Matrix */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-3xs" id="grade_entry_split">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">Continuous Assessment & Final Examination Roll</h3>
              <p className="text-xs text-gray-500">Edit grades for each matriculated student. Total is updated dynamically upon saving.</p>
            </div>
          </div>

          <div className="border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100 dark:divide-gray-800" id="grade_entry_table">
                <thead className="bg-gray-50/70 dark:bg-gray-800/60">
                  <tr>
                    <th scope="col" className="px-4 py-2.5 text-left text-xs font-bold text-gray-500 uppercase">Student Name</th>
                    <th scope="col" className="px-4 py-2.5 text-center text-xs font-bold text-gray-500 uppercase">Test (30)</th>
                    <th scope="col" className="px-4 py-2.5 text-center text-xs font-bold text-gray-500 uppercase">Assign (10)</th>
                    <th scope="col" className="px-4 py-2.5 text-center text-xs font-bold text-gray-500 uppercase">Exam (60)</th>
                    <th scope="col" className="px-4 py-2.5 text-center text-xs font-bold text-gray-500 uppercase">Total (100)</th>
                    <th scope="col" className="px-4 py-2.5 text-center text-xs font-bold text-gray-500 uppercase">Grade</th>
                    <th scope="col" className="px-4 py-2.5 text-right text-xs font-bold text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-800">
                  {students.map(student => {
                    const studentMark = marks.find(
                      m => m.studentMatricNo === student.matricNo && m.courseCode === selectedCourseCode
                    );
                    const isEditing = editingScores[student.matricNo] !== undefined;
                    const editState = editingScores[student.matricNo];

                    // Determine what to display for raw values
                    const displayTest = isEditing ? editState.test : (studentMark ? studentMark.test : '-');
                    const displayAssign = isEditing ? editState.assignment : (studentMark ? studentMark.assignment : '-');
                    const displayExam = isEditing ? editState.exam : (studentMark ? studentMark.exam : '-');
                    
                    // Compute potential total dynamically while editing
                    let displayTotal = '-';
                    let displayGrade = '-';
                    let displayColor = 'text-gray-400 bg-gray-50 border-gray-200';

                    if (isEditing) {
                      const t = parseFloat(editState.test) || 0;
                      const a = parseFloat(editState.assignment) || 0;
                      const e = parseFloat(editState.exam) || 0;
                      const tot = t + a + e;
                      displayTotal = String(tot);
                      const computedMark = computeMarks(t, a, e);
                      displayGrade = computedMark.grade;
                      
                      const matchedRule = GRADING_RULES.find(r => r.grade === displayGrade);
                      if (matchedRule) displayColor = matchedRule.colorClass;
                    } else if (studentMark) {
                      displayTotal = String(studentMark.total);
                      displayGrade = studentMark.grade;
                      const matchedRule = GRADING_RULES.find(r => r.grade === displayGrade);
                      if (matchedRule) displayColor = matchedRule.colorClass;
                    }

                    return (
                      <React.Fragment key={student.matricNo}>
                        <tr className="hover:bg-gray-50/50 dark:hover:bg-gray-850/20 transition-colors">
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className="block text-sm font-semibold text-gray-900 dark:text-gray-150">{student.name}</span>
                            <span className="block text-2xs text-gray-400 font-mono italic">Matric: {student.matricNo}</span>
                          </td>
                          
                          {/* Test (30) field */}
                          <td className="px-2 py-3 text-center whitespace-nowrap text-sm">
                            {isEditing ? (
                              <input
                                type="number"
                                min="0"
                                max="30"
                                step="1"
                                value={editState.test}
                                onChange={(e) => setEditingScores(prev => ({
                                  ...prev,
                                  [student.matricNo]: { ...editState, test: e.target.value }
                                }))}
                                className="w-16 px-1.5 py-1 text-center border border-gray-200 dark:border-gray-750 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 rounded focus:ring-1 focus:ring-teal-500 outline-none"
                                id={`test_input_${student.matricNo}`}
                              />
                            ) : (
                              <span className="font-mono text-gray-700 dark:text-gray-300 font-semibold">{displayTest}</span>
                            )}
                          </td>

                          {/* Assignment (10) field */}
                          <td className="px-2 py-3 text-center whitespace-nowrap text-sm">
                            {isEditing ? (
                              <input
                                type="number"
                                min="0"
                                max="10"
                                step="0.5"
                                value={editState.assignment}
                                onChange={(e) => setEditingScores(prev => ({
                                  ...prev,
                                  [student.matricNo]: { ...editState, assignment: e.target.value }
                                }))}
                                className="w-16 px-1.5 py-1 text-center border border-gray-200 dark:border-gray-750 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 rounded focus:ring-1 focus:ring-teal-500 outline-none"
                                id={`assign_input_${student.matricNo}`}
                              />
                            ) : (
                              <span className="font-mono text-gray-700 dark:text-gray-300 font-semibold">{displayAssign}</span>
                            )}
                          </td>

                          {/* Exam (60) field */}
                          <td className="px-2 py-3 text-center whitespace-nowrap text-sm">
                            {isEditing ? (
                              <input
                                type="number"
                                min="0"
                                max="60"
                                step="1"
                                value={editState.exam}
                                onChange={(e) => setEditingScores(prev => ({
                                  ...prev,
                                  [student.matricNo]: { ...editState, exam: e.target.value }
                                }))}
                                className="w-16 px-1.5 py-1 text-center border border-gray-200 dark:border-gray-750 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 rounded focus:ring-1 focus:ring-teal-500 outline-none"
                                id={`exam_input_${student.matricNo}`}
                              />
                            ) : (
                              <span className="font-mono text-gray-700 dark:text-gray-300 font-semibold">{displayExam}</span>
                            )}
                          </td>

                          {/* Total (100) cell */}
                          <td className="px-2 py-3 text-center whitespace-nowrap text-sm">
                            <span className="font-bold text-gray-900 dark:text-white font-mono">{displayTotal}</span>
                          </td>

                          {/* Grade Cell */}
                          <td className="px-2 py-3 whitespace-nowrap text-center text-xs">
                            <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full border text-xs font-bold leading-none ${displayColor}`}>
                              {displayGrade}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="px-4 py-3 whitespace-nowrap text-right text-xs font-medium">
                            {isEditing ? (
                              <div className="flex justify-end gap-1.5" id="teacher_edit_actions">
                                <button
                                  onClick={() => handleSaveClick(student.matricNo)}
                                  className="text-emerald-600 hover:text-emerald-850 bg-emerald-50 dark:bg-emerald-950/30 p-1.5 rounded-lg border border-emerald-100 dark:border-emerald-900 transition flex items-center gap-1 font-semibold"
                                  title="Store Grades"
                                  id={`teacher_save_score_btn_${student.matricNo}`}
                                >
                                  <Save className="w-3.5 h-3.5" />
                                  <span>Save</span>
                                </button>
                                <button
                                  onClick={() => cancelStudentEdit(student.matricNo)}
                                  className="text-gray-500 hover:text-gray-750 bg-gray-50 dark:bg-gray-800 p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 transition"
                                >
                                  <span>Cancel</span>
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => initStudentEdit(student.matricNo, studentMark)}
                                className="text-teal-600 hover:text-teal-850 bg-teal-50 dark:bg-teal-950/25 px-3 py-1.5 rounded-lg border border-teal-100 dark:border-teal-900 transition-all font-semibold"
                                id={`teacher_edit_score_btn_${student.matricNo}`}
                              >
                                {studentMark ? 'Edit Grade' : 'Grade Student'}
                              </button>
                            )}
                          </td>
                        </tr>

                        {/* Drop down Error Row */}
                        {isEditing && editState.error && (
                          <tr>
                            <td colSpan={7} className="px-4 py-1.5 bg-rose-50 dark:bg-rose-950/10 text-rose-600 text-xs italic">
                              <span className="flex items-center gap-1.5">
                                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                                {editState.error}
                              </span>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Side: Performance summaries and Grade Distribution Curve */}
        <div className="space-y-6">
          {/* Legend and Scoring details */}
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 rounded-2xl shadow-3xs" id="distribution_panel">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2">LASUSTECH Performance Analytics</h3>
            <p className="text-xs text-gray-500 mb-4">Frequency of Grade Point allocation for course [{selectedCourseCode}] in the current class session.</p>

            <div className="space-y-3">
              {GRADING_RULES.map(rule => {
                const count = gradeCounts[rule.grade] || 0;
                const percentage = scoresWithGrades.length > 0 ? (count / scoresWithGrades.length) * 100 : 0;
                
                return (
                  <div key={rule.grade}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center justify-center w-5 h-5 font-bold rounded-sm border text-3xs ${rule.colorClass}`}>
                          {rule.grade}
                        </span>
                        <span className="text-gray-500">[{rule.minScore}-{rule.maxScore}] • {rule.remark}</span>
                      </div>
                      <span className="font-semibold text-gray-850 dark:text-gray-300">{count} {count === 1 ? 'student' : 'students'} ({Math.round(percentage)}%)</span>
                    </div>

                    <div className="w-full h-2.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          rule.grade === 'A' ? 'bg-emerald-500' :
                          rule.grade === 'B' ? 'bg-blue-500' :
                          rule.grade === 'C' ? 'bg-amber-500' :
                          rule.grade === 'D' ? 'bg-orange-500' :
                          rule.grade === 'E' ? 'bg-purple-500' : 'bg-rose-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-gradient-to-br from-teal-500 to-emerald-600 text-white p-6 rounded-2xl shadow-sm" id="grading_policy_tip">
            <div className="flex items-start gap-3">
              <Award className="w-5 h-5 mt-0.5 shrink-0" />
              <div>
                <h4 className="text-sm font-bold">Lagos State Grading Standards</h4>
                <p className="text-2xs text-teal-100 mt-1 lines-spaced">
                  Lagos State University of Science and Technology, College of Basic Science (Department of Computer Science) operates on a 5-Point scale:
                </p>
                <div className="mt-2.5 grid grid-cols-2 gap-2 text-3xs font-semibold text-teal-50 text-center">
                  <div className="bg-white/10 px-2 py-1 rounded">70+ = Grade A (5.0 GP)</div>
                  <div className="bg-white/10 px-2 py-1 rounded">60-69 = Grade B (4.0 GP)</div>
                  <div className="bg-white/10 px-2 py-1 rounded">50-59 = Grade C (3.0 GP)</div>
                  <div className="bg-white/10 px-2 py-1 rounded">45-49 = Grade D (2.0 GP)</div>
                  <div className="bg-white/10 px-2 py-1 rounded">40-44 = Grade E (1.0 GP)</div>
                  <div className="bg-white/10 px-2 py-1 rounded">&lt;40 = Grade F (0.0 GP)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
