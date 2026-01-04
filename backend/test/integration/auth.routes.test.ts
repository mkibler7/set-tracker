import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import { createApp } from "../../app.js";

const app = createApp();

function getSetCookies(res: request.Response): string[] {
  const raw = res.headers["set-cookie"];
  if (!raw) return [];
  return Array.isArray(raw) ? raw : [raw];
}

describe("Auth routes", () => {
  let agent: ReturnType<typeof request.agent>;

  beforeEach(() => {
    agent = request.agent(app);
  });

  const register = async (email?: string, password = "Password123!") => {
    return agent.post("/auth/register").send({
      email: email ?? `test-${Date.now()}@example.com`,
      password,
    });
  };

  const login = async (email: string, password = "Password123!") => {
    return agent.post("/auth/login").send({ email, password });
  };

  const refresh = async () => {
    return agent.post("/auth/refresh");
  };

  const logout = async () => {
    return agent.post("/auth/logout");
  };

  it("POST /auth/register returns accessToken + user and sets refresh cookie", async () => {
    const res = await register();

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("accessToken");
    expect(res.body).toHaveProperty("user.id");
    expect(res.body).toHaveProperty("user.email");

    const setCookie = getSetCookies(res);

    // refresh cookie exists
    expect(setCookie.join(";")).toContain("rt=");
    // your register sets Path=/auth/refresh
    expect(setCookie.join(";")).toContain("Path=/auth/refresh");
  });

  it("POST /auth/login returns accessToken + user and sets refresh cookie", async () => {
    const email = `test-${Date.now()}@example.com`;
    await register(email);

    const res = await login(email);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("accessToken");
    expect(res.body).toHaveProperty("user.id");
    expect(res.body.user.email).toBe(email);

    const setCookie = getSetCookies(res);
    expect(setCookie.join(";")).toContain("rt=");
    expect(setCookie.join(";")).toContain("Path=/auth/refresh");
  });

  it("POST /auth/refresh returns a new accessToken when refresh cookie is present", async () => {
    await register();

    const res = await refresh();
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("accessToken");
  });

  it("POST /auth/refresh rotates refresh cookie (if rotation is enabled)", async () => {
    const reg = await register();

    // capture the rt cookie from register
    const regCookies = getSetCookies(reg);
    const regRt = regCookies.find((c: string) => c.startsWith("rt="));
    expect(regRt).toBeTruthy();

    const ref1 = await refresh();
    expect(ref1.status).toBe(200);
    expect(ref1.body).toHaveProperty("accessToken");

    const refreshCookies = getSetCookies(ref1);
    const refRt = refreshCookies.find((c: string) => c.startsWith("rt="));

    // Once rotation is active, this should exist and differ from regRt.
    expect(refRt).toBeTruthy();
    expect(refRt).not.toEqual(regRt);
  });

  it("POST /auth/logout clears refresh cookie and subsequent refresh fails", async () => {
    await register();

    const out = await logout();

    expect(out.status).toBe(200);
    expect(out.body).toEqual({ ok: true });

    // Flexible assertion that works either way:
    expect([200, 204]).toContain(out.status);

    // After logout, refresh should fail because cookie cleared/revoked
    const ref = await refresh();
    expect(ref.status).toBe(401);
    expect(ref.body).toHaveProperty("message");
  });

  it("POST /auth/register returns 409 for duplicate email", async () => {
    const email = `test-${Date.now()}@example.com`;

    const first = await register(email);
    expect(first.status).toBe(201);

    const second = await register(email);
    expect(second.status).toBe(409);
    expect(second.body).toHaveProperty("message");
  });

  it("POST /auth/login returns 401 for wrong password", async () => {
    const email = `test-${Date.now()}@example.com`;
    await register(email);

    const res = await login(email, "WrongPassword123!");
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message");
  });
});
