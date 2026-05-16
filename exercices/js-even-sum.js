function evenSum(nums) {
    if (nums <= 1) {
        return 0
    }
    if (nums % 2 === 0) {
        return nums + evenSum(nums-1)
    }
    return evenSum(nums-1)
}