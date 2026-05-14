# 01-edu JS Local Tester

Run extracted official tests locally for these JS exercises:

- `js-factorial`
- `js-fibonacci`
- `js-even-sum`
- `js-perfect-num`
- `js-divisor-finder`
- `js-array-chunk-reversal`
- `js-palindromic-chains`
- `js-sentence-pyramid`
- `js-grid-word-finder`
- `js-nested-array-reverser`
- `js-insertion-sort-analyzer`
- `js-bubble-sort-analyzer`
- `js-snakepath-validator`
- `js-grid-word-finder2`
- `js-object-lab`
- `js-election-mix`
- `js-flat-object`
- `js-pipeline`
- `js-sleep-breaker`
- `js-final-attempt`
- `js-exam-grader`
- `js-zoo-race`
- `js-deep-clone`
- `js-deep-equal`
- `js-deep-find`
- `js-deep-freeze`
- `js-flatten-object`
- `js-swappable-object`
- `js-transform-keys`
- `js-trap-object`

The project now also includes a small web UI that uses the same local test
harness. You can edit code in the browser, click `Test`, and see the harness
output directly in the page.

## Install

Requirements:

- Node.js
- `sh` shell

Install dependencies:

```sh
cd tester
npm install
cd ..
```

The web server itself uses only Node's built-in modules, so there is no extra
root dependency install step.

## Run

Use only the shell script plus the exercise file:

```sh
./run-js-test.sh exercice.js
```

Examples:

```sh
./run-js-test.sh factorial.js
./run-js-test.sh js-factorial.js
./run-js-test.sh ./solutions/factorial.js
```

What the script infers:

- `factorial.js` -> runs the `js-factorial` test
- `js-factorial.js` -> runs the `js-factorial` test

If needed, the script still accepts optional extra arguments:

```sh
./run-js-test.sh js-factorial
./run-js-test.sh js-factorial /path/to/solutions factorial.js
```

## Notes

- The harness and test files were extracted from the public image `ghcr.io/01-edu/module-js`.
- `tester/test.mjs` includes a small Windows path fix so the harness also works outside Linux containers.

## Web Version

Start the web server from the project root:

```sh
npm run start:web
```

Then open:

```txt
http://localhost:3000
```

Current web support:

- JavaScript only
- exercise picker based on `tester/tests`
- browser editor with starter code loading
- `Test` button that runs the same Node harness and shows output in the page

The structure is intentionally split so more languages can be added later
through the shared exercise catalog and the run endpoint.
