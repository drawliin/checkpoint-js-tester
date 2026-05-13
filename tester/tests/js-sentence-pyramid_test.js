Math.sentencePyramid = undefined;
// /*/ // ⚡
export const tests = [];
const t = f => tests.push(f);

// Test cases for sentencePyramid
t(() => {
    const sentence = "This is a test";
    const expectedOutput = "This\nThis is\nThis is a\nThis is a test";
    let result = "";
    const originalLog = console.log;
    console.log = output => result += output + "\n";
    sentencePyramid(sentence);
    console.log = originalLog;
    return result.trim() === expectedOutput;
});

t(() => {
    const sentence = "A single line";
    const expectedOutput = "A\nA single\nA single line";
    let result = "";
    const originalLog = console.log;
    console.log = output => result += output + "\n";
    sentencePyramid(sentence);
    console.log = originalLog;
    return result.trim() === expectedOutput;
});

t(() => {
    const sentence = "    Double    Word    ";
    const expectedOutput = "Double\nDouble Word";
    let result = "";
    const originalLog = console.log;
    console.log = output => result += output + "\n";
    sentencePyramid(sentence);
    console.log = originalLog;
    return result.trim() === expectedOutput;
});

t(() => {
    const sentence = "One";
    const expectedOutput = "One";
    let result = "";
    const originalLog = console.log;
    console.log = output => result += output + "\n";
    sentencePyramid(sentence);
    console.log = originalLog;
    return result.trim() === expectedOutput;
});

t(() => {
    const sentence = "   One   ";
    const expectedOutput = "One";
    let result = "";
    const originalLog = console.log;
    console.log = output => result += output + "\n";
    sentencePyramid(sentence);
    console.log = originalLog;
    return result.trim() === expectedOutput;
});

t(() => {
    const sentence = "";
    const expectedOutput = "";
    let result = "";
    const originalLog = console.log;
    console.log = output => result += output + "\n";
    sentencePyramid(sentence);
    console.log = originalLog;
    return result.trim() === expectedOutput;
});

Object.freeze(tests);
