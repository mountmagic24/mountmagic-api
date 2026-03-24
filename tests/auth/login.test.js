const request = require("supertest");
const app = require("../../src/app");
const User = require("../../src/models/User");

describe("Auth Login", () => {
  test("Should login user with correct credentials", async () => {
    await request(app).post("/api/auth/register").send({
      name: "Devansh",
      email: "login@test.com",
      password: "123456",
    });
    const res = await request(app).post("/api/auth/login").send({
      email: "login@test.com",
      password: "123456",
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  test("should fail with wrong password", async () => {
    await request(app).post("/api/auth/register").send({
      name: "Devansh",
      email: "wrong@test.com",
      password: "123456",
    });

    const res = await request(app).post("/api/auth/login").send({
      email: "wrong@test.com",
      password: "wrongpass",
    });
    expect(res.statusCode).toBe(401);
  });
  test("should fail if user does not exist", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "nouser@test.com",
      password: "123456",
    });
    expect(res.statusCode).toBe(404);
  });
});
