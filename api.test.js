import assert from "assert";
import { describe, it, afterEach } from "node:test";

const PORT = process.env.PORT || 3000;
const BASE_URL = `http://localhost:${PORT}`;
const API_URL = `${BASE_URL}/api`

// Bail on first failure
afterEach((t) => {
  if (!t.passed) {
    console.error(`Bailing because test failed: [${t.name}], with error: ${t.error}`);
    process.exit(1);
  }
});

describe('Health Check', () => {
});
