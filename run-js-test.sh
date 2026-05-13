#!/usr/bin/env sh
set -eu

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
RUNNER_DIR="$SCRIPT_DIR/tester"

usage() {
  cat <<'EOF'
Usage:
  ./run-js-test.sh <exercise|exercise.js|path/to/file.js> [solution_dir] [expected_files]

Examples:
  ./run-js-test.sh js-factorial
  ./run-js-test.sh js-factorial.js .
  ./run-js-test.sh factorial.js
  ./run-js-test.sh ./solutions/factorial.js
  ./run-js-test.sh js-object-lab /path/to/solution object-lab.js

Notes:
  - The first argument accepts an exercise name, `js-*.js`, or a real file path.
  - If you pass a file like `factorial.js`, the script infers:
    exercise = `js-factorial`, solution_dir = file's directory, expected_files = file's basename.
  - `solution_dir` still defaults to the current directory when you pass only an exercise name.
  - `expected_files` defaults to the inferred basename or to the exercise name without `js-`, plus `.js`.
  - You can override `expected_files` with a comma-separated list if an exercise needs it.
EOF
}

[ "${1-}" = "" ] && {
  usage
  exit 1
}

case "${1-}" in
  -h|--help)
    usage
    exit 0
    ;;
esac

exercise_input=$1

case "$exercise_input" in
  */*|*\\*)
    inferred_path=$exercise_input
    inferred_basename=$(basename -- "$inferred_path")
    inferred_name=${inferred_basename%.js}
    solution_dir=${2:-$(dirname -- "$inferred_path")}
    expected_files=${3:-$inferred_basename}
    case "$inferred_name" in
      js-*)
        normalized_exercise=$inferred_name
        ;;
      *)
        normalized_exercise="js-$inferred_name"
        ;;
    esac
    ;;
  *.js)
    inferred_basename=$(basename -- "$exercise_input")
    inferred_name=${inferred_basename%.js}
    solution_dir=${2:-.}
    expected_files=${3:-$inferred_basename}
    case "$inferred_name" in
      js-*)
        normalized_exercise=$inferred_name
        ;;
      *)
        normalized_exercise="js-$inferred_name"
        ;;
    esac
    ;;
  *)
    solution_dir=${2:-.}
    normalized_exercise=$exercise_input
    expected_files=${3:-"${exercise_input#js-}.js"}
    ;;
esac

normalized_exercise=${normalized_exercise%.js}

if [ ! -d "$solution_dir" ]; then
  echo "Solution directory not found: $solution_dir" >&2
  exit 1
fi

resolved_solution_dir=$(CDPATH= cd -- "$solution_dir" && pwd)
test_file="$RUNNER_DIR/tests/${normalized_exercise}_test.js"

if [ ! -f "$test_file" ]; then
  echo "Official extracted test not found for: $normalized_exercise" >&2
  exit 1
fi

cd "$RUNNER_DIR"
node test.mjs "$resolved_solution_dir" "$normalized_exercise" "$expected_files"
