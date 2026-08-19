export async function withRetry<T>(
  fn: () => Promise<T>,
  options: {
    isRetryable: (err: unknown) => boolean;
    maxRetries?: number;
    baseDelayMs?: number;
  }
): Promise<T> {
  const { isRetryable, maxRetries = 3, baseDelayMs = 500 } = options;

  let attempt = 0;
  while (true) {
    try {
      return await fn();
    } catch (err) {
      attempt += 1;
      if (attempt > maxRetries || !isRetryable(err)) {
        throw err;
      }
      const delay = baseDelayMs * 2 ** (attempt - 1);
      await sleep(delay);
    }
  }
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}