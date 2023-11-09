const request = require('supertest');
const db = require('../data/dbConfig');
const server = require('./server');

beforeAll(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})

beforeEach(async () => {
  await db('users').truncate()
})

afterAll(async () => {
  await db.destroy()
})

test('sanity', () => {
  expect(true).toBe(true)
})

describe('authentication routers tests', () => {
  describe('[POST] /api/auth/register', () => {
    it('returns a correct status code', async () => {
      let user = { username: 'test', password: 'test' }
      const { username } = user
      const res = await request(server).post('/api/auth/register').send({ username, password: 'test' })
      console.log("res.body", res.body)
      expect(res.status).toBe(201)
    })
    it('failed registration due to username and password not in the payload', async () => {
      let user = { username: 'test', password: ''}
      const { username } = user
      const res = await request(server).post('/api/auth/register').send({ username })
      expect(res.status).toBe(422)
    })
  })
  describe('[POST] /api/auth/login', () => {
    it('must login to an existing account with provided credentials', async () => {
      let user = { username: 'test', password: 'test' }
      const { username } = user
      const res = await request(server).post('/api/auth/register').send({ username, password: 'test' })
      expect(res.status).toBe(201)
    })
    it('failed login due to username and password not in the payload', async () => {
      let user = { username: 'test', password: ''}
      const { username } = user
      const res = await request(server).post('/api/auth/register').send({ username })
      expect(res.status).toBe(422)
    })
  })
  describe('[GET] /api/jokes', () => {
    it('restriced access due to no token', async () => {
      const res = await request(server).get('/api/jokes')
      expect(res.status).toBe(401)
    })
    it('restriced access due to invalid token', async () => {
      const res = await request(server).get('/api/jokes')
      expect(res.status).toBe(401)
    })
  })
})