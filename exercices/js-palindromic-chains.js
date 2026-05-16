function palindromicChain(numbers) {
    let res = [];
    for (let num of numbers) {
        if (isPalindrome(num)) {
            res.push(num);
            continue;
        }

        for (let attempt = 0; attempt < 100; attempt++) {
            num += reverseNum(num);
            if (isPalindrome(num)) {
                res.push(num);
                break
            }
            if (attempt == 99) {
                res.push(0);
            }
        }
    }

    return res
}

function isPalindrome(num) {
    num = String(num);
    let i = 0, j = num.length - 1;
    while (i < j) {
        if (num[i] !== num[j]) {
            return false;
        }
        i++;
        j--;
    }
    return true
}

function reverseNum(num) {
    let arr = String(num).split("").reverse();
    return Number(arr.join(""));
}