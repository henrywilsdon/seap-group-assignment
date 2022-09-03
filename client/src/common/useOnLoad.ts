import React, { useEffect, useRef } from 'react';

/**
 * Run a function once when the component is first mounted.
 * @param func Function to run.
 */
export default function useOnLoad(func: React.EffectCallback): void {
    const hasRun = useRef(false);

    useEffect(() => {
        if (!hasRun.current) {
            hasRun.current = true;
            return func();
        }
    }, [func]);
}
