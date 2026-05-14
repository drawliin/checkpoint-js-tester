const languageFilters = document.querySelector("#language-filters");
const exerciseSearch = document.querySelector("#exercise-search");
const exerciseList = document.querySelector("#exercise-list");
const exerciseCount = document.querySelector("#exercise-count");
const editor = document.querySelector("#editor");
const lineNumbers = document.querySelector("#line-numbers");
const runButton = document.querySelector("#run");
const resetButton = document.querySelector("#reset");
const output = document.querySelector("#output");
const resultStatus = document.querySelector("#result-status");
const resultBadge = document.querySelector("#result-badge");
const fileLabel = document.querySelector("#file-label");
const problemTitle = document.querySelector("#problem-title");
const problemMeta = document.querySelector("#problem-meta");
const problemLanguage = document.querySelector("#problem-language");
const editorBadge = document.querySelector("#editor-badge");
const submissionList = document.querySelector("#submission-list");
const submissionCount = document.querySelector("#submission-count");

const STORAGE_KEY = "checkpoint-passing-submissions";

const state = {
  catalog: null,
  currentExerciseId: null,
  selectedLanguage: "javascript",
  searchTerm: "",
};

const formatLanguage = (languageId) =>
  languageId.charAt(0).toUpperCase() + languageId.slice(1);

const formatDate = (isoString) => {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) {
    return "Unknown date";
  }

  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const readStoredSubmissions = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    return typeof parsed === "object" && parsed ? parsed : {};
  } catch {
    return {};
  }
};

const normalizeSubmission = (submission, exerciseMap) => {
  const exercise = exerciseMap.get(submission.exerciseId);
  return {
    exerciseId: submission.exerciseId,
    exerciseLabel:
      submission.exerciseLabel ||
      exercise?.label ||
      submission.exerciseId ||
      "Saved submission",
    language:
      submission.language ||
      exercise?.language ||
      "javascript",
    code: submission.code || "",
    output: submission.output || "",
    savedAt: submission.savedAt || new Date(0).toISOString(),
  };
};

const savePassingSubmission = ({ exerciseId, exerciseLabel, language, code, output: resultOutput }) => {
  const submissions = readStoredSubmissions();
  const history = Array.isArray(submissions[exerciseId]) ? submissions[exerciseId] : [];

  history.unshift({
    code,
    output: resultOutput,
    exerciseId,
    exerciseLabel,
    language,
    savedAt: new Date().toISOString(),
  });

  submissions[exerciseId] = history.slice(0, 10);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions));
};

const getAllSubmissions = () =>
  Object.values(readStoredSubmissions())
    .flat()
    .map((submission) =>
      normalizeSubmission(
        submission,
        new Map((state.catalog?.exercises || []).map((exercise) => [exercise.id, exercise])),
      ),
    )
    .sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt));

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
  const regex = /^.+ passed \(\d+ tests\)$/;
  let cssClass = regex.test(bodyText) ? "passed": "failed";
  output.className = "output";
  output.classList.add(cssClass);
};

const getExerciseById = (exerciseId) =>
  state.catalog?.exercises.find((exercise) => exercise.id === exerciseId);

const getVisibleExercises = () => {
  if (!state.catalog) {
    return [];
  }

  const normalizedSearch = state.searchTerm.trim().toLowerCase();

  return state.catalog.exercises.filter((exercise) => {
    const matchesLanguage = exercise.language === state.selectedLanguage;
    const matchesSearch =
      normalizedSearch === "" ||
      exercise.label.toLowerCase().includes(normalizedSearch) ||
      exercise.id.toLowerCase().includes(normalizedSearch);

    return matchesLanguage && matchesSearch;
  });
};

