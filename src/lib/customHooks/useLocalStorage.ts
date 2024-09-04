import { useState } from "react";
/**
 * This hook creates a local storage variable and also helps in updating it.
 * @param keyName name of the key to to add or update
 * @param defaultValue default value of the stored key
 */
const useLocalStorage = <S>(keyName: string, defaultValue: S): [S, (newValue: S) => void] => {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const value = window.localStorage.getItem(keyName);
            if (value) {
                return JSON.parse(value);
            } else {
                window.localStorage.setItem(keyName, JSON.stringify(defaultValue));
                return defaultValue;
            }
        } catch (err) {
            return defaultValue;
        }
    });
    /**
     * helps update the default value or current value of the stored key in local storage.
     * @param newValue new value fo the stored key
     */
    const setValue = (newValue: S) => {
        try {
            window.localStorage.setItem(keyName, JSON.stringify(newValue));
        } catch (err) { }
        setStoredValue(newValue);
    };
    return [storedValue, setValue];
}

export default useLocalStorage