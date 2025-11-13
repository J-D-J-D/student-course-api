const storage = require('../../src/services/storage');

beforeEach(() => {
  storage.reset();
  storage.seed();
});

test('should not allow duplicate course title', () => {
  const result = storage.create('courses', { title: 'Math', teacher: 'Someone' });
  expect(result.error).toBe('Course title must be unique');
});

test('should list seeded students', () => {
  const students = storage.list('students');
  expect(students.length).toBe(3);
  expect(students[0].name).toBe('Alice');
});

test('should create a new student', () => {
  const result = storage.create('students', { name: 'David', email: 'david@example.com' });
  expect(result.name).toBe('David');
  expect(storage.list('students').length).toBe(4);
});

test('should not allow duplicate student email', () => {
  const result = storage.create('students', { name: 'Eve', email: 'alice@example.com' });
  expect(result.error).toBe('Email must be unique');
});

test('should delete a student who is not enrolled', () => {
  const students = storage.list('students');
  const result = storage.remove('students', students[0].id);
  expect(result).toBe(true);
});

test('should not delete a student enrolled in a course', () => {
  const students = storage.list('students');
  const course = storage.list('courses')[0];
  storage.enroll(students[0].id, course.id);
  const result = storage.remove('students', students[0].id);
  expect(result.error).toBe('Cannot delete student: enrolled in a course');
});

test('should not allow more than 3 students in a course', () => {
  const course = storage.list('courses')[0];
  storage.create('students', { name: 'D', email: 'd@example.com' });
  storage.create('students', { name: 'E', email: 'e@example.com' });
  storage.create('students', { name: 'F', email: 'f@example.com' });

  const s = storage.list('students');
  storage.enroll(s[0].id, course.id);
  storage.enroll(s[1].id, course.id);
  storage.enroll(s[2].id, course.id);
  const result = storage.enroll(s[3].id, course.id);
  expect(result.error).toBe('Course is full');
});

test('should unenroll a student successfully', () => {
  const s = storage.list('students');
  const c = storage.list('courses')[0];
  storage.enroll(s[0].id, c.id);
  const result = storage.unenroll(s[0].id, c.id);
  expect(result.success).toBe(true);
});
