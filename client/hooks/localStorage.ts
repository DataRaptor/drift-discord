// I want our application to be like magic eden.
// In the sense that user's see the signature verification first
// Then they will see the discord oAuth. 
// Putting the "small" popup window first then the "large" one second seems like 
// a better strategy than the opposite.

// The con in this is that we will need to have some local storage on the page to 
// keep track of the signature (since it comes first)

// We invoke copy pasta for this nice hook from here:
// https://usehooks.com/useLocalStorage/

// Storing signatures in local storage is fine because it's not sensitive...

import { useState, useEffect } from "react"


export const useLocalStorage = (key: string, defaultValue: Uint8Array) => {
  const [value, setValue] = useState(() => {
    let currentValue;

    try {
      currentValue = JSON.parse(
        localStorage.getItem(key) || String(defaultValue)
      );
    } catch (error) {
      currentValue = defaultValue;
    }

    return currentValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value, key]);

  return [value, setValue];
};

export default useLocalStorage;