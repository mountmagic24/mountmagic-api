const request = require("supertest");
const app = require("../src/app");

describe("Health Check", () => {
  it("should return server status", async () => {
    const res = await request(app).get("/health");

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("ok");
  });

  it("should return welcome message from root route", async () => {
    const res = await request(app).get("/");

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Mount Magic API running");
  });
});
