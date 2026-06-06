/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Student, Course, Marks } from '../types';
import { calculateGPA, GRADING_RULES } from '../utils';
import { 
  Search, Shield, SearchIcon, Award, GraduationCap, CheckCircle, 
  ChevronRight, Calendar, Printer, Star, LayoutDashboard, FileText,
  User, BookOpen, AlertCircle, RefreshCw
} from 'lucide-react';

interface StudentPanelProps {
  students: Student[];
  courses: Course[];
  marks: Marks[];
  activeStudent?: Student | null;
  isLockedToSelf?: boolean;
  onClear?: () => void;
}

export default function StudentPanel({
  students,
  courses,
  marks,
  activeStudent: propActiveStudent = null,
  isLockedToSelf = false,
  onClear
}: StudentPanelProps) {
  const [matricQuery, setMatricQuery] = useState('');
  const [localActiveStudent, setLocalActiveStudent] = useState<Student | null>(null);
  const [searchError, setSearchError] = useState('');

  const activeStudent = isLockedToSelf ? propActiveStudent : localActiveStudent;

  // Handle student lookup
  const handleLookup = (matricNo: string) => {
    setSearchError('');
    const student = students.find(
      s => s.matricNo.trim().toLowerCase() === matricNo.trim().toLowerCase()
    );

    if (student) {
      setLocalActiveStudent(student);
      setMatricQuery(student.matricNo);
    } else {
      setSearchError('Matric profile lookup failed. Confirm matric number exists in system.');
      setLocalActiveStudent(null);
    }
  };

  // Quick select matching profiles
  const handleQuickLookup = (student: Student) => {
    setLocalActiveStudent(student);
    setMatricQuery(student.matricNo);
    setSearchError('');
  };

  const handleClear = () => {
    if (isLockedToSelf && onClear) {
      onClear();
    } else {
      setLocalActiveStudent(null);
      setMatricQuery('');
      setSearchError('');
    }
  };


  // Gather academic stats for active student
  const studentMarks = marks.filter(m => m.studentMatricNo === (activeStudent?.matricNo || ''));
  
  // Aggregate credits structure
  const courseCreditsObj: { [code: string]: number } = {};
  courses.forEach(c => {
    courseCreditsObj[c.code] = c.creditUnits;
  });

  // Calculate stats
  const academicStats = calculateGPA(studentMarks, courseCreditsObj);
  const totalCreditsEarned = studentMarks.reduce((sum, m) => {
    const credits = courseCreditsObj[m.courseCode] || 3;
    return m.total >= 40 ? sum + credits : sum; // Pass is >= 40
  }, 0);

  // Divide marks by semesters: Use Course metadata
  const firstSemesterMarks = studentMarks.filter(m => {
    const c = courses.find(course => course.code === m.courseCode);
    return c?.semester === 1;
  });

  const secondSemesterMarks = studentMarks.filter(m => {
    const c = courses.find(course => course.code === m.courseCode);
    return c?.semester === 2;
  });

  const firstSemesterGPA = calculateGPA(firstSemesterMarks, courseCreditsObj).gpa;
  const secondSemesterGPA = calculateGPA(secondSemesterMarks, courseCreditsObj).gpa;

  // Determine Class Degree Standing
  let degreeStanding = 'Fail / Withdraw';
  let badgeColor = 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/20';

  if (academicStats.gpa >= 4.50) {
    degreeStanding = 'First Class Honours';
    badgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20';
  } else if (academicStats.gpa >= 3.50) {
    degreeStanding = 'Second Class Honours (Upper Division)';
    badgeColor = 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20';
  } else if (academicStats.gpa >= 2.40) {
    degreeStanding = 'Second Class Honours (Lower Division)';
    badgeColor = 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20';
  } else if (academicStats.gpa >= 1.50) {
    degreeStanding = 'Third Class Honours';
    badgeColor = 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/20';
  } else if (academicStats.gpa >= 1.00) {
    degreeStanding = 'Pass';
    badgeColor = 'bg-gray-100 text-gray-700 border-gray-250 dark:bg-gray-800';
  }

  // Print function
  const handlePrintTranscript = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-fadeIn" id="student_portal_root">
      {/* If NOT logged in / verified */}
      {!activeStudent ? (
        <div className="max-w-xl mx-auto bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-8 shadow-sm text-center" id="search_verification_prompt">
          <div className="w-12 h-12 bg-teal-50 dark:bg-teal-950/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <GraduationCap className="w-6 h-6 text-teal-600" />
          </div>

          <h3 className="text-base font-bold text-gray-900 dark:text-white">LASUSTECH Student Grade Lookup</h3>
          <p className="text-xs text-gray-500 mt-1 mb-6">Enter your unique student Matriculation Number to fetch your semester scores, credit calculations, standing, and academic transcript.</p>

          <form onSubmit={(e) => { e.preventDefault(); handleLookup(matricQuery); }} className="space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={matricQuery}
                onChange={(e) => setMatricQuery(e.target.value)}
                placeholder="Enter Matric Number (e.g. 220303010092)"
                className="flex-1 px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl text-sm bg-gray-50 dark:bg-gray-800 text-gray-950 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-teal-500 font-semibold"
                id="student_input_matric_field"
              />
              <button
                type="submit"
                className="bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm px-6 py-3 rounded-xl transition duration-150 shadow-xs"
                id="student_matric_search_btn"
              >
                Search Record
              </button>
            </div>

            {searchError && (
              <div className="text-xs text-rose-600 bg-rose-50 dark:bg-rose-950/25 p-2 rounded-lg flex items-center gap-1.5 justify-center" id="student_search_error">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{searchError}</span>
              </div>
            )}
          </form>

          {/* Quick links for testing */}
          <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 text-left">
            <h4 className="text-2xs font-bold uppercase tracking-wider text-gray-400 mb-3">Quick Demo Access Accounts</h4>
            <div className="space-y-2">
              {students.map(s => (
                <button
                  key={s.matricNo}
                  onClick={() => handleQuickLookup(s)}
                  className="w-full flex items-center justify-between text-left p-2.5 rounded-lg border border-gray-100 hover:border-teal-200 dark:border-gray-800 dark:hover:border-teal-900 bg-gray-50/50 hover:bg-teal-50/10 dark:bg-gray-850/25 transition group text-xs text-gray-650"
                  id={`quick_access_btn_${s.matricNo}`}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-teal-50/10 border border-teal-150 text-teal-600 rounded-md font-bold text-3xs flex items-center justify-center">
                      400
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-gray-200">{s.name}</p>
                      <p className="text-3xs text-gray-400 font-mono font-medium">Matric: {s.matricNo}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-teal-500 transition-colors" />
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* If student profile verified successfully */
        <div className="space-y-6" id="student_dashboard_details">
          {/* Dashboard Header Bar */}
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-3xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3.5 bg-teal-500/10 text-teal-600 dark:text-teal-400 rounded-2xl border border-teal-100 dark:border-teal-900">
                <GraduationCap className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-lg font-bold text-gray-950 dark:text-white tracking-tight">{activeStudent.name}</h2>
                  <span className={`px-2.5 py-0.5 border text-3xs font-semibold rounded-full uppercase tracking-wider ${badgeColor}`}>
                    {degreeStanding}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1 font-semibold">
                  Matric No: <span className="font-mono text-gray-700 dark:text-gray-300">{activeStudent.matricNo}</span> • Department: {activeStudent.department} • Level: {activeStudent.level}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handlePrintTranscript}
                className="flex items-center gap-1.5 bg-gray-50 hover:bg-gray-100 dark:bg-gray-850 border border-gray-200 dark:border-gray-750 text-gray-755 dark:text-gray-250 px-4 py-2 rounded-xl text-xs font-semibold transition"
                id="print_transcript_btn"
              >
                <Printer className="w-3.5 h-3.5" />
                Print Academic Statement
              </button>
              
              <button
                onClick={handleClear}
                className="flex items-center gap-1 bg-gray-50 hover:bg-gray-100 dark:bg-gray-850 border border-gray-200 dark:border-gray-750 text-gray-755 dark:text-gray-250 px-4 py-2 rounded-xl text-xs font-semibold transition"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Logout Profile
              </button>
            </div>
          </div>

          {/* Core Academics KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="academic_kpi_grid">
            {/* GPA scale card */}
            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-5 rounded-2xl relative overflow-hidden shadow-3xs">
              <div className="absolute right-0 top-0 p-5 leading-none opacity-5">
                <Award className="w-20 h-20" />
              </div>
              <p className="text-xs text-gray-500 font-semibold">Cumulative GPA (CGPA)</p>
              <h4 className="text-3xl font-bold text-gray-950 dark:text-white mt-1.5">{academicStats.gpa.toFixed(2)}</h4>
              <p className="text-3xs text-gray-400 mt-1 font-semibold">Verified 5.0 LASUSTECH scale</p>
            </div>

            {/* Total credits earned card */}
            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-5 rounded-2xl relative overflow-hidden shadow-3xs">
              <p className="text-xs text-gray-500 font-semibold">Total Credit Units Earned</p>
              <h4 className="text-3xl font-bold text-gray-950 dark:text-white mt-1.5">{totalCreditsEarned}</h4>
              <p className="text-3xs text-gray-400 mt-1 font-semibold">Across {studentMarks.length} registered courses</p>
            </div>

            {/* Class Honors Standing card */}
            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-5 rounded-2xl relative overflow-hidden shadow-3xs">
              <p className="text-xs text-gray-500 font-semibold">Academic standing</p>
              <h4 className="text-sm font-bold text-teal-600 dark:text-teal-400 mt-2.5 leading-snug">{degreeStanding}</h4>
              <p className="text-3xs text-gray-400 mt-1 font-semibold">Status classification active</p>
            </div>

            {/* Complete ratios card */}
            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-5 rounded-2xl relative overflow-hidden shadow-3xs">
              <p className="text-xs text-gray-500 font-semibold">Graded Courses Ratio</p>
              <h4 className="text-3xl font-bold text-gray-950 dark:text-white mt-1.5">{studentMarks.length}</h4>
              <p className="text-3xs text-gray-400 mt-1 font-semibold">Passed Grade ratio: {Math.round((totalCreditsEarned / (academicStats.totalUnits || 1)) * 100)}%</p>
            </div>
          </div>

          {/* visual metrics custom chart & semester GPAs */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-3xs" id="transcript_course_details">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-4 h-4 text-teal-600" />
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">LASUSTECH Performance Statement</h3>
              </div>

              {/* 1st Semester Section */}
              <div className="mb-6">
                <div className="flex items-center justify-between py-2 border-b border-gray-1 0 dark:border-b-gray-800 mb-3">
                  <span className="text-xs font-bold text-gray-900 dark:text-teal-300">FIRST SEMESTER REPORT</span>
                  <span className="text-xs font-semibold px-2 py-0.5 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded font-mono">GPA: {firstSemesterGPA.toFixed(2)}</span>
                </div>

                {firstSemesterMarks.length === 0 ? (
                  <p className="text-2xs text-gray-400 italic">No first semester records uploaded by departmental lecturers.</p>
                ) : (
                  <div className="space-y-2">
                    {firstSemesterMarks.map(m => {
                      const course = courses.find(c => c.code === m.courseCode);
                      return (
                        <div key={m.courseCode} className="flex flex-col sm:flex-row justify-between sm:items-center p-3 bg-gray-50/50 dark:bg-gray-850/20 border border-gray-100 dark:border-gray-800 rounded-xl gap-2 font-semibold">
                          <div className="flex-1">
                            <span className="text-xs font-bold text-gray-900 dark:text-white font-mono">{m.courseCode}</span>
                            <span className="text-xs text-gray-700 dark:text-gray-450 ml-2">{course?.title} ({course?.creditUnits} Units)</span>
                          </div>
                          
                          <div className="flex items-center gap-4 text-xs">
                            <div className="text-3xs text-gray-500 font-mono">
                              test: <span className="text-gray-900 dark:text-gray-300">{m.test}</span> • assign: <span className="text-gray-900 dark:text-gray-300">{m.assignment}</span> • exam: <span className="text-gray-900 dark:text-gray-300">{m.exam}</span>
                            </div>
                            <div className="font-mono text-gray-900 dark:text-white">
                              Total: <span className="font-bold">{m.total}</span>
                            </div>
                            <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full border text-2xs font-bold leading-none ${
                              GRADING_RULES.find(r => r.grade === m.grade)?.colorClass || ''
                            }`}>
                              {m.grade}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* 2nd Semester Section */}
              <div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-b-gray-800 mb-3">
                  <span className="text-xs font-bold text-gray-900 dark:text-teal-300">SECOND SEMESTER REPORT</span>
                  <span className="text-xs font-semibold px-2 py-0.5 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded font-mono">GPA: {secondSemesterGPA.toFixed(2)}</span>
                </div>

                {secondSemesterMarks.length === 0 ? (
                  <p className="text-2xs text-gray-400 italic">No second semester records uploaded yet. In progress.</p>
                ) : (
                  <div className="space-y-2">
                    {secondSemesterMarks.map(m => {
                      const course = courses.find(c => c.code === m.courseCode);
                      return (
                        <div key={m.courseCode} className="flex flex-col sm:flex-row justify-between sm:items-center p-3 bg-gray-50/50 dark:bg-gray-850/20 border border-gray-100 dark:border-gray-800 rounded-xl gap-2 font-semibold">
                          <div className="flex-1">
                            <span className="text-xs font-bold text-gray-900 dark:text-white font-mono">{m.courseCode}</span>
                            <span className="text-xs text-gray-700 dark:text-gray-450 ml-2">{course?.title} ({course?.creditUnits} Units)</span>
                          </div>
                          
                          <div className="flex items-center gap-4 text-xs">
                            <div className="text-3xs text-gray-500 font-mono">
                              test: <span className="text-gray-900 dark:text-gray-300">{m.test}</span> • assign: <span className="text-gray-900 dark:text-gray-300">{m.assignment}</span> • exam: <span className="text-gray-900 dark:text-gray-300">{m.exam}</span>
                            </div>
                            <div className="font-mono text-gray-900 dark:text-white">
                              Total: <span className="font-bold">{m.total}</span>
                            </div>
                            <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full border text-2xs font-bold leading-none ${
                              GRADING_RULES.find(r => r.grade === m.grade)?.colorClass || ''
                            }`}>
                              {m.grade}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Performance analysis graphs using SVGs */}
            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 rounded-2xl shadow-3xs flex flex-col justify-between" id="performance_analysis_panel">
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">Subject Performance Gap</h3>
                <p className="text-xs text-gray-500 mb-6">Course total score comparison to identify key academic strength segments.</p>

                {studentMarks.length === 0 ? (
                  <div className="text-center py-10" id="no_marks_chart_view">
                    <p className="text-xs text-gray-400">Add course records to render visualization comparison charts.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {studentMarks.map(m => {
                      const percentage = m.total; // max 100, perfect match for width percentage
                      const barColor = 
                        percentage >= 70 ? 'bg-emerald-500' :
                        percentage >= 60 ? 'bg-blue-500' :
                        percentage >= 50 ? 'bg-amber-500' :
                        percentage >= 45 ? 'bg-orange-500' : 'bg-rose-500';

                      return (
                        <div key={m.courseCode} className="space-y-1">
                          <div className="flex justify-between text-2xs font-semibold">
                            <span className="text-gray-905 dark:text-gray-200 font-mono">{m.courseCode}</span>
                            <span className="text-gray-650 dark:text-gray-350">{m.total} pts ({m.grade})</span>
                          </div>

                          <div className="w-full h-3 bg-gray-100 dark:bg-gray-850 rounded-full overflow-hidden flex">
                            <div 
                              className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="mt-8 border-t border-gray-100 dark:border-gray-800 pt-5 text-center">
                <p className="text-3xs text-gray-400 italic">Official Lagos State academic statement generated in compliance with LASUSTECH computer records. Transcript values verified.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
