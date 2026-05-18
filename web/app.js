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
const submissionList = document.querySelector("#submission-list");
const submissionCount = document.querySelector("#submission-count");
const subjectStatus = document.querySelector("#subject-status");
const subjectBody = document.querySelector("#subject-body");
const subjectLink = document.querySelector("#subject-link");

const STORAGE_KEY = "checkpoint-passing-submissions";
const SUBJECTS_BASE_URL = "https://github.com/01-edu/public/tree/master/subjects";
const RAW_SUBJECTS_BASE_URL =
  "https://raw.githubusercontent.com/01-edu/public/master/subjects";

const EXERCISE_LEVELS = [
  {
    level: 1,
    difficulty: 2,
    exerciseIds: [
      "js-factorial",
      "js-fibonacci",
      "js-even-sum",
      "js-perfect-num",
      "js-divisor-finder",
    ],
  },
  {
    level: 2,
    difficulty: 4,
    exerciseIds: [
      "js-array-chunk-reversal",
      "js-palindromic-chains",
      "js-sentence-pyramid",
      "js-grid-word-finder",
      "js-nested-array-reverser",
    ],
  },
  {
    level: 3,
    difficulty: 6,
    exerciseIds: [
      "js-insertion-sort-analyzer",
      "js-bubble-sort-analyzer",
      "js-snakepath-validator",
      "js-grid-word-finder2",
    ],
  },
  {
    level: 4,
    difficulty: 8,
    exerciseIds: [
      "js-object-lab",
      "js-election-mix",
      "js-flat-object",
      "js-pipeline",
    ],
  },
  {
    level: 5,
    difficulty: 10,
    exerciseIds: [
      "js-sleep-breaker",
      "js-final-attempt",
      "js-exam-grader",
      "js-zoo-race",
    ],
  },
  {
    level: 6,
    difficulty: 12,
    exerciseIds: [
      "js-deep-clone",
      "js-deep-equal",
      "js-deep-find",
      "js-deep-freeze",
    ],
  },
  {
    level: 7,
    difficulty: 14,
    exerciseIds: [
      "js-flatten-object",
      "js-swappable-object",
      "js-transform-keys",
      "js-trap-object",
    ],
  },
];

const LEVEL_EXERCISE_IDS = new Set(
  EXERCISE_LEVELS.flatMap((level) => level.exerciseIds),
);

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

const renderInlineMarkdown = (value) =>
  escapeHtml(value)
    .replaceAll(/`([^`]+)`/g, "<code>$1</code>")
    .replaceAll(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replaceAll(/\*([^*]+)\*/g, "<em>$1</em>")
    .replaceAll(
      /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g,
      '<a href="$2" target="_blank" rel="noreferrer">$1</a>',
    );

const renderSubjectMarkdown = (markdown) => {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const html = [];
  let inCodeBlock = false;
  let codeLines = [];
  let listItems = [];
  let paragraphLines = [];

  const flushParagraph = () => {
    if (paragraphLines.length === 0) {
      return;
    }

    html.push(`<p>${renderInlineMarkdown(paragraphLines.join(" "))}</p>`);
    paragraphLines = [];
  };

  const flushList = () => {
    if (listItems.length === 0) {
      return;
    }

    html.push(`<ul>${listItems.map((item) => `<li>${item}</li>`).join("")}</ul>`);
    listItems = [];
  };

  for (const line of lines) {
    if (line.trim().startsWith("```")) {
      flushParagraph();
      flushList();

      if (inCodeBlock) {
        html.push(`<pre><code>${escapeHtml(codeLines.join("\n"))}</code></pre>`);
        codeLines = [];
      }

      inCodeBlock = !inCodeBlock;
      continue;
    }

    if (inCodeBlock) {
      codeLines.push(line);
      continue;
    }

    const heading = line.match(/^(#{1,4})\s+(.+)$/);
    if (heading) {
      flushParagraph();
      flushList();
      const level = Math.min(heading[1].length + 1, 5);
      html.push(`<h${level}>${renderInlineMarkdown(heading[2])}</h${level}>`);
      continue;
    }

    const listItem = line.match(/^\s*[-*]\s+(.+)$/);
    if (listItem) {
      flushParagraph();
      listItems.push(renderInlineMarkdown(listItem[1]));
      continue;
    }

    if (line.trim() === "") {
      flushParagraph();
      flushList();
      continue;
    }

    flushList();
    paragraphLines.push(line.trim());
  }

  flushParagraph();
  flushList();

  if (inCodeBlock && codeLines.length > 0) {
    html.push(`<pre><code>${escapeHtml(codeLines.join("\n"))}</code></pre>`);
  }

  return html.join("");
};

