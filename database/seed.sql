PRAGMA foreign_keys = ON;

DELETE FROM marks;
DELETE FROM courses;
DELETE FROM students;

INSERT INTO students (matric_no, name, level, department, email) VALUES
('220303010092', 'Odubona Muiz Adegbola', 400, 'Computer Science', 'muiz.odubona@lasustech.edu.ng'),
('220303010015', 'Balogun Aminat Adebisi', 400, 'Computer Science', 'aminat.balogun@lasustech.edu.ng'),
('220303010048', 'Okafor Chinedu Emmanuel', 400, 'Computer Science', 'chinedu.okafor@lasustech.edu.ng'),
('230303010112', 'Williams David Oluwaseun', 300, 'Computer Science', 'david.williams@lasustech.edu.ng'),
('230303010056', 'Akin-Taylor Elizabeth', 300, 'Computer Science', 'elizabeth.akingbade@lasustech.edu.ng');

INSERT INTO courses (code, title, credit_units, level, semester) VALUES
('CSC 401', 'Software Engineering', 3, 400, 1),
('CSC 403', 'Database Management Systems', 3, 400, 1),
('CSC 405', 'System Security', 2, 400, 1),
('CSC 407', 'Computer Graphics & Visuals', 3, 400, 1),
('CSC 411', 'Artificial Intelligence', 3, 400, 1),
('CSC 402', 'Distributed Computing Systems', 3, 400, 2),
('CSC 404', 'Human Computer Interaction', 2, 400, 2),
('CSC 406', 'Compiler Construction', 3, 400, 2),
('CSC 499', 'Final Year Project Work', 6, 400, 2),
('CSC 301', 'Data Structures & Algorithms', 3, 300, 1),
('CSC 303', 'Operating Systems I', 3, 300, 1),
('CSC 305', 'Object-Oriented Programming', 3, 300, 1);

INSERT INTO marks (student_matric_no, course_code, test, assignment, exam, total, grade, gp) VALUES
('220303010092', 'CSC 401', 25, 9, 52, 86, 'A', 5),
('220303010092', 'CSC 403', 26, 8, 48, 82, 'A', 5),
('220303010092', 'CSC 405', 21, 7, 45, 73, 'A', 5),
('220303010092', 'CSC 407', 19, 9, 41, 69, 'B', 4),
('220303010092', 'CSC 411', 24, 8, 50, 82, 'A', 5),
('220303010092', 'CSC 402', 22, 8, 49, 79, 'A', 5),
('220303010092', 'CSC 404', 20, 9, 40, 69, 'B', 4),
('220303010092', 'CSC 406', 18, 7, 37, 62, 'B', 4),
('220303010092', 'CSC 499', 27, 9, 53, 89, 'A', 5),
('220303010015', 'CSC 401', 23, 8, 46, 77, 'A', 5),
('220303010015', 'CSC 403', 18, 7, 41, 66, 'B', 4),
('220303010015', 'CSC 405', 20, 8, 35, 63, 'B', 4),
('220303010015', 'CSC 407', 22, 8, 48, 78, 'A', 5),
('220303010015', 'CSC 411', 15, 6, 34, 55, 'C', 3),
('220303010048', 'CSC 401', 17, 7, 32, 56, 'C', 3),
('220303010048', 'CSC 403', 16, 6, 36, 58, 'C', 3),
('220303010048', 'CSC 405', 14, 5, 29, 48, 'D', 2),
('220303010048', 'CSC 407', 15, 5, 25, 45, 'D', 2),
('220303010048', 'CSC 411', 12, 6, 21, 39, 'F', 0),
('230303010112', 'CSC 301', 24, 8, 45, 77, 'A', 5),
('230303010112', 'CSC 303', 21, 7, 40, 68, 'B', 4),
('230303010112', 'CSC 305', 20, 8, 43, 71, 'A', 5);
