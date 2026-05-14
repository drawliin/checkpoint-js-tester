import { readdir, readFile } from "node:fs/promises";
import { basename, join } from "node:path";

const ROOT_DIR = new URL(".", import.meta.url);
const TESTS_DIR = new URL("./tester/tests/", ROOT_DIR);

const humanizeExercise = (id) =>
  id
    .replace(/^js-/, "")
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const buildStarterCode = (exerciseId) => {
  const basenameWithoutPrefix = exerciseId.replace(/^js-/, "");

  if (basenameWithoutPrefix === "factorial") {
    return `function factorial(n) {
  if (n === 0) {
    return 1;
  }

  let result = 1;

  for (let i = 1; i <= n; i++) {
    result *= i;
  }

  return result;
}
`;
  }

  return `// Write your JavaScript solution here.
`;
};

const readExistingSolution = async (exerciseId) => {
  const filename = `${exerciseId}.js`;
  try {
    return await readFile(new URL(`./${filename}`, ROOT_DIR), "utf8");
  } catch {
    return buildStarterCode(exerciseId);
  }
};

export const getExerciseCatalog = async () => {
  const entries = await readdir(TESTS_DIR, { withFileTypes: true });

  const exerciseIds = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith("_test.js"))
    .map((entry) => basename(entry.name, "_test.js"))
    .filter((id) => id.startsWith("js-"))
    .sort();

  const exercises = await Promise.all(
    exerciseIds.map(async (id) => ({
      id,
      label: humanizeExercise(id),
      language: "javascript",
      filename: `${id}.js`,
      starterCode: await readExistingSolution(id),
    })),
  );

  return {
    languages: [
      {
        id: "javascript",
        label: "JavaScript",
        extension: ".js",
        status: "active",
      },
    ],
    exercises,
  };
};
