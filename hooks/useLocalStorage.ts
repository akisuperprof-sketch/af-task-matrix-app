import { useState, useEffect, Dispatch, SetStateAction } from 'react';

// Fix: To resolve the "Cannot find namespace 'React'" error, this hook has been updated to directly import `Dispatch` and `SetStateAction` types from 'react'.
// The return type annotation now uses these imported types. The unconventional trailing comma in the generic `<T,>` has also been removed for clarity.
function useLocalStorage<T>(key: string, initialValue: T): [T, Dispatch<SetStateAction<T>>] {
    const [storedValue, setStoredValue] = useState<T>(() => {
        if (typeof window === 'undefined') {
            return initialValue;
        }
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(error);
            return initialValue;
        }
    });

    useEffect(() => {
        try {
            const valueToStore =
                typeof storedValue === 'function'
                    ? storedValue(storedValue)
                    : storedValue;
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.error(error);
        }
    }, [key, storedValue]);

    return [storedValue, setStoredValue];
}

export default useLocalStorage;
