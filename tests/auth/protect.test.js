const request = require("supertest");
const app = require("../../src/app");

describe("Protected Route", () => {
  test("should reject request without token", async () => {
    const res = await request(app).get("/api/users/profile");

    expect(res.statusCode).toBe(401);
  });

  test("should allow request with valid token", async () => {
    const register = await request(app).post("/api/auth/register").send({
      name: "Devansh",
      email: "jwt@test.com",
      password: "123456",
    });

    const login = await request(app).post("/api/auth/login").send({
      email: "jwt@test.com",
      password: "123456",
    });

    const token = login.body.token;

    const res = await request(app)
      .get("/api/users/profile")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
  });
});
