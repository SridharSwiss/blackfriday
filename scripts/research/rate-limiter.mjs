/* Rate limiter: unlimited (requests fire immediately).
   Kept as a class for interface compatibility; acquire() resolves instantly. */
export class RateLimiter {
  constructor(rpm = 0) {
    this.rpm = rpm;
  }

  async acquire() {
    // No rate limiting — fire immediately
  }
}

export const globalLimiter = new RateLimiter(0);
