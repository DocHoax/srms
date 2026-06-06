/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Student, Course, Marks, User } from '../types';

export const DEFAULT_STUDENTS: Student[] = [
  {
    matricNo: '220303010092',
    name: 'Odubona Muiz Adegbola',
    level: 400,
    department: 'Computer Science',
    email: 'muiz.odubona@lasustech.edu.ng'
  },
  {
    matricNo: '220303010015',
    name: 'Balogun Aminat Adebisi',
    level: 400,
    department: 'Computer Science',
    email: 'aminat.balogun@lasustech.edu.ng'
  },
  {
    matricNo: '220303010048',
    name: 'Okafor Chinedu Emmanuel',
    level: 400,
    department: 'Computer Science',
    email: 'chinedu.okafor@lasustech.edu.ng'
  },
  {
    matricNo: '230303010112',
    name: 'Williams David Oluwaseun',
    level: 300,
    department: 'Computer Science',
    email: 'david.williams@lasustech.edu.ng'
  },
  {
    matricNo: '230303010056',
    name: 'Akin-Taylor Elizabeth',
    level: 300,
    department: 'Computer Science',
    email: 'elizabeth.akingbade@lasustech.edu.ng'
  },
  {
    matricNo: '220303010011',
    name: 'Abiodun Opeyemi Samson',
    level: 400,
    department: 'Computer Science',
    email: 'opeyemi.abiodun@lasustech.edu.ng'
  },
  {
    matricNo: '220303010022',
    name: 'Bello Rukayat Kehinde',
    level: 400,
    department: 'Computer Science',
    email: 'rukayat.bello@lasustech.edu.ng'
  },
  {
    matricNo: '220303010033',
    name: 'Coker Daniel Taiwo',
    level: 400,
    department: 'Computer Science',
    email: 'daniel.coker@lasustech.edu.ng'
  },
  {
    matricNo: '220303010044',
    name: 'Durosinmi Yusuf Olawale',
    level: 400,
    department: 'Computer Science',
    email: 'yusuf.durosinmi@lasustech.edu.ng'
  },
  {
    matricNo: '220303010055',
    name: 'Falade Grace Oluwatoyin',
    level: 400,
    department: 'Computer Science',
    email: 'grace.falade@lasustech.edu.ng'
  },
  {
    matricNo: '220303010066',
    name: 'Gbajabiamila Hameed Adebola',
    level: 400,
    department: 'Computer Science',
    email: 'hameed.gbaja@lasustech.edu.ng'
  },
  {
    matricNo: '220303010077',
    name: 'Ibrahim Mariam Titilayo',
    level: 400,
    department: 'Computer Science',
    email: 'mariam.ibrahim@lasustech.edu.ng'
  },
  {
    matricNo: '220303010088',
    name: 'Jide-Ojo Solomon Tobi',
    level: 400,
    department: 'Computer Science',
    email: 'solomon.jideojo@lasustech.edu.ng'
  },
  {
    matricNo: '220303010099',
    name: 'Kolawole Blessing Eniola',
    level: 400,
    department: 'Computer Science',
    email: 'blessing.kolawole@lasustech.edu.ng'
  },
  {
    matricNo: '230303010010',
    name: 'Lawal Ridwan Olanrewaju',
    level: 300,
    department: 'Computer Science',
    email: 'ridwan.lawal@lasustech.edu.ng'
  },
  {
    matricNo: '230303010020',
    name: 'Muhammed Fatima Alao',
    level: 300,
    department: 'Computer Science',
    email: 'fatima.muhammed@lasustech.edu.ng'
  },
  {
    matricNo: '230303010030',
    name: 'Nwachukwu Vivian Chika',
    level: 300,
    department: 'Computer Science',
    email: 'vivian.nwachukwu@lasustech.edu.ng'
  },
  {
    matricNo: '230303010040',
    name: 'Olusegun Temitope James',
    level: 300,
    department: 'Computer Science',
    email: 'temitope.olusegun@lasustech.edu.ng'
  },
  {
    matricNo: '230303010050',
    name: 'Peters Deborah Blessing',
    level: 300,
    department: 'Computer Science',
    email: 'deborah.peters@lasustech.edu.ng'
  },
  {
    matricNo: '230303010060',
    name: 'Quadri Lateef Oyetunde',
    level: 300,
    department: 'Computer Science',
    email: 'lateef.quadri@lasustech.edu.ng'
  }
];


