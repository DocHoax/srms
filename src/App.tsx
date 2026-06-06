/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Student, Course, Marks, UserRole, User } from './types';
import { DEFAULT_STUDENTS, DEFAULT_COURSES, DEFAULT_MARKS, DEFAULT_USERS } from './data/defaultData';
import AdminPanel from './components/AdminPanel';
import TeacherPanel from './components/TeacherPanel';
import StudentPanel from './components/StudentPanel';
import { 
  School, GraduationCap, Award, BookOpen, Settings, Users, 
  HelpCircle, CheckCircle, Database, Moon, Sun, Monitor,
  Lock, LogIn, LogOut, Key, ShieldAlert, ChevronDown, ChevronUp, AlertCircle
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

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('srms_users');
    return saved ? JSON.parse(saved) : DEFAULT_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('srms_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Active Role Switcher State
  const [activeRole, setActiveRole] = useState<UserRole>(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('srms_current_user');
      if (savedUser) {
        try {
          const user = JSON.parse(savedUser) as User;
          return user.role;
        } catch (e) {
          // Ignore
        }
      }
    }
    return 'student';
  });

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
    localStorage.setItem('srms_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('srms_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('srms_current_user');
    }
  }, [currentUser]);

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
      setUsers(DEFAULT_USERS);
      setCurrentUser(null);
    }
  };

  // Login form & helper states
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showDemoAccounts, setShowDemoAccounts] = useState(false);
  const [demoTab, setDemoTab] = useState<'admin' | 'lecturer' | 'student'>('admin');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const matchedUser = users.find(
      u => u.username.trim().toLowerCase() === usernameInput.trim().toLowerCase() &&
           u.password === passwordInput
    );

    if (matchedUser) {
      setCurrentUser(matchedUser);
      setActiveRole(matchedUser.role);
      setUsernameInput('');
      setPasswordInput('');
    } else {
      setLoginError('Invalid username or password. Please verify credentials.');
    }
  };

  const handleQuickLogin = (user: User) => {
    setCurrentUser(user);
    setActiveRole(user.role);
    setLoginError('');
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };


  if (!currentUser) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-black text-gray-800 dark:text-gray-100 font-sans transition-colors duration-200 flex flex-col justify-between">
        {/* Header (No user logged in, just logo) */}
        <header className="bg-white dark:bg-gray-950 border-b border-gray-150 dark:border-gray-900 py-4 shadow-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
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
            
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-lg transition"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </header>

        {/* Login Body */}
        <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-950 p-8 rounded-3xl border border-gray-150 dark:border-gray-900 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-teal-500 via-teal-600 to-emerald-500"></div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-teal-50/10 text-teal-600 dark:text-teal-400 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-teal-100 dark:border-teal-900/50">
                <Lock className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-black text-gray-955 dark:text-white tracking-tight">
                Academic Portal Sign In
              </h2>
              <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400 leading-snug">
                Student Result Management System (SRMS)<br />
                Final Year Project by Odubona Muiz Adegbola
              </p>
            </div>

            <form className="mt-8 space-y-4" onSubmit={handleLoginSubmit}>
              {loginError && (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900 text-rose-600 text-xs rounded-xl flex items-center gap-2 font-semibold">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-3xs font-extrabold uppercase tracking-wider text-gray-400 block mb-1">Username / Matric Number</label>
                <input
                  type="text"
                  required
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-750 rounded-xl text-sm bg-gray-50 dark:bg-gray-900 text-gray-955 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-teal-500 font-semibold"
                  placeholder="e.g. 220303010092 or admin1"
                />
              </div>

              <div className="space-y-1">
                <label className="text-3xs font-extrabold uppercase tracking-wider text-gray-400 block mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-750 rounded-xl text-sm bg-gray-50 dark:bg-gray-900 text-gray-955 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-teal-500 font-semibold font-mono"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-4 rounded-xl transition duration-150 shadow-md hover:shadow-lg mt-6 text-sm cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                Sign In to Portal
              </button>
            </form>

            {/* Expandable Demo Directory Accordion */}
            <div className="mt-8 border-t border-gray-100 dark:border-gray-900 pt-6">
              <button 
                onClick={() => setShowDemoAccounts(!showDemoAccounts)}
                className="w-full flex items-center justify-between text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider hover:text-teal-600 dark:hover:text-teal-400 transition cursor-pointer"
              >
                <span className="flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-teal-600" />
                  Demo Accounts Directory
                </span>
                {showDemoAccounts ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {showDemoAccounts && (
                <div className="mt-4 space-y-4 animate-fadeIn">
                  {/* Category switcher */}
                  <div className="flex bg-gray-100 dark:bg-gray-900 p-1 rounded-lg border border-gray-150 dark:border-gray-800">
                    <button
                      onClick={() => setDemoTab('admin')}
                      className={`flex-1 py-1 rounded text-3xs font-bold transition uppercase tracking-wider cursor-pointer ${demoTab === 'admin' ? 'bg-white dark:bg-gray-750 text-teal-600 dark:text-teal-350 shadow-xs' : 'text-gray-500'}`}
                    >
                      Admin (2)
                    </button>
                    <button
                      onClick={() => setDemoTab('lecturer')}
                      className={`flex-1 py-1 rounded text-3xs font-bold transition uppercase tracking-wider cursor-pointer ${demoTab === 'lecturer' ? 'bg-white dark:bg-gray-750 text-teal-600 dark:text-teal-350 shadow-xs' : 'text-gray-500'}`}
                    >
                      Lecturers (5)
                    </button>
                    <button
                      onClick={() => setDemoTab('student')}
                      className={`flex-1 py-1 rounded text-3xs font-bold transition uppercase tracking-wider cursor-pointer ${demoTab === 'student' ? 'bg-white dark:bg-gray-750 text-teal-600 dark:text-teal-350 shadow-xs' : 'text-gray-500'}`}
                    >
                      Students (20)
                    </button>
                  </div>

                  {/* Directory Lists */}
                  {demoTab === 'admin' && (
                    <div className="space-y-2">
                      {users.filter(u => u.role === 'admin').map((u, i) => (
                        <div key={u.username} className="flex justify-between items-center bg-gray-50 dark:bg-gray-900 p-2.5 rounded-xl border border-gray-100 dark:border-gray-800 text-xs">
                          <div>
                            <span className="font-bold text-gray-850 dark:text-gray-200 block">{u.name}</span>
                            <span className="text-3xs text-gray-400 font-mono">User: {u.username} • Pass: {u.password}</span>
                          </div>
                          <button
                            onClick={() => handleQuickLogin(u)}
                            className="px-2.5 py-1 text-3xs bg-teal-600 hover:bg-teal-700 text-white rounded font-bold transition shadow-3xs uppercase tracking-wider cursor-pointer"
                          >
                            Quick Log
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {demoTab === 'lecturer' && (
                    <div className="space-y-2">
                      {users.filter(u => u.role === 'teacher').map((u, i) => (
                        <div key={u.username} className="flex justify-between items-center bg-gray-50 dark:bg-gray-900 p-2.5 rounded-xl border border-gray-100 dark:border-gray-800 text-xs">
                          <div>
                            <span className="font-bold text-gray-850 dark:text-gray-200 block">{u.name}</span>
                            <span className="text-3xs text-gray-400 font-mono">User: {u.username} • Pass: {u.password}</span>
                          </div>
                          <button
                            onClick={() => handleQuickLogin(u)}
                            className="px-2.5 py-1 text-3xs bg-teal-600 hover:bg-teal-700 text-white rounded font-bold transition shadow-3xs uppercase tracking-wider cursor-pointer"
                          >
                            Quick Log
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {demoTab === 'student' && (
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                      {users.filter(u => u.role === 'student').map((u, i) => (
                        <div key={u.username} className="flex justify-between items-center bg-gray-50 dark:bg-gray-900 p-2.5 rounded-xl border border-gray-100 dark:border-gray-800 text-xs">
                          <div>
                            <span className="font-bold text-gray-850 dark:text-gray-200 block">{u.name}</span>
                            <span className="text-3xs text-gray-400 font-mono">Matric: {u.username} • Pass: {u.password}</span>
                          </div>
                          <button
                            onClick={() => handleQuickLogin(u)}
                            className="px-2.5 py-1 text-3xs bg-teal-600 hover:bg-teal-700 text-white rounded font-bold transition shadow-3xs uppercase tracking-wider cursor-pointer"
                          >
                            Quick Log
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="py-6 border-t border-gray-150 dark:border-gray-900 text-center text-3xs text-gray-400">
          Lagos State University of Science and Technology • Final Year Capstone Project Framework
        </footer>
      </div>
    );
  }

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

          {/* User profile / session state info */}
          {currentUser && (
            <div className="flex items-center gap-3 border-l border-gray-100 dark:border-gray-850 pl-4">
              <div className="w-8 h-8 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold text-xs uppercase border border-teal-150 dark:border-teal-900">
                {currentUser.name.charAt(0)}
              </div>
              <div className="hidden sm:block">
                <span className="block text-3xs text-gray-400 uppercase tracking-widest font-extrabold font-mono leading-none">{currentUser.role} Account</span>
                <span className="block text-xs font-bold text-gray-700 dark:text-gray-300 leading-normal mt-0.5">{currentUser.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="p-1.5 ml-2 text-gray-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 border border-transparent hover:border-rose-100 dark:hover:border-rose-900 rounded-lg transition cursor-pointer"
                title="Sign Out"
                id="header_logout_btn"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Theme Switcher & Reset Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-lg transition cursor-pointer"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            
            <button
              onClick={handleResetDatabase}
              className="px-3 py-1.5 text-3xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900 rounded-lg transition cursor-pointer"
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
            <h2 className="text-2xl font-black text-gray-955 dark:text-white tracking-tight">
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

        {/* Global Role Switcher Navigation (Teachers, Students, Admins) - ONLY rendered for Admin role */}
        {currentUser?.role === 'admin' && (
          <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fadeIn" id="academic_dashboard_nav">
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Select Access Workspace</h3>
              <p className="text-[11px] text-gray-500 mt-0.5">Toggle workspaces to input grades, generate student reports, or configure subjects.</p>
            </div>

            <div className="flex bg-gray-100 dark:bg-gray-900 p-1 rounded-xl self-start md:self-auto border border-gray-150 dark:border-gray-800">
              <button
                onClick={() => setActiveRole('student')}
                className={`px-5 py-2 rounded-lg text-xs font-bold transition-all duration-150 flex items-center gap-1.5 cursor-pointer ${
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
                className={`px-5 py-2 rounded-lg text-xs font-bold transition-all duration-150 flex items-center gap-1.5 cursor-pointer ${
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
                className={`px-5 py-2 rounded-lg text-xs font-bold transition-all duration-150 flex items-center gap-1.5 cursor-pointer ${
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
        )}

        {/* Active Panel View Render */}
        <section className="min-h-[400px]">
          {activeRole === 'student' && (
            <StudentPanel
              students={students}
              courses={courses}
              marks={marks}
              activeStudent={
                currentUser?.role === 'student'
                  ? students.find(s => s.matricNo === currentUser.associatedId)
                  : null
              }
              isLockedToSelf={currentUser?.role === 'student'}
              onClear={handleLogout}
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
