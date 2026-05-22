/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Student, Course, Marks, UserRole } from './types';
import { DEFAULT_STUDENTS, DEFAULT_COURSES, DEFAULT_MARKS } from './data/defaultData';
import AdminPanel from './components/AdminPanel';
import TeacherPanel from './components/TeacherPanel';
import StudentPanel from './components/StudentPanel';
import { 
  School, GraduationCap, Award, BookOpen, Settings, Users, 
  HelpCircle, CheckCircle, Database, Moon, Sun, Monitor
} from 'lucide-react';

export default function App() {
  // Theme state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      return saved === 'dark';
    }
    return false;
  });

  // Database core states with local persistence
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('srms_students');
    return saved ? JSON.parse(saved) : DEFAULT_STUDENTS;
  });

  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem('srms_courses');
    return saved ? JSON.parse(saved) : DEFAULT_COURSES;
  });

  const [marks, setMarks] = useState<Marks[]>(() => {
    const saved = localStorage.getItem('srms_marks');
    return saved ? JSON.parse(saved) : DEFAULT_MARKS;
  });

  // Active Role Switcher State
  const [activeRole, setActiveRole] = useState<UserRole>('student');

  // Sync to database
  useEffect(() => {
    localStorage.setItem('srms_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('srms_courses', JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem('srms_marks', JSON.stringify(marks));
  }, [marks]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Handler functions for Admin: Student management
  const handleAddStudent = (newStudent: Student) => {
    setStudents(prev => [...prev, newStudent]);
  };

  const handleUpdateStudent = (updatedStudent: Student) => {
    setStudents(prev => prev.map(s => s.matricNo === updatedStudent.matricNo ? updatedStudent : s));
  };

  const handleDeleteStudent = (matricNo: string) => {
    setStudents(prev => prev.filter(s => s.matricNo !== matricNo));
    // cascade delete marks
    setMarks(prev => prev.filter(m => m.studentMatricNo !== matricNo));
  };

  // Handler functions for Admin: Course management
  const handleAddCourse = (newCourse: Course) => {
    setCourses(prev => [...prev, newCourse]);
  };

  const handleUpdateCourse = (updatedCourse: Course) => {
    setCourses(prev => prev.map(c => c.code === updatedCourse.code ? updatedCourse : c));
  };

  const handleDeleteCourse = (code: string) => {
    setCourses(prev => prev.filter(c => c.code !== code));
    // cascade delete marks
    setMarks(prev => prev.filter(m => m.courseCode !== code));
  };

  // Handler functions for Teacher: Score updates
  const handleSaveMarks = (
    studentMatricNo: string,
    courseCode: string,
    test: number,
    assignment: number,
    exam: number
  ) => {
    const total = test + assignment + exam;
    
    // Calculate Grade & GP (using the standard 5-point scale)
    const rounded = Math.min(100, Math.max(0, Math.round(total)));
    let grade = 'F';
    let gp = 0;

    if (rounded >= 70) { grade = 'A'; gp = 5; }
    else if (rounded >= 60) { grade = 'B'; gp = 4; }
    else if (rounded >= 50) { grade = 'C'; gp = 3; }
    else if (rounded >= 45) { grade = 'D'; gp = 2; }
    else if (rounded >= 40) { grade = 'E'; gp = 1; }
    else { grade = 'F'; gp = 0; }

    const newMark: Marks = {
      studentMatricNo,
      courseCode,
      test,
      assignment,
      exam,
      total,
      grade,
      gp
    };

    setMarks(prev => {
      const matchIndex = prev.findIndex(
        m => m.studentMatricNo === studentMatricNo && m.courseCode === courseCode
      );

      if (matchIndex >= 0) {
        const copy = [...prev];
        copy[matchIndex] = newMark;
        return copy;
      } else {
        return [...prev, newMark];
      }
    });
  };

  // Reset database helper
  const handleResetDatabase = () => {
    if (confirm('Are you sure you want to reset the academic system back to defaults? All custom changes will be deleted.')) {
      setStudents(DEFAULT_STUDENTS);
      setCourses(DEFAULT_COURSES);
      setMarks(DEFAULT_MARKS);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-black text-gray-800 dark:text-gray-100 font-sans transition-colors duration-200">
      
      {/* Educational Header Banner */}
      <header className="bg-white dark:bg-gray-950 border-b border-gray-150 dark:border-gray-900 sticky top-0 z-40 shadow-xs" id="main_logo_header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Institution Identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white font-black text-lg shadow-sm">
              L
            </div>
            <div>
              <h1 className="text-sm font-extrabold text-teal-850 dark:text-teal-300 uppercase tracking-widest leading-none">
                Lagos State University of Science & Technology
              </h1>
              <span className="text-3xs text-gray-450 dark:text-gray-400 font-bold uppercase tracking-wider block mt-1">
                College of Basic Science • Department of Computer Science
              </span>
            </div>
          </div>

          {/* Supervisor / Title */}
          <div className="text-right hidden lg:block border-l border-gray-100 dark:border-gray-800 pl-4">
            <p className="text-3xs text-gray-450 uppercase tracking-wider font-semibold">Final Year Project Demo • Year 2026</p>
            <p className="text-2xs font-bold text-gray-700 dark:text-gray-300">Supervised by: Mr. Akinrinlola Ibitoye Akinfolajimi</p>
          </div>

          {/* Theme Switcher & Reset Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-lg transition"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            
            <button
              onClick={handleResetDatabase}
              className="px-3 py-1.5 text-3xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900 rounded-lg transition"
              id="reset_database_btn"
              title="Restores seed files"
            >
              Reset Database Defaults
            </button>
          </div>
        </div>
      </header>

      {/* Main container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Project Title and Intro Section */}
        <section className="bg-white dark:bg-gray-950 border border-gray-150/60 dark:border-gray-900 p-6 rounded-2xl shadow-3xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-teal-650 dark:text-teal-400 font-semibold uppercase tracking-wider">
              <Database className="w-3.5 h-3.5" />
              <span>Student Result Management System (SRMS)</span>
            </div>
            <h2 className="text-2xl font-black text-gray-950 dark:text-white tracking-tight">
              Design & Implementation Framework
            </h2>
            <p className="text-xs text-gray-500 max-w-2xl mt-1 leading-snug">
              A computerized system designed by <span className="font-semibold text-gray-800 dark:text-gray-200">Odubona Muiz Adegbola (220303010092)</span> as a final year academic proposal. It automates score computation, GPA formulation, and result transparency.
            </p>
          </div>

          {/* Thesis / matric card lookup stats */}
          <div className="bg-gray-50 dark:bg-gray-900/40 p-3.5 rounded-xl border border-gray-100 dark:border-gray-800 text-xs flex items-center gap-3 shrink-0">
            <GraduationCap className="w-4.5 h-4.5 text-teal-600" />
            <div>
              <span className="block font-bold text-gray-800 dark:text-gray-300 font-mono">MATRIC NO: 220303010092</span>
              <span className="block text-3xs text-gray-400 uppercase tracking-widest font-semibold mt-0.5">Level: 400 • Level Advisor APPROVED</span>
            </div>
          </div>
        </section>

        {/* Global Role Switcher Navigation (Teachers, Students, Admins) */}
        <section className="flex flex-col md:flex-row md:items-center justify-between gap-4" id="academic_dashboard_nav">
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Select Access Workspace</h3>
            <p className="text-[11px] text-gray-500 mt-0.5">Toggle workspaces to input grades, generate student reports, or configure subjects.</p>
          </div>

          <div className="flex bg-gray-100 dark:bg-gray-900 p-1 rounded-xl self-start md:self-auto border border-gray-150 dark:border-gray-800">
            <button
              onClick={() => setActiveRole('student')}
              className={`px-5 py-2 rounded-lg text-xs font-bold transition-all duration-150 flex items-center gap-1.5 ${
                activeRole === 'student' 
                  ? 'bg-teal-600 text-white shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
              id="role_nav_student"
            >
              <GraduationCap className="w-4 h-4" />
              Student Portal
            </button>
            <button
              onClick={() => setActiveRole('teacher')}
              className={`px-5 py-2 rounded-lg text-xs font-bold transition-all duration-150 flex items-center gap-1.5 ${
                activeRole === 'teacher' 
                  ? 'bg-teal-600 text-white shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
              id="role_nav_teacher"
            >
              <Award className="w-4 h-4" />
              Teacher Console
            </button>
            <button
              onClick={() => setActiveRole('admin')}
              className={`px-5 py-2 rounded-lg text-xs font-bold transition-all duration-150 flex items-center gap-1.5 ${
                activeRole === 'admin' 
                  ? 'bg-teal-600 text-white shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
              id="role_nav_admin"
            >
              <Settings className="w-4 h-4" />
              Admin Panel
            </button>
          </div>
        </section>

        {/* Active Panel View Render */}
        <section className="min-h-[400px]">
          {activeRole === 'student' && (
            <StudentPanel
              students={students}
              courses={courses}
              marks={marks}
            />
          )}

          {activeRole === 'teacher' && (
            <TeacherPanel
              students={students}
              courses={courses}
              marks={marks}
              onSaveMarks={handleSaveMarks}
            />
          )}

          {activeRole === 'admin' && (
            <AdminPanel
              students={students}
              onAddStudent={handleAddStudent}
              onUpdateStudent={handleUpdateStudent}
              onDeleteStudent={handleDeleteStudent}
              courses={courses}
              onAddCourse={handleAddCourse}
              onUpdateCourse={handleUpdateCourse}
              onDeleteCourse={handleDeleteCourse}
            />
          )}
        </section>
      </main>

      {/* Modern footer with University credentials */}
      <footer className="bg-white dark:bg-gray-950 border-t border-gray-150 dark:border-gray-900 mt-20 py-8 text-xs text-gray-500 tracking-tight">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center justify-between gap-4 text-center md:text-left">
          <div>
            <p className="font-bold text-gray-750 dark:text-gray-350">Lagos State University of Science and Technology, Ikorodu Campus</p>
            <p className="text-3xs text-gray-400 mt-0.5">Department of Computer Science • College of Basic Science • Designed as Final Year Capstone Project</p>
          </div>
          <p className="text-3xs font-mono">
            &copy; {new Date().getFullYear()} SRMS System Project. All Rights Reserved. Prepared by Odubona Muiz Adegbola.
          </p>
        </div>
      </footer>
    </div>
  );
}
