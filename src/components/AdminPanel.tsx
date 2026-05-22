/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Student, Course } from '../types';
import { 
  Plus, Trash2, Edit, Save, X, Search, GraduationCap, 
  BookOpen, Hash, Mail, School, Users, Check, AlertCircle 
} from 'lucide-react';

interface AdminPanelProps {
  students: Student[];
  onAddStudent: (student: Student) => void;
  onUpdateStudent: (student: Student) => void;
  onDeleteStudent: (matricNo: string) => void;
  courses: Course[];
  onAddCourse: (course: Course) => void;
  onUpdateCourse: (course: Course) => void;
  onDeleteCourse: (code: string) => void;
}

export default function AdminPanel({
  students,
  onAddStudent,
  onUpdateStudent,
  onDeleteStudent,
  courses,
  onAddCourse,
  onUpdateCourse,
  onDeleteCourse
}: AdminPanelProps) {
  // Tabs within admin panel
  const [activeTab, setActiveTab] = useState<'students' | 'courses'>('students');

  // Student form states
  const [studentSearch, setStudentSearch] = useState('');
  const [editingMatricNo, setEditingMatricNo] = useState<string | null>(null);
  const [showAddStudentForm, setShowAddStudentForm] = useState(false);
  
  const [studentForm, setStudentForm] = useState<Student>({
    matricNo: '',
    name: '',
    level: 400,
    department: 'Computer Science',
    email: ''
  });

  const [studentError, setStudentError] = useState('');

  // Course form states
  const [courseSearch, setCourseSearch] = useState('');
  const [editingCourseCode, setEditingCourseCode] = useState<string | null>(null);
  const [showAddCourseForm, setShowAddCourseForm] = useState(false);

  const [courseForm, setCourseForm] = useState<Course>({
    code: '',
    title: '',
    creditUnits: 3,
    level: 400,
    semester: 1
  });

  const [courseError, setCourseError] = useState('');

  // Helpers for student
  const handleAddStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStudentError('');

    if (!studentForm.matricNo.trim() || !studentForm.name.trim() || !studentForm.email.trim()) {
      setStudentError('All fields are required.');
      return;
    }

    // Check duplicate
    if (students.some(s => s.matricNo.toLowerCase() === studentForm.matricNo.trim().toLowerCase())) {
      setStudentError('A student with this Matric Number already exists.');
      return;
    }

    onAddStudent({
      ...studentForm,
      matricNo: studentForm.matricNo.trim()
    });

    // Reset Form
    setStudentForm({
      matricNo: '',
      name: '',
      level: 400,
      department: 'Computer Science',
      email: ''
    });
    setShowAddStudentForm(false);
  };

  const handleEditStudentClick = (student: Student) => {
    setEditingMatricNo(student.matricNo);
    setStudentForm(student);
  };

  const handleSaveStudentEdit = (matricNo: string) => {
    if (!studentForm.name.trim() || !studentForm.email.trim()) {
      setStudentError('Name and email are required.');
      return;
    }
    onUpdateStudent(studentForm);
    setEditingMatricNo(null);
    setStudentForm({
      matricNo: '',
      name: '',
      level: 400,
      department: 'Computer Science',
      email: ''
    });
  };

  // Helpers for course
  const handleAddCourseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCourseError('');

    if (!courseForm.code.trim() || !courseForm.title.trim()) {
      setCourseError('Course code and title are required.');
      return;
    }

    // Check duplicate
    if (courses.some(c => c.code.toLowerCase() === courseForm.code.trim().toLowerCase())) {
      setCourseError('A course with this Course Code already exists.');
      return;
    }

    onAddCourse({
      ...courseForm,
      code: courseForm.code.toUpperCase().trim()
    });

    // Reset Course Form
    setCourseForm({
      code: '',
      title: '',
      creditUnits: 3,
      level: 400,
      semester: 1
    });
    setShowAddCourseForm(false);
  };

  const handleEditCourseClick = (course: Course) => {
    setEditingCourseCode(course.code);
    setCourseForm(course);
  };

  const handleSaveCourseEdit = (code: string) => {
    if (!courseForm.title.trim()) {
      setCourseError('Course title is required.');
      return;
    }
    onUpdateCourse(courseForm);
    setEditingCourseCode(null);
    setCourseForm({
      code: '',
      title: '',
      creditUnits: 3,
      level: 400,
      semester: 1
    });
  };

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
    student.matricNo.toLowerCase().includes(studentSearch.toLowerCase()) ||
    student.department.toLowerCase().includes(studentSearch.toLowerCase())
  );

  const filteredCourses = courses.filter(course =>
    course.code.toLowerCase().includes(courseSearch.toLowerCase()) ||
    course.title.toLowerCase().includes(courseSearch.toLowerCase())
  );

  return (
    <div className="w-full bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden" id="admin_panel_container">
      {/* Admin Panel Header */}
      <div className="p-6 bg-gradient-to-r from-teal-500/10 via-teal-600/5 to-transparent border-b border-gray-100 dark:border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <School className="w-5 h-5 text-teal-600" />
            <h2 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">Academic Administrator Console</h2>
          </div>
          <p className="text-xs text-gray-500 mt-1">Configure academic structures, departments, active levels, registered students, and courses.</p>
        </div>

        {/* Console Navigation */}
        <div className="flex bg-gray-100/80 dark:bg-gray-800/80 p-1 rounded-lg self-start">
          <button
            onClick={() => { setActiveTab('students'); setEditingMatricNo(null); setEditingCourseCode(null); }}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-150 flex items-center gap-1.5 ${
              activeTab === 'students' 
                ? 'bg-white dark:bg-gray-700 text-teal-700 dark:text-teal-300 shadow-xs' 
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            id="admin_tab_students"
          >
            <Users className="w-4 h-4" />
            Students ({students.length})
          </button>
          <button
            onClick={() => { setActiveTab('courses'); setEditingMatricNo(null); setEditingCourseCode(null); }}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-150 flex items-center gap-1.5 ${
              activeTab === 'courses' 
                ? 'bg-white dark:bg-gray-700 text-teal-700 dark:text-teal-300 shadow-xs' 
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            id="admin_tab_courses"
          >
            <BookOpen className="w-4 h-4" />
            Courses ({courses.length})
          </button>
        </div>
      </div>

      {activeTab === 'students' && (
        <div className="p-6" id="students_management_section">
          {/* Top Bar for Student Manage */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </span>
              <input
                type="text"
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                placeholder="Search students by name, matric no, or department..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-750 rounded-lg text-sm bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                id="student_search_input"
              />
            </div>

            <button
              onClick={() => setShowAddStudentForm(!showAddStudentForm)}
              className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-xs shrink-0 self-start md:self-auto"
              id="add_student_toggle_btn"
            >
              {showAddStudentForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {showAddStudentForm ? 'Cancel Form' : 'Add New Student'}
            </button>
          </div>

          {/* New Student form */}
          {showAddStudentForm && (
            <form onSubmit={handleAddStudentSubmit} className="mb-6 p-5 border border-teal-100 dark:border-teal-900 bg-teal-50/20 dark:bg-teal-950/10 rounded-xl animate-fadeIn" id="add_student_form">
              <h3 className="text-sm font-bold text-teal-900 dark:text-teal-400 mb-4 flex items-center gap-2">
                <Users className="w-4.5 h-4.5" />
                Student Admission Enrollment
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-650 dark:text-gray-300 mb-1.5">Matric Number (Unique ID)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 220303010092"
                    value={studentForm.matricNo}
                    onChange={(e) => setStudentForm({ ...studentForm, matricNo: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-850 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-teal-500"
                    id="new_student_matric_input"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-650 dark:text-gray-300 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Odubona Muiz Adegbola"
                    value={studentForm.name}
                    onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-850 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-teal-500"
                    id="new_student_name_input"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-650 dark:text-gray-300 mb-1.5">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. muiz@example.com"
                    value={studentForm.email}
                    onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-850 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-teal-500"
                    id="new_student_email_input"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-650 dark:text-gray-300 mb-1.5">Level (Classification)</label>
                  <select
                    value={studentForm.level}
                    onChange={(e) => setStudentForm({ ...studentForm, level: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-850 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-teal-500"
                    id="new_student_level_select"
                  >
                    <option value={100}>100 Level</option>
                    <option value={200}>200 Level</option>
                    <option value={300}>300 Level</option>
                    <option value={400}>400 Level</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-650 dark:text-gray-300 mb-1.5">Department</label>
                  <select
                    value={studentForm.department}
                    onChange={(e) => setStudentForm({ ...studentForm, department: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-850 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-teal-500"
                    id="new_student_dept_select"
                  >
                    <option value="Computer Science">Computer Science</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                    <option value="Pure Mathematics">Pure Mathematics</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2 rounded-lg text-sm font-semibold transition"
                    id="enroll_student_btn"
                  >
                    Register Student Profile
                  </button>
                </div>
              </div>

              {studentError && (
                <div className="mt-3 flex items-center gap-1.5 text-xs text-rose-600 bg-rose-50 dark:bg-rose-950/25 p-2 rounded-lg" id="student_form_error">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{studentError}</span>
                </div>
              )}
            </form>
          )}

          {/* Student Grid/Table */}
          <div className="border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden shadow-xs">
            <div className="min-w-full overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100 dark:divide-gray-800">
                <thead className="bg-gray-50/70 dark:bg-gray-800/50">
                  <tr>
                    <th scope="col" className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Matric Number</th>
                    <th scope="col" className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Student Name</th>
                    <th scope="col" className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact Info</th>
                    <th scope="col" className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Department</th>
                    <th scope="col" className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Classification</th>
                    <th scope="col" className="px-5 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-800">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-5 py-8 text-center text-sm text-gray-500" id="no_students_found">
                        No students profiles match your search criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map(student => {
                      const isEditing = editingMatricNo === student.matricNo;
                      return (
                        <tr key={student.matricNo} className="hover:bg-gray-50/50 dark:hover:bg-gray-850/30 transition-colors">
                          <td className="px-5 py-3.5 whitespace-nowrap text-sm font-semibold text-gray-950 dark:text-gray-200">
                            <span className="flex items-center gap-1">
                              <Hash className="w-3.5 h-3.5 text-gray-400" />
                              {student.matricNo}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                            {isEditing ? (
                              <input
                                type="text"
                                value={studentForm.name}
                                onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
                                className="px-2 py-1 border border-teal-300 rounded text-sm bg-white dark:bg-gray-800 text-gray-990 focus:outline-none focus:ring-1 focus:ring-teal-500"
                                id={`edit_student_name_${student.matricNo}`}
                              />
                            ) : (
                              <div className="flex items-center gap-1.5 font-medium">
                                <GraduationCap className="w-4 h-4 text-gray-400" />
                                {student.name}
                              </div>
                            )}
                          </td>
                          <td className="px-5 py-3.5 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {isEditing ? (
                              <input
                                type="email"
                                value={studentForm.email}
                                onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })}
                                className="px-2 py-1 border border-teal-300 rounded text-sm bg-white dark:bg-gray-800 text-gray-990 focus:outline-none focus:ring-1 focus:ring-teal-500"
                              />
                            ) : (
                              <span className="flex items-center gap-1">
                                <Mail className="w-3.5 h-3.5 text-gray-400" />
                                {student.email}
                              </span>
                            )}
                          </td>
                          <td className="px-5 py-3.5 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {isEditing ? (
                              <select
                                value={studentForm.department}
                                onChange={(e) => setStudentForm({ ...studentForm, department: e.target.value })}
                                className="px-2 py-1 border border-teal-300 rounded text-sm bg-white dark:bg-gray-800 text-gray-990 focus:outline-none"
                              >
                                <option value="Computer Science">Computer Science</option>
                                <option value="Information Technology">Information Technology</option>
                                <option value="Mechanical Engineering">Mechanical Engineering</option>
                                <option value="Pure Mathematics">Pure Mathematics</option>
                              </select>
                            ) : (
                              <div className="text-gray-700 dark:text-gray-300 text-xs tracking-wide">{student.department}</div>
                            )}
                          </td>
                          <td className="px-5 py-3.5 whitespace-nowrap text-sm text-gray-500">
                            {isEditing ? (
                              <select
                                value={studentForm.level}
                                onChange={(e) => setStudentForm({ ...studentForm, level: parseInt(e.target.value) })}
                                className="px-2 py-1 border border-teal-300 rounded text-sm bg-white dark:bg-gray-800 text-gray-990 focus:outline-none"
                              >
                                <option value={100}>100 L</option>
                                <option value={200}>200 L</option>
                                <option value={300}>300 L</option>
                                <option value={400}>400 L</option>
                              </select>
                            ) : (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-350">
                                {student.level} Level
                              </span>
                            )}
                          </td>
                          <td className="px-5 py-3.5 whitespace-nowrap text-right text-xs font-medium">
                            {isEditing ? (
                              <div className="flex justify-end gap-2" id="edit_actions">
                                <button
                                  onClick={() => handleSaveStudentEdit(student.matricNo)}
                                  className="text-emerald-600 hover:text-emerald-955 bg-emerald-50 dark:bg-emerald-950/20 p-1.5 rounded-lg transition"
                                  title="Save Changes"
                                  id={`save_student_btn_${student.matricNo}`}
                                >
                                  <Save className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => { setEditingMatricNo(null); setStudentError(''); }}
                                  className="text-gray-500 hover:text-gray-700 bg-gray-50 dark:bg-gray-800 p-1.5 rounded-lg transition"
                                  title="Cancel Editing"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ) : (
                              <div className="flex justify-end gap-2" id="normal_actions">
                                <button
                                  onClick={() => handleEditStudentClick(student)}
                                  className="text-teal-600 hover:text-teal-800 bg-teal-50 dark:bg-teal-950/20 p-1.5 rounded-lg transition"
                                  title="Edit Student Info"
                                  id={`edit_student_btn_${student.matricNo}`}
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => {
                                    if(confirm(`Are you sure you want to delete profile for ${student.name}? This removes academic biodata.`)) {
                                      onDeleteStudent(student.matricNo);
                                    }
                                  }}
                                  className="text-rose-600 hover:text-rose-800 bg-rose-50 dark:bg-rose-950/20 p-1.5 rounded-lg transition"
                                  title="Delete Student"
                                  id={`delete_student_btn_${student.matricNo}`}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'courses' && (
        <div className="p-6" id="courses_management_section">
          {/* Top Bar for Courses Manage */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </span>
              <input
                type="text"
                value={courseSearch}
                onChange={(e) => setCourseSearch(e.target.value)}
                placeholder="Search courses by code or name..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-75 rounded-lg text-sm bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                id="course_search_input"
              />
            </div>

            <button
              onClick={() => setShowAddCourseForm(!showAddCourseForm)}
              className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-xs shrink-0 self-start md:self-auto"
              id="add_course_toggle_btn"
            >
              {showAddCourseForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {showAddCourseForm ? 'Cancel Form' : 'Register New Course'}
            </button>
          </div>

          {/* New Course Form */}
          {showAddCourseForm && (
            <form onSubmit={handleAddCourseSubmit} className="mb-6 p-5 border border-teal-100 dark:border-teal-900 bg-teal-50/20 dark:bg-teal-950/10 rounded-xl animate-fadeIn" id="add_course_form">
              <h3 className="text-sm font-bold text-teal-900 dark:text-teal-400 mb-4 flex items-center gap-2">
                <BookOpen className="w-4.5 h-4.5" />
                Syllabus Course Registration
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-650 dark:text-gray-300 mb-1.5">Course Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CSC 401"
                    value={courseForm.code}
                    onChange={(e) => setCourseForm({ ...courseForm, code: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-850 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-teal-500"
                    id="new_course_code_input"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-650 dark:text-gray-300 mb-1.5">Course Title / Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Software Engineering"
                    value={courseForm.title}
                    onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-850 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-teal-500"
                    id="new_course_title_input"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-650 dark:text-gray-300 mb-1.5">Credit Units</label>
                  <select
                    value={courseForm.creditUnits}
                    onChange={(e) => setCourseForm({ ...courseForm, creditUnits: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-850 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-teal-500"
                    id="new_course_credit_select"
                  >
                    <option value={1}>1 Unit</option>
                    <option value={2}>2 Units</option>
                    <option value={3}>3 Units</option>
                    <option value={4}>4 Units</option>
                    <option value={5}>5 Units</option>
                    <option value={6}>6 Units (e.g. Project-Thesis)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-650 dark:text-gray-300 mb-1.5">Level</label>
                  <select
                    value={courseForm.level}
                    onChange={(e) => setCourseForm({ ...courseForm, level: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-850 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-teal-500"
                    id="new_course_level_select"
                  >
                    <option value={100}>100 Level</option>
                    <option value={200}>200 Level</option>
                    <option value={300}>300 Level</option>
                    <option value={400}>400 Level</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-650 dark:text-gray-300 mb-1.5">Semester</label>
                  <select
                    value={courseForm.semester}
                    onChange={(e) => setCourseForm({ ...courseForm, semester: parseInt(e.target.value) as 1 | 2 })}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-850 text-gray-900 dark:text-gray-100 focus:outline-none"
                    id="new_course_semester_select"
                  >
                    <option value={1}>1st Semester</option>
                    <option value={2}>2nd Semester</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2 rounded-lg text-sm font-semibold transition"
                    id="register_course_btn"
                  >
                    Create Course Record
                  </button>
                </div>
              </div>

              {courseError && (
                <div className="mt-3 flex items-center gap-1.5 text-xs text-rose-600 bg-rose-50 dark:bg-rose-950/25 p-2 rounded-lg" id="course_form_error">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{courseError}</span>
                </div>
              )}
            </form>
          )}

          {/* Course Matrix Grid */}
          <div className="border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden shadow-xs">
            <div className="min-w-full overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100 dark:divide-gray-800">
                <thead className="bg-gray-50/70 dark:bg-gray-800/50">
                  <tr>
                    <th scope="col" className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Course Code</th>
                    <th scope="col" className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Course Title</th>
                    <th scope="col" className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Credit Allocation</th>
                    <th scope="col" className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Class Level</th>
                    <th scope="col" className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Term / Semester</th>
                    <th scope="col" className="px-5 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-800">
                  {filteredCourses.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-5 py-8 text-center text-sm text-gray-500" id="no_courses_found">
                        No courses meet your search terms.
                      </td>
                    </tr>
                  ) : (
                    filteredCourses.map(course => {
                      const isEditing = editingCourseCode === course.code;
                      return (
                        <tr key={course.code} className="hover:bg-gray-50/50 dark:hover:bg-gray-850/30 transition-colors">
                          <td className="px-5 py-3.5 whitespace-nowrap text-sm font-semibold text-gray-950 dark:text-gray-250">
                            {course.code}
                          </td>
                          <td className="px-5 py-3.5 text-sm text-gray-900 dark:text-gray-100">
                            {isEditing ? (
                              <input
                                type="text"
                                value={courseForm.title}
                                onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                                className="px-2 py-1 border border-teal-300 rounded text-sm bg-white dark:bg-gray-850 text-gray-990 focus:outline-none w-full"
                                id={`edit_course_title_${course.code}`}
                              />
                            ) : (
                              <span className="font-semibold text-gray-800 dark:text-gray-300">{course.title}</span>
                            )}
                          </td>
                          <td className="px-5 py-3.5 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {isEditing ? (
                              <select
                                value={courseForm.creditUnits}
                                onChange={(e) => setCourseForm({ ...courseForm, creditUnits: parseInt(e.target.value) })}
                                className="px-2 py-1 border border-teal-300 rounded text-sm bg-white dark:bg-gray-850 text-gray-990"
                              >
                                <option value={1}>1 Unit</option>
                                <option value={2}>2 Units</option>
                                <option value={3}>3 Units</option>
                                <option value={4}>4 Units</option>
                                <option value={5}>5 Units</option>
                                <option value={6}>6 Units</option>
                              </select>
                            ) : (
                              <span className="font-semibold">{course.creditUnits} {course.creditUnits === 1 ? 'Unit' : 'Units'}</span>
                            )}
                          </td>
                          <td className="px-5 py-3.5 whitespace-nowrap text-sm text-gray-500 text-center">
                            {isEditing ? (
                              <select
                                value={courseForm.level}
                                onChange={(e) => setCourseForm({ ...courseForm, level: parseInt(e.target.value) })}
                                className="px-2 py-1 border border-teal-300 rounded text-sm bg-white dark:bg-gray-850 text-gray-990"
                              >
                                <option value={100}>100 L</option>
                                <option value={200}>200 L</option>
                                <option value={300}>300 L</option>
                                <option value={400}>400 L</option>
                              </select>
                            ) : (
                              <span className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-50 dark:bg-gray-800 text-gray-650 dark:text-gray-350">
                                {course.level} Level
                              </span>
                            )}
                          </td>
                          <td className="px-5 py-3.5 whitespace-nowrap text-sm text-gray-500 text-center">
                            {isEditing ? (
                              <select
                                value={courseForm.semester}
                                onChange={(e) => setCourseForm({ ...courseForm, semester: parseInt(e.target.value) as 1 | 2 })}
                                className="px-2 py-1 border border-teal-300 rounded text-sm bg-white dark:bg-gray-850"
                              >
                                <option value={1}>1st Sem</option>
                                <option value={2}>2nd Sem</option>
                              </select>
                            ) : (
                              <span className="text-xs font-semibold uppercase tracking-wider text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/30 px-2 py-0.5 rounded-md">
                                {course.semester === 1 ? '1st Semester' : '2nd Semester'}
                              </span>
                            )}
                          </td>
                          <td className="px-5 py-3.5 whitespace-nowrap text-right text-xs font-medium">
                            {isEditing ? (
                              <div className="flex justify-end gap-2" id="course_edit_actions">
                                <button
                                  onClick={() => handleSaveCourseEdit(course.code)}
                                  className="text-emerald-600 hover:text-emerald-955 bg-emerald-50 dark:bg-emerald-950/20 p-1.5 rounded-lg transition"
                                  title="Save Changes"
                                  id={`save_course_btn_${course.code}`}
                                >
                                  <Save className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => { setEditingCourseCode(null); setCourseError(''); }}
                                  className="text-gray-500 hover:text-gray-750 bg-gray-50 dark:bg-gray-800 p-1.5 rounded-lg transition"
                                  title="Cancel"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ) : (
                              <div className="flex justify-end gap-2" id="course_normal_actions">
                                <button
                                  onClick={() => handleEditCourseClick(course)}
                                  className="text-teal-600 hover:text-teal-800 bg-teal-50 dark:bg-teal-950/20 p-1.5 rounded-lg transition"
                                  title="Edit Course"
                                  id={`edit_course_btn_${course.code}`}
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => {
                                    if(confirm(`Are you sure you want to delete course ${course.code}: ${course.title}?`)) {
                                      onDeleteCourse(course.code);
                                    }
                                  }}
                                  className="text-rose-600 hover:text-rose-800 bg-rose-50 dark:bg-rose-950/20 p-1.5 rounded-lg transition"
                                  title="Delete Course Detail"
                                  id={`delete_course_btn_${course.code}`}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