export const DEFAULT_COURSES: Course[] = [
  // 400 Level - 1st Semester
  { code: 'CSC 401', title: 'Software Engineering', creditUnits: 3, level: 400, semester: 1 },
  { code: 'CSC 403', title: 'Database Management Systems', creditUnits: 3, level: 400, semester: 1 },
  { code: 'CSC 405', title: 'System Security', creditUnits: 2, level: 400, semester: 1 },
  { code: 'CSC 407', title: 'Computer Graphics & Visuals', creditUnits: 3, level: 400, semester: 1 },
  { code: 'CSC 411', title: 'Artificial Intelligence', creditUnits: 3, level: 400, semester: 1 },
  
  // 400 Level - 2nd Semester
  { code: 'CSC 402', title: 'Distributed Computing Systems', creditUnits: 3, level: 400, semester: 2 },
  { code: 'CSC 404', title: 'Human Computer Interaction', creditUnits: 2, level: 400, semester: 2 },
  { code: 'CSC 406', title: 'Compiler Construction', creditUnits: 3, level: 400, semester: 2 },
  { code: 'CSC 499', title: 'Final Year Project Work', creditUnits: 6, level: 400, semester: 2 },

  // 300 Level - 1st Semester
  { code: 'CSC 301', title: 'Data Structures & Algorithms', creditUnits: 3, level: 300, semester: 1 },
  { code: 'CSC 303', title: 'Operating Systems I', creditUnits: 3, level: 300, semester: 1 },
  { code: 'CSC 305', title: 'Object-Oriented Programming', creditUnits: 3, level: 300, semester: 1 }
];

