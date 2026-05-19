function sleepBreaker(delay, breaker) {
    return Promise.race(
        [
            new Promise(resolve => setTimeout(resolve, delay)),

            breaker()
        ]
    )
}
