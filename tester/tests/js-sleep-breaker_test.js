Math.sleepBreaker = undefined;
// /*/ // ⚡
export const tests = [];
const t = (f) => tests.push(f);

t(async ({ eq }) => {
  const breaker = async () => {
    await new Promise((res) => setTimeout(res, 100));
    return true;
  };
  const start = Date.now();
  await sleepBreaker(500, breaker);
  const duration = Date.now() - start;
  return duration < 200; // Should resolve quickly due to breaker
});

t(async ({ eq }) => {
  const breaker = async () => {
    await new Promise((res) => setTimeout(res, 1000));
    return true;
  };
  const start = Date.now();
  await sleepBreaker(500, breaker);
  const duration = Date.now() - start;
  return duration >= 500; // Should resolve after the delay
});

t(async ({ eq }) => {
  const breaker = async () => { await new Promise((res) => {}) }; // Breaker never resolves
  const start = Date.now();
  await sleepBreaker(300, breaker);
  const duration = Date.now() - start;
  return duration >= 300; // Should resolve after the delay
});

Object.freeze(tests);
