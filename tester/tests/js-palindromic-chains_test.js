Math.palindromicChain = undefined;
// /*/ // ⚡
export const tests = [];
const t = f => tests.push(f);

// Test cases for palindromicChain
t(({ eq }) => eq(palindromicChain([87, 12, 123]), [4884, 33, 444])); // Given example
t(({ eq }) => eq(palindromicChain([0, 11, 22]), [0, 11, 22])); // Already palindromes
t(({ eq }) => eq(palindromicChain([89]), [8813200023188])); // Known large palindrome
t(({ eq }) => eq(palindromicChain([101]), [101])); // Already a palindrome
t(({ eq }) => eq(palindromicChain([23]), [55])); // 23 + 32 = 55
t(({ eq }) => eq(palindromicChain([196]), [0])); // 196 does not form a palindrome within 100 tries

Object.freeze(tests);
