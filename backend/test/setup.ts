import { beforeAll, afterAll, afterEach } from "vitest";
import { connectTestDb, clearTestDb, disconnectTestDb } from "./mongoTestDb";

beforeAll(async () => {
  await connectTestDb();
});

afterEach(async () => {
  await clearTestDb();
});

afterAll(async () => {
  await disconnectTestDb();
});
