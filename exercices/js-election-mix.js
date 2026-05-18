function createCurriedFilterAndMap(criteria, mapper) {
    return function (obj) {
        let keysKept = 0;
        let keysFilteredOut = 0;
        let final = {};
        
        for (const [key, value] of Object.entries(obj)) {
            if (criteria(key, value)) {
                keysKept++;
                final[key] = mapper(value)
            } else {
                keysFilteredOut++;
            }
        }


        return {
            filteredObject: final,
            keysKept,
            keysFilteredOut
        }
    }
}