async function examGrader(timeout, exercises) {
    let note = 0;
    const start = Date.now();

    for (let exercise of exercises) {
        const obj = await exercise();
        const elapsed = Date.now() - start;

        if (elapsed >= timeout) {
            break;
        }

        note += obj.note;
    }

    return note;
}