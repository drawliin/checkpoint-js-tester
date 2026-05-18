import ace from "https://esm.sh/ace-builds@1.36.5/src-noconflict/ace";
import "https://esm.sh/ace-builds@1.36.5/src-noconflict/mode-javascript";
import "https://esm.sh/ace-builds@1.36.5/src-noconflict/theme-monokai";
import "https://esm.sh/ace-builds@1.36.5/src-noconflict/ext-language_tools";

const exerciseView = document.querySelector("#exercise-view");
const editorViewPanel = document.querySelector("#editor-view");
const languageFilters = document.querySelector("#language-filters");
const exerciseSearch = document.querySelector("#exercise-search");
const exerciseList = document.querySelector("#exercise-list");
const exerciseCount = document.querySelector("#exercise-count");
const editorMount = document.querySelector("#editor");
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

let codeEditor = null;

const layoutEditor = () => {
  if (!codeEditor || editorViewPanel.hidden) {
    return;
  }

  codeEditor.resize(true);
};

export const initializeEditor = () => {
  if (codeEditor) {
    return codeEditor;
  }

  codeEditor = ace.edit(editorMount, {
    mode: "ace/mode/javascript",
    theme: "ace/theme/monokai",
    fontSize: 14,
    fontFamily: 'Consolas, "Courier New", monospace',
    tabSize: 2,
    useSoftTabs: true,
    wrap: false,
    showPrintMargin: false,
    highlightActiveLine: true,
    highlightSelectedWord: true,
    animatedScroll: true,
    scrollPastEnd: 0.12,
    cursorStyle: "slim",
    behavioursEnabled: true,
    enableBasicAutocompletion: true,
    enableLiveAutocompletion: true,
    enableSnippets: true,
    fixedWidthGutter: true,
  });

  codeEditor.session.setUseWorker(false);
  codeEditor.session.setNewLineMode("unix");
  codeEditor.renderer.setScrollMargin(12, 18, 0, 0);
  codeEditor.renderer.setPadding(12);
  codeEditor.renderer.setShowGutter(true);
  codeEditor.setOption("mergeUndoDeltas", "always");

  new ResizeObserver(layoutEditor).observe(editorMount);

  return codeEditor;
};

const state = {
  catalog: null,
  currentExerciseId: null,
  selectedLanguage: "javascript",
  searchTerm: "",
};

const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const formatLanguage = (languageId) =>
  state.catalog?.languages.find((language) => language.id === languageId)?.label ||
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

const setEditorCode = (code) => {
  const editor = initializeEditor();
  editor.setValue(code, -1);
  editor.clearSelection();
  editor.moveCursorTo(0, 0);
  editor.renderer.scrollToX(0);
  editor.renderer.scrollToY(0);
  layoutEditor();
};

const getEditorCode = () => initializeEditor().getValue();

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
    language: submission.language || exercise?.language || "javascript",
    code: submission.code || "",
    output: submission.output || "",
    savedAt: submission.savedAt || new Date(0).toISOString(),
  };
};

const savePassingSubmission = ({
  exerciseId,
  exerciseLabel,
  language,
  code,
  output: resultOutput,
}) => {
  const submissions = readStoredSubmissions();
  const history = Array.isArray(submissions[exerciseId])
    ? submissions[exerciseId]
    : [];

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
        new Map(
          (state.catalog?.exercises || []).map((exercise) => [
            exercise.id,
            exercise,
          ]),
        ),
      ),
    )
    .sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt));

const getCurrentExerciseSubmissions = () => {
  if (!state.currentExerciseId) {
    return [];
  }

  return getAllSubmissions().filter(
    (submission) => submission.exerciseId === state.currentExerciseId,
  );
};

const setResult = ({ badgeText, badgeClass, statusText, bodyText }) => {
  resultBadge.className = `badge ${badgeClass}`;
  resultBadge.textContent = badgeText;
  resultStatus.textContent = statusText;
  output.textContent = bodyText;

  const passed = /^.+ passed \(\d+ tests\)$/.test(bodyText);
  output.className = "output";
  if (passed) {
    output.classList.add("passed");
  } else if (badgeClass === "error") {
    output.classList.add("failed");
  }
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
      exercise.id.toLowerCase().includes(normalizedSearch) ||
      exercise.functionName.toLowerCase().includes(normalizedSearch);

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
          data-language-id="${escapeHtml(language.id)}"
        >
          ${escapeHtml(language.label)}
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
        ? '<div class="empty-state">No exercises match the current search.</div>'
        : `<div class="empty-state">${escapeHtml(
            formatLanguage(state.selectedLanguage),
          )} exercises are not loaded yet.</div>`;
    return;
  }

  exerciseList.innerHTML = visibleExercises
    .map(
      (exercise) => `
        <a class="exercise-card" href="#/exercise/${escapeHtml(exercise.id)}">
          <span class="exercise-card-language">${escapeHtml(
            formatLanguage(exercise.language),
          )}</span>
          <span class="exercise-card-title">${escapeHtml(exercise.label)}</span>
          <span class="exercise-card-meta">${escapeHtml(
            `${exercise.functionName}(${exercise.parameterNames.join(", ")})`,
          )}</span>
        </a>
      `,
    )
    .join("");
};

