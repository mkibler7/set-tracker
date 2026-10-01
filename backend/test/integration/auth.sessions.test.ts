import { describe, it, expect, vi, afterEach } from "vitest";
import request from "supertest";
import bcrypt from "bcrypt";
import mongoose from "mongoose";

import { createApp } from "../../app.js";
import User from "../../src/models/User.js";
import RefreshSession from "../../src/models/RefreshSession.js";
import PasswordResetToken from "../../src/models/PasswordResetToken.js";
import EmailVerificationToken from "../../src/models/EmailVerificationToken.js";
import { hashToken } from "../../src/utils/tokens.js";
import { syncTokenIndexes } from "../../src/config/indexes.js";

const app = createApp();
const PASSWORD = "Password123!";

let counter = 0;
async function createVerifiedUser() {
  const email = `sess-${Date.now()}-${counter++}@test.local`;
  const user = await User.create({
    email,
    passwordHash: await bcrypt.hash(PASSWORD, 4),
    emailVerifiedAt: new Date(),
  });
  return { email, userId: String(user._id) };
}

function cookieValue(res: request.Response, name: string) {
  const raw = res.headers["set-cookie"];
  const list = Array.isArray(raw) ? raw : raw ? [raw] : [];
  const line = list.find((c) => c.startsWith(`${name}=`));
  return line?.split(";")[0]!.slice(name.length + 1);
}

/** Log in and return the refresh token value from the rt cookie. */
async function loginRt(email: string) {
  const res = await request(app)
    .post("/api/auth/login")
    .send({ email, password: PASSWORD });
  expect(res.status).toBe(200);
  const rt = cookieValue(res, "rt");
  expect(rt).toBeTruthy();
  return rt!;
}

const refresh = (rt: string) =>
  request(app).post("/api/auth/refresh").set("Cookie", [`rt=${rt}`]);

const sessionFor = (rt: string) =>
  RefreshSession.findOne({ tokenHash: hashToken(rt) });

