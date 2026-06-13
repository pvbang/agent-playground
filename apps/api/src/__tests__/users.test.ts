import { describe, it, expect, beforeAll, afterAll } from "vitest";
import express from "express";
import request from "supertest";
import usersRouter from "../routes/users";

const app = express();
app.use(express.json());
app.use("/users", usersRouter);

describe("GET /users", () => {
  it("should return 200 with empty data array", async () => {
    const res = await request(app).get("/users");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("data");
    expect(res.body.data).toEqual([]);
    expect(res.body).toHaveProperty("message");
  });

  it("should return JSON content type", async () => {
    const res = await request(app).get("/users");
    expect(res.headers["content-type"]).toMatch(/json/);
  });

  it("should include a message about not being implemented", async () => {
    const res = await request(app).get("/users");
    expect(res.body.message).toContain("not implemented");
  });
});

describe("POST /users", () => {
  it("should return 201 with user data", async () => {
    const userData = { name: "Test User", email: "test@example.com" };
    const res = await request(app).post("/users").send(userData);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("data");
    expect(res.body.data).toHaveProperty("id", "stub-user-id");
    expect(res.body.data).toHaveProperty("name", "Test User");
    expect(res.body.data).toHaveProperty("email", "test@example.com");
  });

  it("should return JSON content type", async () => {
    const res = await request(app).post("/users").send({ name: "User" });
    expect(res.headers["content-type"]).toMatch(/json/);
  });

  it("should include a message about not being implemented", async () => {
    const res = await request(app).post("/users").send({});
    expect(res.body.message).toContain("not implemented");
  });

  it("should handle empty body gracefully", async () => {
    const res = await request(app).post("/users").send({});
    expect(res.status).toBe(201);
    expect(res.body.data).toHaveProperty("id", "stub-user-id");
  });

  it("should spread all provided fields into response data", async () => {
    const userData = { name: "Alice", role: "admin", age: 30 };
    const res = await request(app).post("/users").send(userData);
    expect(res.body.data.name).toBe("Alice");
    expect(res.body.data.role).toBe("admin");
    expect(res.body.data.age).toBe(30);
  });
});
