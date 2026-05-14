const languageSelect = document.querySelector("#language");
const exerciseSelect = document.querySelector("#exercise");
const editor = document.querySelector("#editor");
const lineNumbers = document.querySelector("#line-numbers");
const runButton = document.querySelector("#run");
const resetButton = document.querySelector("#reset");
const output = document.querySelector("#output");
const resultStatus = document.querySelector("#result-status");
const resultBadge = document.querySelector("#result-badge");
const fileLabel = document.querySelector("#file-label");

const state = {
  catalog: null,
  currentExercise: null,
};

const renderLineNumbers = () => {
  const totalLines = editor.value.split("\n").length;
  lineNumbers.textContent = Array.from(
    { length: Math.max(totalLines, 1) },
    (_, index) => String(index + 1),
  ).join("\n");
};

const syncScroll = () => {
  lineNumbers.scrollTop = editor.scrollTop;
};

const setResult = ({ badgeText, badgeClass, statusText, bodyText }) => {
  resultBadge.className = `badge ${badgeClass}`;
  resultBadge.textContent = badgeText;
  resultStatus.textContent = statusText;
  output.textContent = bodyText;
};

const getExerciseById = (exerciseId) =>
  state.catalog.exercises.find((exercise) => exercise.id === exerciseId);

const loadExercise = (exerciseId) => {
  const exercise = getExerciseById(exerciseId);
  if (!exercise) {
    return;
  }

  state.currentExercise = exercise;
  exerciseSelect.value = exercise.id;
  fileLabel.textContent = exercise.filename;
  editor.value = exercise.starterCode;
  renderLineNumbers();
  syncScroll();
  setResult({
    badgeText: "Idle",
    badgeClass: "neutral",
    statusText: `${exercise.label} is ready to test`,
    bodyText: "Edit the code, then click Test.",
  });
};

const populateCatalog = (catalog) => {
  state.catalog = catalog;

  languageSelect.innerHTML = catalog.languages
    .map(
      (language) =>
        `<option value="${language.id}">${language.label} ${
          language.status === "active" ? "" : "(coming soon)"
        }</option>`,
    )
    .join("");

  exerciseSelect.innerHTML = catalog.exercises
    .map(
      (exercise) =>
        `<option value="${exercise.id}">${exercise.label}</option>`,
    )
    .join("");

  loadExercise(catalog.exercises[0]?.id);
};

const fetchCatalog = async () => {
  const response = await fetch("/api/catalog");
  if (!response.ok) {
    throw Error("Unable to load exercise catalog");
  }

  return response.json();
};

const runTests = async () => {
  if (!state.currentExercise) {
    return;
  }

  runButton.disabled = true;
  resetButton.disabled = true;

  setResult({
    badgeText: "Running",
    badgeClass: "neutral",
    statusText: `Testing ${state.currentExercise.label}...`,
    bodyText: "Running the local harness...",
  });

  try {
    const response = await fetch("/api/run", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        language: "javascript",
        exerciseId: state.currentExercise.id,
        code: editor.value,
      }),
    });

    const result = await response.json();
    if (!response.ok) {
      throw Error(result.error || "Test run failed");
    }

    if (result.ok) {
      setResult({
        badgeText: "Pass",
        badgeClass: "success",
        statusText: `${state.currentExercise.label} passed`,
        bodyText: result.output || "No output returned.",
      });
    } else {
      setResult({
        badgeText: "Fail",
        badgeClass: "error",
        statusText: `${state.currentExercise.label} failed`,
        bodyText: result.error || result.output || "Test run failed.",
      });
    }
  } catch (error) {
    setResult({
      badgeText: "Error",
      badgeClass: "error",
      statusText: `Unable to test ${state.currentExercise.label}`,
      bodyText: error instanceof Error ? error.message : String(error),
    });
  } finally {
    runButton.disabled = false;
    resetButton.disabled = false;
  }
};

editor.addEventListener("input", renderLineNumbers);
editor.addEventListener("scroll", syncScroll);
exerciseSelect.addEventListener("change", (event) => {
  loadExercise(event.target.value);
});
runButton.addEventListener("click", runTests);
resetButton.addEventListener("click", () => {
  if (state.currentExercise) {
    loadExercise(state.currentExercise.id);
  }
});

fetchCatalog()
  .then(populateCatalog)
  .catch((error) => {
    setResult({
      badgeText: "Error",
      badgeClass: "error",
      statusText: "Catalog failed to load",
      bodyText: error instanceof Error ? error.message : String(error),
    });
  });
