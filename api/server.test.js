// Write your tests here
const db = require("../data/dbConfig");
const request = require("supertest");
const server = require("../api/server");

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});

beforeEach(async () => {
  await db.seed.run();
});

test("[---] SANITY", () => {
  expect(true).toBe(true);
});

describe("[POST] /login", () => {
  test("[a] valid login returns a welcome message", async () => {
    const user = { username: "bobby", password: "1234" };
    const res = await request(server).post("/api/auth/login").send(user);
    expect(res.body.message).toBe("welcome, bobby");
  });
  test("[b] valid login generates a token", async () => {
    const user = { username: "bobby", password: "1234" };
    const res = await request(server).post("/api/auth/login").send(user);
    expect(res.body.token).toBeTruthy();
  });
});

describe("[POST] /register", () => {
  test("[a] valid registration returns the registered user", async () => {
    const newUser = { username: "ben", password: "12345" };
    const res = await request(server).post("/api/auth/register").send(newUser);
    expect(res.body.username).toBe("ben");
  });
  test("[b] password is hashed prior to being stored in the database", async () => {
    const newUser = { username: "ben", password: "12345" };
    const res = await request(server).post("/api/auth/register").send(newUser);
    expect(res.body.password).not.toBe("12345");
  });
});

describe("[GET] /jokes", () => {
  test("[a] valid user is allowed to access jokes data after login", async () => {
    const user = { username: "dale", password: "1234" };
    const res = await request(server).post("/api/auth/login").send(user);
    const token = res.body.token;
    const jokes = await request(server)
      .get("/api/jokes")
      .set("Authorization", token);
    expect(jokes.body).toHaveLength(3);
  });
  test(" invalid token returns message 'token invalid'", async () => {
    const user = { username: "dale", password: "1234" };
    await request(server).post("/api/auth/login").send(user);
    const token = "uthgy";
    const jokes = await request(server)
      .get("/api/jokes")
      .set("Authorization", token);
    expect(jokes.body).toStrictEqual({ message: "token invalid" });
  });
});