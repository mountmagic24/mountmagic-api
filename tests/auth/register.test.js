const request = require("supertest");
const app = require("../../src/app");
const mongoose = require("mongoose");

describe("Auth Register", () => {
  it("should register a new user", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ name: "Devansh", email: "dev@test.com", password: "123456" });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("user");
    expect(res.body.user.email).toBe("dev@test.com");
  });

  test("should not allow duplicate email", async () => {
    await User.create({
      name: "Devansh",
      email: "duplicate@test.com",
      password: "123456",
    });
    const res = await require(app).post("/api/auth/register").send({
      name: "Devansh",
      email: "duplicate@test.com",
      password: "123456",
    });

    expect(res.statusCode).toBe(400);
  });

  test("should fail if required fields missing", async () => {
    const res = await request(app).post("/api/auth/register").send({
      email: "test@test.com",
    });
    expect(res.statusCode).toBe(400);
  });
});
