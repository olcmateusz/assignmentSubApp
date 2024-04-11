import { useEffect, useState } from "react"

function useLocalState(defaultValue, key){
    const [value, setValue] = useState(() => {
        const  functionValue = localStorage.getItem(key);
        return functionValue !== null ? JSON.parse(functionValue) : defaultValue;
    });

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(value))
    }, [key, value]);

    return [value, setValue];
}

export{useLocalState}