const renderLanguageFilters = () => {
  if (!state.catalog) {
    return;
  }

  languageFilters.innerHTML = state.catalog.languages
    .map((language) => {
      const isActive = language.id === state.selectedLanguage;
      const classes = [
        "filter-chip",
        isActive ? "active" : "",
        language.status !== "active" ? "muted" : "",
      ]
        .filter(Boolean)
        .join(" ");

      return `
        <button
          type="button"
          class="${classes}"
          data-language-id="${language.id}"
        >
          ${language.label}
        </button>
      `;
    })
    .join("");
};

const renderExerciseList = () => {
  const visibleExercises = getVisibleExercises();
  exerciseCount.textContent = String(visibleExercises.length);

  if (visibleExercises.length === 0) {
    exerciseList.innerHTML =
      state.selectedLanguage === "javascript"
        ? `<div class="empty-state">No exercises match the current search.</div>`
        : `<div class="empty-state">${formatLanguage(
            state.selectedLanguage,
          )} exercises are not loaded yet.</div>`;
    return;
  }

  exerciseList.innerHTML = visibleExercises
    .map((exercise) => {
      const isActive = exercise.id === state.currentExerciseId;
      return `
        <button
          type="button"
          class="exercise-item ${isActive ? "active" : ""}"
          data-exercise-id="${exercise.id}"
        >
          <span class="exercise-item-name">${exercise.label}</span>
        </button>
      `;
    })
    .join("");
};

const renderSubmissions = () => {
  const submissions = getAllSubmissions();
  submissionCount.textContent = String(submissions.length);

  if (submissions.length === 0) {
    submissionList.innerHTML =
      '<div class="empty-state">Passing submissions will appear here after successful test runs.</div>';
    return;
  }

  submissionList.innerHTML = submissions
    .map(
      (submission, index) => `
        <button
          type="button"
          class="submission-item"
          data-submission-index="${index}"
        >
          <span class="submission-item-title">${submission.exerciseLabel}</span>
          <span class="submission-item-meta">${formatLanguage(submission.language)} • ${formatDate(
            submission.savedAt,
          )}</span>
        </button>
      `,
    )
    .join("");
};

const loadExercise = (exerciseId) => {
  const exercise = getExerciseById(exerciseId);
  if (!exercise) {
    return;
  }

  state.currentExerciseId = exercise.id;
  state.selectedLanguage = exercise.language;
  fileLabel.textContent = exercise.filename;
  problemTitle.textContent = exercise.label;
  problemLanguage.textContent = formatLanguage(exercise.language);
  problemMeta.textContent = `${exercise.functionName}(${exercise.parameterNames.join(", ")})`;
  editorBadge.textContent = formatLanguage(exercise.language);
  editor.value = exercise.starterCode;
  renderLineNumbers();
  syncScroll();
  setResult({
    badgeText: "Idle",
    badgeClass: "neutral",
    statusText: `${exercise.label} is ready to test`,
    bodyText: "Edit the code, then click Test.",
  });
  renderLanguageFilters();
  renderExerciseList();
};

const loadSubmission = (submissionIndex) => {
  const submissions = getAllSubmissions();
  const submission = submissions[submissionIndex];
  if (!submission) {
    return;
  }

  const exercise = getExerciseById(submission.exerciseId);
  if (exercise) {
    state.currentExerciseId = exercise.id;
    state.selectedLanguage = exercise.language;
    problemTitle.textContent = exercise.label;
    problemLanguage.textContent = formatLanguage(exercise.language);
    problemMeta.textContent = `${exercise.functionName}(${exercise.parameterNames.join(", ")})`;
    fileLabel.textContent = exercise.filename;
    editorBadge.textContent = formatLanguage(exercise.language);
  }

  editor.value = submission.code;
  renderLineNumbers();
  syncScroll();
  setResult({
    badgeText: "Saved",
    badgeClass: "neutral",
    statusText: `${submission.exerciseLabel} accepted on ${formatDate(submission.savedAt)}`,
    bodyText: submission.output || "No saved output.",
  });
  renderLanguageFilters();
  renderExerciseList();
};

