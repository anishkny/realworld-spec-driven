import { describe, it, afterEach } from "node:test";
import assert from "assert";
import Ajv from "ajv";

const PORT = process.env.PORT || 3000;
const BASE_URL = `http://localhost:${PORT}`;
const ajv = new Ajv({ allErrors: true });

// ------------------------------------------------------------
// Test Suite for API Endpoints in accordance with SPEC.md
// ------------------------------------------------------------

// Generate test data
const username1 = `user1-${Math.random().toString(36).slice(2)}`;
const user1 = {
  username: username1,
  password: "password123",
  email: `${username1}@example.com`,
};

describe("Health Check", () => {
  it("should be healthy - GET /", async () => {
    const res = await fetch(`${BASE_URL}/`);
    assert.strictEqual(res.status, 200);
  });
});

describe("User", () => {
  it("should register user - POST /api/users", async () => {
    const res = await fetch(`${BASE_URL}/api/users`, {
      method: "POST",
      body: JSON.stringify({ user: user1 }),
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.user.username, username1);
    validateSchema(data, getSchemas().user);
  });

  it("should return 422 on invalid user registration - POST /api/users", async () => {
    const res = await fetch(`${BASE_URL}/api/users`, {
      method: "POST",
      body: JSON.stringify({
        user: { username: "someuser", password: "password" },
      }),
    });
    assert.strictEqual(res.status, 422);
    const data = await res.json();
    assert.deepEqual(data.errors, {
      "/user": ["must have required property 'email'"],
    });
  });

  it("should login user - POST /api/users/login", async () => {
    const res = await fetch(`${BASE_URL}/api/users/login`, {
      method: "POST",
      body: JSON.stringify({
        user: { email: user1.email, password: user1.password },
      }),
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.user.username, username1);
    validateSchema(data, getSchemas().user);
  });

  it("should return 401 on unknown user login - POST /api/users/login", async () => {
    const res = await fetch(`${BASE_URL}/api/users/login`, {
      method: "POST",
      body: JSON.stringify({
        user: { email: "invalid@example.com", password: "wrongpassword" },
      }),
    });
    assert.strictEqual(res.status, 401);
  });
});

// ------------------------------------------------------------
// Helpers
// ------------------------------------------------------------

// Bail on first failure
afterEach((t) => {
  if (!t.passed) {
    console.error(
      `Bailing because test failed: [${t.name}], with error: ${t.error}`,
    );
    process.exit(1);
  }
});

function validateSchema(data, schema) {
  const validate = ajv.compile(schema);
  const valid = validate(data);
  if (!valid) {
    console.error(validate.errors);
  }
  assert.ok(valid, "Response does not match schema");
}

function getSchemas() {
  return {
    user: {
      type: "object",
      properties: {
        user: {
          type: "object",
          properties: {
            email: {
              type: "string",
            },
            token: {
              type: "string",
            },
            username: {
              type: "string",
            },
            bio: {
              type: ["string", "null"],
            },
            image: {
              type: ["string", "null"],
            },
          },
          additionalProperties: false,
          required: ["email", "token", "username"],
        },
      },
      additionalProperties: false,
      required: ["user"],
    },
  };
}
