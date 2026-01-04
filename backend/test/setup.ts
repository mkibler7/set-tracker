import "dotenv/config";
import { beforeAll, afterAll, afterEach } from "vitest";
import { connectTestDb, clearTestDb, disconnectTestDb } from "./mongoTestDb";

process.env.JWT_ACCESS_SECRET ||= "test_access_secret";
process.env.JWT_REFRESH_SECRET ||= "test_refresh_secret";
process.env.ACCESS_TOKEN_TTL ||= "15m";
process.env.REFRESH_TOKEN_TTL_DAYS ||= "30";

beforeAll(async () => {
  await connectTestDb();
});

afterEach(async () => {
  await clearTestDb();
});

afterAll(async () => {
  await disconnectTestDb();
});
