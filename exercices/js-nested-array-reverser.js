function nestedArrayReverser(words) {
    if (!words.length) {
        return "";
    }
    words.reverse();
    for (let i = 0; i < words.length; i++) {
        words[i].reverse();
    }
    words = words.flat()
    return words.join(" ");
}
