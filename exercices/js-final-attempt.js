function FinalAttempt(callback, count) {
    return async function (...args) {
        for (let i = 0; i <= count; i++) {
            try {
                return await callback(...args)
            } catch (err) {
                if (i === count) {
                    return "Final Attempt Fail";
                }
            }
        }
    }
}
