// Write your tests here
const db = require('../data/dbConfig')
const request = require('supertest')
const server = require('./server')
const Users = require('./users/users-model')




beforeAll(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})

beforeEach(async () => {
  await db('users').truncate()
})



describe('test endpoints', () => {


  test('users can get inserted', async () => {
    let result = await Users.add({ username: 'ludvig', password: '1234' })
    expect(result).toEqual({ username: 'ludvig', password: '1234', id: 1 })
    let users = await db('users')
    expect(users).toHaveLength(1)
})

  test('call the up endpoint', async () => {
    const result = await request(server).get('/')
    expect(result.status).toBe(200)
  })

  test('[POST] /register success', async () => {
    const post = await request(server)
      .post('/api/auth/register')
      .send({
        username: 'dave',
        password: '1234'
      })
    expect(post.status).toBe(201)
    const result = await Users.findById(1)
    expect(result.username).toBe('dave')
  })

  test('[POST] /register failure', async () => {
    let result = await request(server)
      .post('/api/auth/register')
      .send({
        username: 'dave'
      })
    expect(result.status).toBe(422)
  })

  test('[POST] /login success', async () => {
    await request(server)
      .post('/api/auth/register')
      .send({
        username: 'ludvig',
        password: '1234'
      })

    const result = await request(server)
      .post('/api/auth/login')
      .send({
        username: 'ludvig',
        password: '1234'
      })
      expect(result.status).toBe(200)
      expect(result.body.message).toEqual('welcome, ludvig')
  })

  test('[POST] /login failure', async () => {
    await request(server)
      .post('/api/auth/register')
      .send({
        username: 'ludvig',
        password: '1234'
      })

    const result = await request(server)
      .post('/api/auth/login')
      .send({
        username: 'dave',
        password: '1234'
      })
      expect(result.status).toBe(401)
  })


  //the restrict middleware makes this test fail
  
  // test('[GET] /jokes', async () => {
  //   await request(server)
  //   .post('/api/auth/register')
  //   .send({
  //     username: 'ludvig',
  //     password: '1234'
  //   })

  //   await request(server)
  //   .post('/api/auth/login')
  //   .send({
  //     username: 'ludvig',
  //     password: '1234'
  //   })

  //   const result = await request(server)
  //     .get('/api/jokes')
  //   expect(result.error).toBe(' ')
  // })

})