import { withRetry } from "../src/lib/retry.js";

class FakeHttpError extends Error {
  constructor(public status: number) {
    super(`HTTP ${status}`);
  }
}

async function testRetriesOn429ThenSucceeds() {
  let calls = 0;
  const start = Date.now();

  const result = await withRetry(
    async () => {
      calls += 1;
      if (calls < 3) throw new FakeHttpError(429); // fail twice, then succeed
      return "ok";
    },
    {
      isRetryable: (err) => err instanceof FakeHttpError && err.status === 429,
      baseDelayMs: 50, // small delay for a fast test
    }
  );

  const elapsed = Date.now() - start;

  return [
    ["eventually succeeds", result === "ok"],
    ["called exactly 3 times (2 failures + 1 success)", calls === 3],
    ["actually waited between retries (>= 50+100ms)", elapsed >= 150],
  ] as const;
}

async function testDoesNotRetryNonRetryableError() {
  let calls = 0;

  let threw = false;
  try {
    await withRetry(
      async () => {
        calls += 1;
        throw new FakeHttpError(400); // bad request — should NOT retry
      },
      {
        isRetryable: (err) => err instanceof FakeHttpError && err.status === 429,
        baseDelayMs: 50,
      }
    );
  } catch {
    threw = true;
  }

  return [
    ["threw immediately", threw],
    ["called exactly once (no retries on 400)", calls === 1],
  ] as const;
}

async function testGivesUpAfterMaxRetries() {
  let calls = 0;
  let threw = false;
  try {
    await withRetry(
      async () => {
        calls += 1;
        throw new FakeHttpError(429); // always fails
      },
      {
        isRetryable: (err) => err instanceof FakeHttpError && err.status === 429,
        baseDelayMs: 10,
        maxRetries: 2,
      }
    );
  } catch {
    threw = true;
  }

  return [
    ["eventually throws after exhausting retries", threw],
    ["called exactly 3 times (1 initial + 2 retries)", calls === 3],
  ] as const;
}

async function main() {
  const results = [
    ...(await testRetriesOn429ThenSucceeds()),
    ...(await testDoesNotRetryNonRetryableError()),
    ...(await testGivesUpAfterMaxRetries()),
  ];

  let allPassed = true;
  for (const [label, passed] of results) {
    console.log(passed ? `✅ ${label}` : `❌ ${label}`);
    if (!passed) allPassed = false;
  }
  process.exit(allPassed ? 0 : 1);
}

main();