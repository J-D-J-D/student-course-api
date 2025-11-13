const storage = require('../../src/services/storage');
const ctrl = require('../../src/controllers/coursesController');

// utilitaire pour simuler req/res Express
function mockRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
}

beforeEach(() => {
  storage.reset();
  storage.seed();
});

test('listCourses should return paginated courses', () => {
  const req = { query: { page: 1, limit: 2 } };
  const res = mockRes();
  ctrl.listCourses(req, res);
  expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
    courses: expect.any(Array),
    total: 3,
  }));
  expect(res.json.mock.calls[0][0].courses.length).toBe(2);
});

test('listCourses should filter by title', () => {
  const req = { query: { title: 'Math' } };
  const res = mockRes();
  ctrl.listCourses(req, res);
  const result = res.json.mock.calls[0][0];
  expect(result.courses.length).toBe(1);
  expect(result.courses[0].title).toBe('Math');
});

test('getCourse should return 404 if not found', () => {
  const req = { params: { id: 999 } };
  const res = mockRes();
  ctrl.getCourse(req, res);
  expect(res.status).toHaveBeenCalledWith(404);
  expect(res.json).toHaveBeenCalledWith({ error: 'Course not found' });
});

test('getCourse should return course and its students', () => {
  const req = { params: { id: 1 } };
  const res = mockRes();
  ctrl.getCourse(req, res);
  const data = res.json.mock.calls[0][0];
  expect(data.course).toBeDefined();
  expect(data.course.title).toBe('Math');
  expect(data.students).toBeInstanceOf(Array);
});

test('createCourse should return 400 if missing params', () => {
  const req = { body: { title: 'NoTeacher' } };
  const res = mockRes();
  ctrl.createCourse(req, res);
  expect(res.status).toHaveBeenCalledWith(400);
  expect(res.json).toHaveBeenCalledWith({ error: 'title and teacher required' });
});

test('createCourse should return 201 when valid', () => {
  const req = { body: { title: 'Bio', teacher: 'Dr. Marie' } };
  const res = mockRes();
  ctrl.createCourse(req, res);
  expect(res.status).toHaveBeenCalledWith(201);
  expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
    title: 'Bio',
    teacher: 'Dr. Marie',
  }));
});

test('deleteCourse should return 404 if not found', () => {
  const req = { params: { id: 999 } };
  const res = mockRes();
  ctrl.deleteCourse(req, res);
  expect(res.status).toHaveBeenCalledWith(404);
});

test('updateCourse should return 404 if not found', () => {
  const req = { params: { id: 999 }, body: { title: 'New' } };
  const res = mockRes();
  ctrl.updateCourse(req, res);
  expect(res.status).toHaveBeenCalledWith(404);
});

test('updateCourse should update title and teacher', () => {
  const req = { params: { id: 1 }, body: { title: 'Advanced Math', teacher: 'Mr. Newton' } };
  const res = mockRes();
  ctrl.updateCourse(req, res);
  expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
    title: 'Advanced Math',
    teacher: 'Mr. Newton',
  }));
});
