const request = require("supertest");
const app = require("../../src/app");

const getToken = async () => {
  await request(app).post("/api/auth/register").send({
    name: "Blog User",
    email: "blog@test.com",
    password: "123456",
  });

  const login = await request(app).post("/api/auth/login").send({
    email: "blog@test.com",
    password: "123456",
  });

  return login.body.token;
};

describe("Blogs API", () => {
  test("should create a blog when authenticated", async () => {
    const token = await getToken();

    const res = await request(app)
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "First Blog", content: "Welcome to the blog" });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.blog.title).toBe("First Blog");
  });

  test("should list blogs", async () => {
    const token = await getToken();
    await request(app)
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "List Blog", content: "List content" });

    const res = await request(app).get("/api/blogs");

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data.blogs)).toBe(true);
    expect(res.body.data.blogs.length).toBe(1);
  });

  test("should get a blog by id", async () => {
    const token = await getToken();
    const created = await request(app)
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Detail Blog", content: "Detail content" });

    const blogId = created.body.data.blog._id;

    const res = await request(app).get(`/api/blogs/${blogId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.blog.title).toBe("Detail Blog");
  });

  test("should update a blog", async () => {
    const token = await getToken();
    const created = await request(app)
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Update Blog", content: "Old content" });

    const blogId = created.body.data.blog._id;

    const res = await request(app)
      .put(`/api/blogs/${blogId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ content: "New content" });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.blog.content).toBe("New content");
  });

  test("should delete a blog", async () => {
    const token = await getToken();
    const created = await request(app)
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Delete Blog", content: "Delete content" });

    const blogId = created.body.data.blog._id;

    const res = await request(app)
      .delete(`/api/blogs/${blogId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test("should reject creating blog without token", async () => {
    const res = await request(app).post("/api/blogs").send({
      title: "No Auth Blog",
      content: "Should fail",
    });

    expect(res.statusCode).toBe(401);
  });
});