const populateCatalog = (catalog) => {
  state.catalog = catalog;
  renderLanguageFilters();
  renderSubmissions();

  const firstJavascriptExercise = catalog.exercises.find(
    (exercise) => exercise.language === "javascript",
  );
  loadExercise(firstJavascriptExercise?.id || catalog.exercises[0]?.id);
};

const fetchCatalog = async () => {
  const response = await fetch("/api/catalog");
  if (!response.ok) {
    throw Error("Unable to load exercise catalog");
  }

  return response.json();
};

const runTests = async () => {
  const exercise = getExerciseById(state.currentExerciseId);
  if (!exercise) {
    return;
  }

  runButton.disabled = true;
  resetButton.disabled = true;

  setResult({
    badgeText: "Running",
    badgeClass: "neutral",
    statusText: `Testing ${exercise.label}...`,
    bodyText: "Running the local harness...",
  });

  try {
    const response = await fetch("/api/run", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        language: exercise.language,
        exerciseId: exercise.id,
        code: editor.value,
      }),
    });

    const result = await response.json();
    if (!response.ok) {
      throw Error(result.error || "Test run failed");
    }

    if (result.ok) {
      savePassingSubmission({
        exerciseId: exercise.id,
        exerciseLabel: exercise.label,
        language: exercise.language,
        code: editor.value,
        output: result.output || "",
      });
      renderSubmissions();
      setResult({
        badgeText: "Pass",
        badgeClass: "success",
        statusText: `${exercise.label} passed`,
        bodyText: result.output || "No output returned.",
      });
    } else {
      setResult({
        badgeText: "Fail",
        badgeClass: "error",
        statusText: `${exercise.label} failed`,
        bodyText: result.error || result.output || "Test run failed.",
      });
    }
  } catch (error) {
    setResult({
      badgeText: "Error",
      badgeClass: "error",
      statusText: `Unable to test ${exercise.label}`,
      bodyText: error instanceof Error ? error.message : String(error),
    });
  } finally {
    runButton.disabled = false;
    resetButton.disabled = false;
  }
};

editor.addEventListener("input", renderLineNumbers);
editor.addEventListener("scroll", syncScroll);
exerciseSearch.addEventListener("input", (event) => {
  state.searchTerm = event.target.value;
  renderExerciseList();
});

languageFilters.addEventListener("click", (event) => {
  const button = event.target.closest("[data-language-id]");
  if (!button) {
    return;
  }

  state.selectedLanguage = button.dataset.languageId;
  renderLanguageFilters();
  renderExerciseList();

  const visibleExercises = getVisibleExercises();
  if (visibleExercises.length > 0) {
    loadExercise(visibleExercises[0].id);
  } else {
    state.currentExerciseId = null;
    problemTitle.textContent = `${formatLanguage(state.selectedLanguage)} Module`;
    problemLanguage.textContent = formatLanguage(state.selectedLanguage);
    problemMeta.textContent = "No exercise selected";
    fileLabel.textContent = `${state.selectedLanguage}.txt`;
    editorBadge.textContent = formatLanguage(state.selectedLanguage);
    editor.value = "";
    renderLineNumbers();
    syncScroll();
    setResult({
      badgeText: "Idle",
      badgeClass: "neutral",
      statusText: `${formatLanguage(state.selectedLanguage)} module is empty`,
      bodyText: "Switch back to a loaded module or wait for more exercises.",
    });
  }
});

exerciseList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-exercise-id]");
  if (!button) {
    return;
  }

  loadExercise(button.dataset.exerciseId);
});

submissionList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-submission-index]");
  if (!button) {
    return;
  }

  loadSubmission(Number(button.dataset.submissionIndex));
});

runButton.addEventListener("click", runTests);
resetButton.addEventListener("click", () => {
  if (state.currentExerciseId) {
    loadExercise(state.currentExerciseId);
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