const renderSubmissions = () => {
  const submissions = getCurrentExerciseSubmissions();
  submissionCount.textContent = String(submissions.length);

  const exercise = getExerciseById(state.currentExerciseId);

  if (submissions.length === 0) {
    submissionList.innerHTML = exercise
      ? `<div class="empty-state">No accepted submissions saved yet for ${escapeHtml(
          exercise.label,
        )}.</div>`
      : '<div class="empty-state">Select an exercise to see its accepted submissions.</div>';
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
          <span class="submission-item-title">${escapeHtml(
            submission.exerciseLabel,
          )}</span>
          <span class="submission-item-meta">${escapeHtml(
            `${formatLanguage(submission.language)} - ${formatDate(
              submission.savedAt,
            )}`,
          )}</span>
        </button>
      `,
    )
    .join("");
};

const showCatalogView = () => {
  exerciseView.hidden = false;
  editorViewPanel.hidden = true;
  document.title = "Checkpoint Web Tester";
};

const showEditorView = (exercise) => {
  exerciseView.hidden = true;
  editorViewPanel.hidden = false;
  document.title = `${exercise.label} - Checkpoint Web Tester`;

  requestAnimationFrame(() => {
    const editor = initializeEditor();
    layoutEditor();
    editor.focus();
  });
};

const loadExercise = (exerciseId) => {
  const exercise = getExerciseById(exerciseId);
  if (!exercise) {
    showCatalogView();
    return;
  }

  state.currentExerciseId = exercise.id;
  state.selectedLanguage = exercise.language;
  fileLabel.textContent = exercise.filename;
  problemTitle.textContent = exercise.label;
  problemLanguage.textContent = formatLanguage(exercise.language);
  problemMeta.textContent = `${exercise.functionName}(${exercise.parameterNames.join(
    ", ",
  )})`;
  editorBadge.textContent = formatLanguage(exercise.language);
  setResult({
    badgeText: "Idle",
    badgeClass: "neutral",
    statusText: `${exercise.label} is ready to test`,
    bodyText: "Edit the code, then click Test.",
  });
  renderLanguageFilters();
  renderExerciseList();
  renderSubmissions();
  showEditorView(exercise);
  setEditorCode(exercise.starterCode);
};

const loadSubmission = (submissionIndex) => {
  const submissions = getCurrentExerciseSubmissions();
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
    problemMeta.textContent = `${exercise.functionName}(${exercise.parameterNames.join(
      ", ",
    )})`;
    fileLabel.textContent = exercise.filename;
    editorBadge.textContent = formatLanguage(exercise.language);
  }

  setEditorCode(submission.code);
  setResult({
    badgeText: "Saved",
    badgeClass: "neutral",
    statusText: `${submission.exerciseLabel} accepted on ${formatDate(
      submission.savedAt,
    )}`,
    bodyText: submission.output || "No saved output.",
  });
  renderLanguageFilters();
  renderExerciseList();
  renderSubmissions();
};

const renderRoute = () => {
  if (!state.catalog) {
    return;
  }

  const match = window.location.hash.match(/^#\/exercise\/([^/]+)$/);
  if (match) {
    loadExercise(decodeURIComponent(match[1]));
    return;
  }

  state.currentExerciseId = null;
  renderLanguageFilters();
  renderExerciseList();
  showCatalogView();
};

const populateCatalog = (catalog) => {
  state.catalog = catalog;
  renderRoute();
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
    const code = getEditorCode();
    const response = await fetch("/api/run", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        language: exercise.language,
        exerciseId: exercise.id,
        code,
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
        code,
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
window.addEventListener("hashchange", renderRoute);

fetchCatalog()
  .then(populateCatalog)
  .catch((error) => {
    showEditorView({ label: "Catalog error" });
    setResult({
      badgeText: "Error",
      badgeClass: "error",
      statusText: "Catalog failed to load",
      bodyText: error instanceof Error ? error.message : String(error),
    });
  });