const getSubjectSlugs = (exerciseId) => {
  const withoutLanguagePrefix = exerciseId.replace(/^js-/, "");
  return [...new Set([withoutLanguagePrefix, exerciseId])];
};

const fetchSubjectReadme = async (exerciseId) => {
  for (const slug of getSubjectSlugs(exerciseId)) {
    const response = await fetch(`${RAW_SUBJECTS_BASE_URL}/${slug}/README.md`);
    if (response.ok) {
      return {
        markdown: await response.text(),
        slug,
      };
    }
  }

  throw Error("Subject README not found.");
};

const loadSubject = async (exercise) => {
  const fallbackSlug = getSubjectSlugs(exercise.id)[0];
  const requestId = exercise.id;

  subjectStatus.textContent = `Loading ${exercise.label} subject...`;
  subjectLink.href = `${SUBJECTS_BASE_URL}/${fallbackSlug}`;
  subjectBody.innerHTML = '<div class="empty-state">Loading subject from 01 Edu...</div>';

  try {
    const { markdown, slug } = await fetchSubjectReadme(exercise.id);
    if (state.currentExerciseId !== requestId) {
      return;
    }

    subjectStatus.textContent = ``;
    subjectLink.href = `${SUBJECTS_BASE_URL}/${slug}`;
    subjectBody.innerHTML = renderSubjectMarkdown(markdown);
  } catch (error) {
    if (state.currentExerciseId !== requestId) {
      return;
    }

    subjectStatus.textContent = "Subject unavailable";
    subjectBody.innerHTML = `
      <div class="empty-state">
        ${escapeHtml(error instanceof Error ? error.message : String(error))}
        Open the 01 Edu subjects repository to check the exercise manually.
      </div>
    `;
  }
};

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

const renderExerciseCard = (exercise) => `
  <a class="exercise-card" href="#/exercise/${escapeHtml(exercise.id)}">
    <span class="exercise-card-language">${escapeHtml(
      formatLanguage(exercise.language),
    )}</span>
    <span class="exercise-card-title">${escapeHtml(exercise.id)}</span>
    <span class="exercise-card-meta">${escapeHtml(exercise.label)}</span>
  </a>
`;

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

  if (state.selectedLanguage !== "javascript") {
    exerciseList.innerHTML = visibleExercises.map(renderExerciseCard).join("");
    return;
  }

  const exerciseMap = new Map(visibleExercises.map((exercise) => [exercise.id, exercise]));
  const renderedExerciseIds = new Set();

  const levelSections = EXERCISE_LEVELS.map((level) => {
    const levelExercises = level.exerciseIds
      .map((exerciseId) => exerciseMap.get(exerciseId))
      .filter(Boolean);

    if (levelExercises.length === 0) {
      return "";
    }

    levelExercises.forEach((exercise) => renderedExerciseIds.add(exercise.id));

    return `
      <section class="level-section">
        <div class="level-header">
          <div>
            <h2>Level ${level.level}</h2>
          </div>
        </div>
        <div class="level-grid">
          ${levelExercises.map(renderExerciseCard).join("")}
        </div>
      </section>
    `;
  }).join("");

  const otherExercises = visibleExercises.filter(
    (exercise) =>
      !renderedExerciseIds.has(exercise.id) && !LEVEL_EXERCISE_IDS.has(exercise.id),
  );

  const otherSection =
    otherExercises.length > 0
      ? `
        <section class="level-section">
          <div class="level-header">
            <div>
              <h2>Other exercises</h2>
              <p>${otherExercises.length} exercises</p>
            </div>
          </div>
          <div class="level-grid">
            ${otherExercises.map(renderExerciseCard).join("")}
          </div>
        </section>
      `
      : "";

  exerciseList.innerHTML = `
    <div class="level-list-heading">
      <p class="eyebrow">Exercises by Level</p>
      <h2>Exercises by Level</h2>
    </div>
    ${levelSections}
    ${otherSection}
  `;
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
  problemMeta.textContent = ``;
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
  loadSubject(exercise);
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
