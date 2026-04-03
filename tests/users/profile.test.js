const request = require("supertest");
const app = require("../../src/app");

const registerAndLogin = async () => {
  await request(app).post("/api/auth/register").send({
    name: "User",
    email: "user@test.com",
    password: "123456",
  });

  const login = await request(app).post("/api/auth/login").send({
    email: "user@test.com",
    password: "123456",
  });

  return login.body.token;
};

describe("User Profile", () => {
  test("should return profile for authenticated user", async () => {
    const token = await registerAndLogin();

    const res = await request(app)
      .get("/api/users/profile")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe("user@test.com");
  });

  test("should update profile for authenticated user", async () => {
    const token = await registerAndLogin();

    const res = await request(app)
      .put("/api/users/profile")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Updated User", email: "updated@test.com" });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.name).toBe("Updated User");
    expect(res.body.data.user.email).toBe("updated@test.com");
  });

  test("should reject profile access without token", async () => {
    const res = await request(app).get("/api/users/profile");

    expect(res.statusCode).toBe(401);
  });
});
