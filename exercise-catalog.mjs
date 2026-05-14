import { readdir, readFile } from "node:fs/promises";
import { basename } from "node:path";

const ROOT_DIR = new URL(".", import.meta.url);
const TESTS_DIR = new URL("./tester/tests/", ROOT_DIR);

const humanizeExercise = (id) =>
  id
    .replace(/^js-/, "")
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const fallbackFunctionName = (exerciseId) => {
  const parts = exerciseId.replace(/^js-/, "").split("-");
  return parts
    .map((part, index) =>
      index === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1),
    )
    .join("");
};

const splitTopLevelArgs = (source) => {
  const parts = [];
  let current = "";
  let depthParen = 0;
  let depthBracket = 0;
  let depthBrace = 0;
  let quote = "";

  for (let i = 0; i < source.length; i += 1) {
    const char = source[i];
    const prev = source[i - 1];

    if (quote) {
      current += char;
      if (char === quote && prev !== "\\") {
        quote = "";
      }
      continue;
    }

    if (char === "'" || char === '"' || char === "`") {
      quote = char;
      current += char;
      continue;
    }

    if (char === "(") depthParen += 1;
    if (char === ")") depthParen -= 1;
    if (char === "[") depthBracket += 1;
    if (char === "]") depthBracket -= 1;
    if (char === "{") depthBrace += 1;
    if (char === "}") depthBrace -= 1;

    if (
      char === "," &&
      depthParen === 0 &&
      depthBracket === 0 &&
      depthBrace === 0
    ) {
      parts.push(current.trim());
      current = "";
      continue;
    }

    current += char;
  }

  if (current.trim() !== "") {
    parts.push(current.trim());
  }

  return parts;
};

const classifyArg = (arg) => {
  const value = arg.trim();

  if (/^[A-Za-z_$][\w$]*$/.test(value)) {
    return { kind: "identifier", name: value };
  }

  if (/^['"`]/.test(value)) {
    return { kind: "string" };
  }

  if (/^-?\d+(\.\d+)?$/.test(value)) {
    return { kind: "number" };
  }

  if (/^(true|false)$/.test(value)) {
    return { kind: "boolean" };
  }

  if (value.startsWith("[")) {
    const compact = value.replace(/\s+/g, "");
    if (/^\[(["'`]).*?\1(,|])/.test(compact)) {
      return { kind: "stringArray" };
    }
    if (/^\[\{/.test(compact)) {
      return { kind: "objectArray" };
    }
    if (/^\[\(?[A-Za-z_$][\w$]*\)?=>|^\[function/.test(compact)) {
      return { kind: "functionArray" };
    }
    return { kind: "array" };
  }

  if (value.startsWith("{")) {
    return { kind: "object" };
  }

  if (value.includes("=>") || value.startsWith("function")) {
    return { kind: "function" };
  }

  return { kind: "value" };
};

const placeholderNameForKind = (kind, index, totalArgs) => {
  if (totalArgs === 1) {
    if (kind === "number") return "n";
    if (kind === "string") return "str";
    if (kind === "array") return "arr";
    if (kind === "stringArray") return "words";
    if (kind === "objectArray") return "objects";
    if (kind === "functionArray") return "functions";
    if (kind === "object") return "obj";
    if (kind === "boolean") return "flag";
    if (kind === "function") return "fn";
    return "value";
  }

  if (kind === "number") return index === 0 ? "n" : "num";
  if (kind === "string") return "str";
  if (kind === "array") return "arr";
  if (kind === "stringArray") return "words";
  if (kind === "objectArray") return "objects";
  if (kind === "functionArray") return "functions";
  if (kind === "object") return "obj";
  if (kind === "boolean") return "flag";
  if (kind === "function") return "fn";
  return `arg${index + 1}`;
};

const makeNamesUnique = (names) => {
  const seen = new Map();

  return names.map((name) => {
    const count = seen.get(name) || 0;
    seen.set(name, count + 1);
    return count === 0 ? name : `${name}${count + 1}`;
  });
};

const extractParameterNames = (testSource, functionName) => {
  const pattern = new RegExp(`\\b${functionName}\\s*\\(([^)]*)\\)`, "g");
  const calls = [...testSource.matchAll(pattern)]
    .map((match) => splitTopLevelArgs(match[1]))
    .filter((args) => args.length > 0);

  if (calls.length === 0) {
    return [];
  }

  const maxArgs = Math.max(...calls.map((args) => args.length));

  const names = Array.from({ length: maxArgs }, (_, index) => {
    for (const args of calls) {
      const arg = args[index];
      if (!arg) {
        continue;
      }

      const classified = classifyArg(arg);
      if (classified.kind === "identifier") {
        return classified.name;
      }
    }

    for (const args of calls) {
      const arg = args[index];
      if (!arg) {
        continue;
      }

      const classified = classifyArg(arg);
      return placeholderNameForKind(classified.kind, index, maxArgs);
    }

    return `arg${index + 1}`;
  });

  return makeNamesUnique(names);
};

const extractFunctionName = async (exerciseId) => {
  const testFile = new URL(`./${exerciseId}_test.js`, TESTS_DIR);
  const testSource = await readFile(testFile, "utf8");

  const mathMatch = testSource.match(/Math\.([A-Za-z_$][\w$]*)\s*=\s*undefined/);
  if (mathMatch) {
    return mathMatch[1];
  }

  const callMatch = testSource.match(/\beq\(\s*([A-Za-z_$][\w$]*)\s*\(/);
  if (callMatch) {
    return callMatch[1];
  }

  return fallbackFunctionName(exerciseId);
};

const buildStarterCode = (functionName, parameterNames) => {
  return `function ${functionName}(${parameterNames.join(", ")}) {
}
`;
};

export const getExerciseCatalog = async () => {
  const entries = await readdir(TESTS_DIR, { withFileTypes: true });

  const exerciseIds = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith("_test.js"))
    .map((entry) => basename(entry.name, "_test.js"))
    .filter((id) => id.startsWith("js-"))
    .sort();

  const exercises = await Promise.all(
    exerciseIds.map(async (id) => {
      const testSource = await readFile(new URL(`./${id}_test.js`, TESTS_DIR), "utf8");
      const functionName = await extractFunctionName(id);
      const parameterNames = extractParameterNames(testSource, functionName);
      return {
        functionName,
        parameterNames,
        id,
        label: humanizeExercise(id),
        language: "javascript",
        filename: `${id}.js`,
        starterCode: buildStarterCode(functionName, parameterNames),
      };
    }),
  );

  return {
    languages: [
      {
        id: "javascript",
        label: "JavaScript",
        extension: ".js",
        status: "active",
      },
      {
        id: "go",
        label: "Go",
        extension: ".go",
        status: "coming-soon",
      },
      {
        id: "rust",
        label: "Rust",
        extension: ".rs",
        status: "coming-soon",
      },
      {
        id: "java",
        label: "Java",
        extension: ".java",
        status: "coming-soon",
      },
    ],
    exercises,
  };
};