export const DEFAULT_MARKS: Marks[] = [
  // Odubona Muiz Adegbola - 400L, 1st Semester
  { studentMatricNo: '220303010092', courseCode: 'CSC 401', test: 25, assignment: 9, exam: 52, total: 86, grade: 'A', gp: 5 },
  { studentMatricNo: '220303010092', courseCode: 'CSC 403', test: 26, assignment: 8, exam: 48, total: 82, grade: 'A', gp: 5 },
  { studentMatricNo: '220303010092', courseCode: 'CSC 405', test: 21, assignment: 7, exam: 45, total: 73, grade: 'A', gp: 5 },
  { studentMatricNo: '220303010092', courseCode: 'CSC 407', test: 19, assignment: 9, exam: 41, total: 69, grade: 'B', gp: 4 },
  { studentMatricNo: '220303010092', courseCode: 'CSC 411', test: 24, assignment: 8, exam: 50, total: 82, grade: 'A', gp: 5 },
  
  // Odubona Muiz Adegbola - 400L, 2nd Semester (Current Semester, some grades pending, but let's have some values loaded to calculate CGPA)
  { studentMatricNo: '220303010092', courseCode: 'CSC 402', test: 22, assignment: 8, exam: 49, total: 79, grade: 'A', gp: 5 },
  { studentMatricNo: '220303010092', courseCode: 'CSC 404', test: 20, assignment: 9, exam: 40, total: 69, grade: 'B', gp: 4 },
  { studentMatricNo: '220303010092', courseCode: 'CSC 406', test: 18, assignment: 7, exam: 37, total: 62, grade: 'B', gp: 4 },
  { studentMatricNo: '220303010092', courseCode: 'CSC 499', test: 27, assignment: 9, exam: 53, total: 89, grade: 'A', gp: 5 },

  // Balogun Aminat Adebisi - 400L
  { studentMatricNo: '220303010015', courseCode: 'CSC 401', test: 23, assignment: 8, exam: 46, total: 77, grade: 'A', gp: 5 },
  { studentMatricNo: '220303010015', courseCode: 'CSC 403', test: 18, assignment: 7, exam: 41, total: 66, grade: 'B', gp: 4 },
  { studentMatricNo: '220303010015', courseCode: 'CSC 405', test: 20, assignment: 8, exam: 35, total: 63, grade: 'B', gp: 4 },
  { studentMatricNo: '220303010015', courseCode: 'CSC 407', test: 22, assignment: 8, exam: 48, total: 78, grade: 'A', gp: 5 },
  { studentMatricNo: '220303010015', courseCode: 'CSC 411', test: 15, assignment: 6, exam: 34, total: 55, grade: 'C', gp: 3 },

  // Okafor Chinedu Emmanuel - 400L
  { studentMatricNo: '220303010048', courseCode: 'CSC 401', test: 17, assignment: 7, exam: 32, total: 56, grade: 'C', gp: 3 },
  { studentMatricNo: '220303010048', courseCode: 'CSC 403', test: 16, assignment: 6, exam: 36, total: 58, grade: 'C', gp: 3 },
  { studentMatricNo: '220303010048', courseCode: 'CSC 405', test: 14, assignment: 5, exam: 29, total: 48, grade: 'D', gp: 2 },
  { studentMatricNo: '220303010048', courseCode: 'CSC 407', test: 15, assignment: 5, exam: 25, total: 45, grade: 'D', gp: 2 },
  { studentMatricNo: '220303010048', courseCode: 'CSC 411', test: 12, assignment: 6, exam: 21, total: 39, grade: 'F', gp: 0 },

  // Williams David Oluwaseun - 300L
  { studentMatricNo: '230303010112', courseCode: 'CSC 301', test: 24, assignment: 8, exam: 45, total: 77, grade: 'A', gp: 5 },
  { studentMatricNo: '230303010112', courseCode: 'CSC 303', test: 21, assignment: 7, exam: 40, total: 68, grade: 'B', gp: 4 },
  { studentMatricNo: '230303010112', courseCode: 'CSC 305', test: 20, assignment: 8, exam: 43, total: 71, grade: 'A', gp: 5 },

  // Abiodun Opeyemi Samson - 400L
  { studentMatricNo: '220303010011', courseCode: 'CSC 401', test: 22, assignment: 7, exam: 41, total: 70, grade: 'A', gp: 5 },
  { studentMatricNo: '220303010011', courseCode: 'CSC 403', test: 20, assignment: 8, exam: 38, total: 66, grade: 'B', gp: 4 },
  { studentMatricNo: '220303010011', courseCode: 'CSC 405', test: 17, assignment: 6, exam: 35, total: 58, grade: 'C', gp: 3 },

  // Bello Rukayat Kehinde - 400L
  { studentMatricNo: '220303010022', courseCode: 'CSC 401', test: 28, assignment: 9, exam: 50, total: 87, grade: 'A', gp: 5 },
  { studentMatricNo: '220303010022', courseCode: 'CSC 403', test: 24, assignment: 8, exam: 46, total: 78, grade: 'A', gp: 5 },
  { studentMatricNo: '220303010022', courseCode: 'CSC 405', test: 19, assignment: 7, exam: 40, total: 66, grade: 'B', gp: 4 },

  // Falade Grace Oluwatoyin - 400L
  { studentMatricNo: '220303010055', courseCode: 'CSC 401', test: 18, assignment: 6, exam: 32, total: 56, grade: 'C', gp: 3 },
  { studentMatricNo: '220303010055', courseCode: 'CSC 403', test: 15, assignment: 5, exam: 25, total: 45, grade: 'D', gp: 2 },
  { studentMatricNo: '220303010055', courseCode: 'CSC 405', test: 12, assignment: 4, exam: 20, total: 36, grade: 'F', gp: 0 }
];

export const DEFAULT_USERS: User[] = [
  // Admins (2)
  { username: 'admin1', password: 'adminpassword1', role: 'admin', name: 'Admin Director (Central)' },
  { username: 'admin2', password: 'adminpassword2', role: 'admin', name: 'Admin Registrar (CS Dept)' },
  
  // Lecturers (5)
  { username: 'lecturer1', password: 'lecturerpassword1', role: 'teacher', name: 'Mr. Akinrinlola Ibitoye Akinfolajimi' },
  { username: 'lecturer2', password: 'lecturerpassword2', role: 'teacher', name: 'Dr. Falola Babatunde' },
  { username: 'lecturer3', password: 'lecturerpassword3', role: 'teacher', name: 'Mrs. Odusanya Beatrice' },
  { username: 'lecturer4', password: 'lecturerpassword4', role: 'teacher', name: 'Prof. Adebayo Adesina' },
  { username: 'lecturer5', password: 'lecturerpassword5', role: 'teacher', name: 'Mr. Igwe Chukwuma' },

  // Students (20)
  ...DEFAULT_STUDENTS.map((student, idx) => ({
    username: student.matricNo,
    password: `studentpassword${idx + 1}`,
    role: 'student' as const,
    name: student.name,
    associatedId: student.matricNo
  }))
];

