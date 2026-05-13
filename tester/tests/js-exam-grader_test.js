Math.examGrader = undefined;
// /*/ // ⚡
export const tests = [];
const t = (f) => tests.push(f);

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

t(async ({ eq }) => {
  const exercises = [
    async() => {await sleep(1000); return Promise.resolve({ note: 15 })},
    async() => {await sleep(2000); return Promise.resolve({ note: 18 })},
    async() => {await sleep(500); return Promise.resolve({ note: 12 })},
  ];
  const result = await examGrader(3000, exercises);
  return eq(result, 15); // Only the first exercise completes within the timeout
});

t(async ({ eq }) => {
  const exercises = [
    async() => {await sleep(1000); return Promise.resolve({ note: 15 })},
    async() => {await sleep(2000); return Promise.resolve({ note: 18 })},
    async() => {await sleep(500); return Promise.resolve({ note: 12 })},
  ];
  const result = await examGrader(4000, exercises);
  return eq(result, 45); // All three exercises complete within the timeout
});

t(async ({ eq }) => {
  const exercises = [
    async() => {await sleep(500); return Promise.resolve({ note: 10 })},
    async() => {await sleep(300); return Promise.resolve({ note: 12 })},
    async() => {await sleep(700); return Promise.resolve({ note: 8 })},
  ];
  const result = await examGrader(1000, exercises);
  return eq(result, 22); // First and second exercises complete within the timeout
});

t(async ({ eq }) => {
  const exercises = [
    async() => {await sleep(1000); return Promise.resolve({ note: 10 })},
    async() => {await sleep(1000); return Promise.resolve({ note: 15 })},
  ];
  const result = await examGrader(2000, exercises);
  return eq(result, 10); // Only the first exercise completes within the timeout
});

t(async ({ eq }) => {
  const exercises = [];
  const result = await examGrader(3000, exercises);
  return eq(result, 0); // No exercises to grade
});

Object.freeze(tests);
