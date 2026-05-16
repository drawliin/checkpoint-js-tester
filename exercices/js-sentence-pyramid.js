function sentencePyramid(sentence) {
    const words = sentence.trim().split(/\s+/).filter(Boolean);
    let i = 1;

    while (i <= words.length) {
        console.log(words.slice(0, i).join(" "));
        i++
    }
}

