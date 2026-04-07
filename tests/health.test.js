const request = require("supertest");
const app = require("../src/app");

describe("Health Check", () => {
  test("GET /health should return server status", async () => {
    const res = await request(app).get("/api/health");

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("status");
  });
  test("GET / should return welcome message", async () => {
    const res = await request(app).get("/api");

    expect(res.statusCode).toBe(200);
  });
});
