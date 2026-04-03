const request = require("supertest");
const app = require("../../src/app");

const getToken = async () => {
  await request(app).post("/api/auth/register").send({
    name: "Service User",
    email: "service@test.com",
    password: "123456",
  });

  const login = await request(app).post("/api/auth/login").send({
    email: "service@test.com",
    password: "123456",
  });

  return login.body.token;
};

describe("Services API", () => {
  test("should create a service when authenticated", async () => {
    const token = await getToken();

    const res = await request(app)
      .post("/api/services")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Climbing", description: "Mountain climbing" });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.service.title).toBe("Climbing");
  });

  test("should list services", async () => {
    const token = await getToken();
    await request(app)
      .post("/api/services")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Camping", description: "Camping service" });

    const res = await request(app).get("/api/services");

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data.services)).toBe(true);
    expect(res.body.data.services.length).toBe(1);
  });

  test("should get a service by id", async () => {
    const token = await getToken();
    const created = await request(app)
      .post("/api/services")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Hiking", description: "Guided hikes" });

    const serviceId = created.body.data.service._id;

    const res = await request(app).get(`/api/services/${serviceId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.service.title).toBe("Hiking");
  });

  test("should update a service", async () => {
    const token = await getToken();
    const created = await request(app)
      .post("/api/services")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Ski", description: "Ski lessons" });

    const serviceId = created.body.data.service._id;

    const res = await request(app)
      .put(`/api/services/${serviceId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ description: "Ski lessons and rentals" });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.service.description).toBe("Ski lessons and rentals");
  });

  test("should delete a service", async () => {
    const token = await getToken();
    const created = await request(app)
      .post("/api/services")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Snowshoe", description: "Snowshoe tours" });

    const serviceId = created.body.data.service._id;

    const res = await request(app)
      .delete(`/api/services/${serviceId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test("should reject creating service without token", async () => {
    const res = await request(app).post("/api/services").send({
      title: "No Auth",
      description: "Should fail",
    });

    expect(res.statusCode).toBe(401);
  });
});
