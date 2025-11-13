const storage = require('../../src/services/storage');
const ctrl = require('../../src/controllers/studentsController');

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

test('listStudents should return paginated students', () => {
  const req = { query: { page: 1, limit: 2 } };
  const res = mockRes();
  ctrl.listStudents(req, res);
  const result = res.json.mock.calls[0][0];
  expect(result.students.length).toBe(2);
  expect(result.total).toBe(3);
});

test('getStudent should return 404 if not found', () => {
  const req = { params: { id: 999 } };
  const res = mockRes();
  ctrl.getStudent(req, res);
  expect(res.status).toHaveBeenCalledWith(404);
});

test('createStudent should return 400 if missing fields', () => {
  const req = { body: { name: 'NoEmail' } };
  const res = mockRes();
  ctrl.createStudent(req, res);
  expect(res.status).toHaveBeenCalledWith(400);
  expect(res.json).toHaveBeenCalledWith({ error: 'name and email required' });
});

test('createStudent should return 400 if duplicate email', () => {
  const req = { body: { name: 'Duplicate', email: 'alice@example.com' } };
  const res = mockRes();
  ctrl.createStudent(req, res);
  expect(res.status).toHaveBeenCalledWith(400);
  expect(res.json).toHaveBeenCalledWith({ error: 'Email must be unique' });
});

test('createStudent should return 201 when valid', () => {
  const req = { body: { name: 'John', email: 'john@example.com' } };
  const res = mockRes();
  ctrl.createStudent(req, res);
  expect(res.status).toHaveBeenCalledWith(201);
  expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
    name: 'John',
    email: 'john@example.com',
  }));
});

test('deleteStudent should return 404 if not found', () => {
  const req = { params: { id: 999 } };
  const res = mockRes();
  ctrl.deleteStudent(req, res);
  expect(res.status).toHaveBeenCalledWith(404);
});

test('updateStudent should return 404 if not found', () => {
  const req = { params: { id: 999 }, body: { name: 'New' } };
  const res = mockRes();
  ctrl.updateStudent(req, res);
  expect(res.status).toHaveBeenCalledWith(404);
});

test('updateStudent should update name and email', () => {
  const req = { params: { id: 1 }, body: { name: 'Alice Updated', email: 'alice2@example.com' } };
  const res = mockRes();
  ctrl.updateStudent(req, res);
  expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
    name: 'Alice Updated',
    email: 'alice2@example.com',
  }));
});