/** Pretend a token was rotated `seconds` ago. */
async function backdateRotation(rt: string, seconds: number) {
  await RefreshSession.updateOne(
    { tokenHash: hashToken(rt) },
    { $set: { revokedAt: new Date(Date.now() - seconds * 1000) } },
  );
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("Refresh session rotation", () => {
  it("login starts a family and refresh rotates within it", async () => {
    const { email } = await createVerifiedUser();
    const rt0 = await loginRt(email);

    const s0 = await sessionFor(rt0);
    expect(s0?.familyId).toBeTruthy();

    const res = await refresh(rt0);
    expect(res.status).toBe(200);
    const rt1 = cookieValue(res, "rt")!;
    expect(rt1).toBeTruthy();
    expect(rt1).not.toBe(rt0);

    const old = await sessionFor(rt0);
    expect(old?.revokedReason).toBe("rotated");
    expect(old?.revokedAt).toBeTruthy();

    const next = await sessionFor(rt1);
    expect(next?.familyId).toBe(s0!.familyId);
    expect(next?.revokedAt).toBeNull();
  });

  it("each login gets its own family", async () => {
    const { email } = await createVerifiedUser();
    const a = await sessionFor(await loginRt(email));
    const b = await sessionFor(await loginRt(email));
    expect(a!.familyId).not.toBe(b!.familyId);
  });

  it("concurrent refreshes with the same token all succeed (multi-tab)", async () => {
    const { email } = await createVerifiedUser();
    const rt0 = await loginRt(email);

    const results = await Promise.all([refresh(rt0), refresh(rt0), refresh(rt0)]);
    expect(results.map((r) => r.status)).toEqual([200, 200, 200]);

    // Exactly one request claimed the original session
    const old = await sessionFor(rt0);
    expect(old?.revokedReason).toBe("rotated");
    const family = await RefreshSession.find({ familyId: old!.familyId });
    expect(family.filter((s) => s.revokedAt === null)).toHaveLength(3);
  });

  it("a rotated token replayed within the grace window still refreshes", async () => {
    const { email } = await createVerifiedUser();
    const rt0 = await loginRt(email);
    expect((await refresh(rt0)).status).toBe(200);

    await backdateRotation(rt0, 5);
    const replay = await refresh(rt0);
    expect(replay.status).toBe(200);
  });

  it("a rotated token replayed after the grace window revokes the whole family", async () => {
    const { email } = await createVerifiedUser();
    const rt0 = await loginRt(email);
    const r1 = await refresh(rt0);
    const rt1 = cookieValue(r1, "rt")!;

    await backdateRotation(rt0, 120);
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

    const replay = await refresh(rt0);
    expect(replay.status).toBe(401);
    expect(warn).toHaveBeenCalledWith(expect.stringMatching(/reuse detected/));

    // The legitimate holder's current token is dead too
    const current = await sessionFor(rt1);
    expect(current?.revokedReason).toBe("reuse");
    expect((await refresh(rt1)).status).toBe(401);
  });

  it("reuse detection only revokes the affected family", async () => {
    const { email } = await createVerifiedUser();
    const phoneRt = await loginRt(email);
    const laptopRt0 = await loginRt(email);
    await refresh(laptopRt0);

    await backdateRotation(laptopRt0, 120);
    vi.spyOn(console, "warn").mockImplementation(() => {});
    expect((await refresh(laptopRt0)).status).toBe(401);

    expect((await refresh(phoneRt)).status).toBe(200);
  });

  it("logout ends the family, so a grace-window replay cannot revive it", async () => {
    const { email } = await createVerifiedUser();
    const rt0 = await loginRt(email);
    const r1 = await refresh(rt0);
    const rt1 = cookieValue(r1, "rt")!;

    const out = await request(app)
      .post("/api/auth/logout")
      .set("Cookie", [`rt=${rt1}`]);
    expect(out.status).toBe(200);

    expect((await refresh(rt1)).status).toBe(401);
    expect((await refresh(rt0)).status).toBe(401); // still inside the grace window
  });

  it("logout leaves the user's other devices signed in", async () => {
    const { email } = await createVerifiedUser();
    const phoneRt = await loginRt(email);
    const laptopRt = await loginRt(email);

    await request(app).post("/api/auth/logout").set("Cookie", [`rt=${laptopRt}`]);

    expect((await refresh(laptopRt)).status).toBe(401);
    expect((await refresh(phoneRt)).status).toBe(200);
  });

  it("password reset ends every family, including grace-window replays", async () => {
    const { email, userId } = await createVerifiedUser();
    const rt0 = await loginRt(email);
    expect((await refresh(rt0)).status).toBe(200);
    const otherDeviceRt = await loginRt(email);

    const rawReset = "r".repeat(64);
    await PasswordResetToken.create({
      userId,
      tokenHash: hashToken(rawReset),
      expiresAt: new Date(Date.now() + 60_000),
    });
    const reset = await request(app)
      .post("/api/auth/reset-password")
      .send({ token: rawReset, password: "NewPassword123!" });
    expect(reset.status).toBe(200);

    expect((await refresh(rt0)).status).toBe(401);
    expect((await refresh(otherDeviceRt)).status).toBe(401);
  });

  it("a reset link can only be used once, even concurrently", async () => {
    const { userId } = await createVerifiedUser();
    const rawReset = "s".repeat(64);
    await PasswordResetToken.create({
      userId,
      tokenHash: hashToken(rawReset),
      expiresAt: new Date(Date.now() + 60_000),
    });

    const send = (password: string) =>
      request(app).post("/api/auth/reset-password").send({ token: rawReset, password });
    const results = await Promise.all([send("FirstPassword1!"), send("SecondPassword1!")]);

    expect(results.map((r) => r.status).sort()).toEqual([200, 400]);
  });

  it("sessions created before families existed keep working", async () => {
    const { email, userId } = await createVerifiedUser();
    const rt0 = await loginRt(email);

    // Simulate a pre-deploy session: no familyId, no revokedReason
    await RefreshSession.collection.updateOne(
      { tokenHash: hashToken(rt0) },
      { $unset: { familyId: "", revokedReason: "" } },
    );
    const legacy = await sessionFor(rt0);
    expect(legacy?.familyId).toBeUndefined();

    const res = await refresh(rt0);
    expect(res.status).toBe(200);

    const next = await sessionFor(cookieValue(res, "rt")!);
    expect(next?.familyId).toBe(String(legacy!._id));
    expect(String(next?.userId)).toBe(userId);

    // And the legacy token still benefits from the grace window
    expect((await refresh(rt0)).status).toBe(200);
  });

  it("a session revoked before revokedReason existed is rejected, not treated as reuse", async () => {
    const { email } = await createVerifiedUser();
    const rt0 = await loginRt(email);
    await RefreshSession.collection.updateOne(
      { tokenHash: hashToken(rt0) },
      { $set: { revokedAt: new Date(Date.now() - 600_000) }, $unset: { revokedReason: "" } },
    );
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

    expect((await refresh(rt0)).status).toBe(401);
    expect(warn).not.toHaveBeenCalled();
  });

  it("a database error returns 500 and does not clear the user's cookies", async () => {
    const { email } = await createVerifiedUser();
    const rt0 = await loginRt(email);

    vi.spyOn(RefreshSession, "findOneAndUpdate").mockRejectedValueOnce(
      new Error("db down"),
    );
    vi.spyOn(console, "error").mockImplementation(() => {});

    const res = await refresh(rt0);
    expect(res.status).toBe(500);
    expect(res.body).toEqual({ message: "Internal server error" });
    expect(res.headers["set-cookie"]).toBeUndefined();

    // Once the database is back, the same token still works
    expect((await refresh(rt0)).status).toBe(200);
  });
});

describe("Token TTL indexes", () => {
  const models = [RefreshSession, PasswordResetToken, EmailVerificationToken];

  it("expire documents at expiresAt on all token collections", async () => {
    await syncTokenIndexes();
    for (const model of models) {
      const indexes = await model.collection.indexes();
      const ttl = indexes.find((i) => i.key.expiresAt === 1);
      expect(ttl, model.modelName).toBeTruthy();
      expect(ttl!.expireAfterSeconds, model.modelName).toBe(0);
    }
  });

  it("converts an existing non-TTL expiresAt index (production upgrade path)", async () => {
    const coll = RefreshSession.collection;
    await coll.dropIndex("expiresAt_1").catch(() => {});
    await coll.createIndex({ expiresAt: 1 }, { name: "expiresAt_1" });

    const before = (await coll.indexes()).find((i) => i.name === "expiresAt_1");
    expect(before?.expireAfterSeconds).toBeUndefined();

    await syncTokenIndexes();

    const after = (await coll.indexes()).find((i) => i.key.expiresAt === 1);
    expect(after?.expireAfterSeconds).toBe(0);
  });

  it("does not block startup if index sync fails", async () => {
    vi.spyOn(RefreshSession, "syncIndexes").mockRejectedValueOnce(new Error("nope"));
    const err = vi.spyOn(console, "error").mockImplementation(() => {});

    await expect(syncTokenIndexes()).resolves.toBeUndefined();
    expect(err).toHaveBeenCalled();
    expect(mongoose.connection.readyState).toBe(1);
  });
});
