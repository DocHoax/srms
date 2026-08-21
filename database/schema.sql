PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS students (
  matric_no TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  level INTEGER NOT NULL,
  department TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS courses (
  code TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  credit_units INTEGER NOT NULL,
  level INTEGER NOT NULL,
  semester INTEGER NOT NULL CHECK (semester IN (1, 2)),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS marks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_matric_no TEXT NOT NULL,
  course_code TEXT NOT NULL,
  test INTEGER NOT NULL CHECK (test BETWEEN 0 AND 30),
  assignment INTEGER NOT NULL CHECK (assignment BETWEEN 0 AND 10),
  exam INTEGER NOT NULL CHECK (exam BETWEEN 0 AND 60),
  total INTEGER NOT NULL CHECK (total BETWEEN 0 AND 100),
  grade TEXT NOT NULL CHECK (grade IN ('A','B','C','D','E','F')),
  gp INTEGER NOT NULL CHECK (gp BETWEEN 0 AND 5),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(student_matric_no, course_code),
  FOREIGN KEY(student_matric_no) REFERENCES students(matric_no) ON DELETE CASCADE,
  FOREIGN KEY(course_code) REFERENCES courses(code) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_students_level ON students(level);
CREATE INDEX IF NOT EXISTS idx_courses_level_semester ON courses(level, semester);
CREATE INDEX IF NOT EXISTS idx_marks_student ON marks(student_matric_no);
CREATE INDEX IF NOT EXISTS idx_marks_course ON marks(course_code);
