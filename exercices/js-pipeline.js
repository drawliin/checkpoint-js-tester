function pipeline(initialValue, functions) {
    let steps = [];
    
    for (let i = 0; i < functions.length; i++) {
        let state = {
            index: i,
            input: initialValue,
        };
        
        initialValue = functions[i](initialValue);
        state["output"] = initialValue;

        steps.push(state);
    }
    return {
        finalValue: initialValue,
        steps
    }
}