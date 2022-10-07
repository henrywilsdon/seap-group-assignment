import { Dispatch, useCallback, useState } from 'react';

// Store numbers as string so they work with inputs correctly. Convert to number
// when they need to be used for calculations.
export interface AthleteInputState {
    id: number;
    fullName: string;
    riderMass: string;
    bikeMass: string;
    otherMass: string;
    totalMass: string;
    cp: string;
    wPrime: string;
}

export type AthleteAction =
    // Set athlete and original athlete to given athlete
    | { type: 'setAthlete'; athlete: AthleteInputState }
    // Individual field setters for tweaking athlete. These will only modify
    // athlete, not originalAthlete.
    | { type: 'setFullName'; fullName: string }
    | { type: 'setRiderMass'; riderMass: string }
    | { type: 'setBikeMass'; bikeMass: string }
    | { type: 'setOtherMass'; otherMass: string }
    | { type: 'setCP'; cp: string }
    | { type: 'setWPrime'; wPrime: string }
    // reset athlete to original state(eg. state from backend)
    | { type: 'reset' }
    // set athlete and originalAthlete to all empty fields
    | { type: 'clear' };

const createEmptyAthlete = (): AthleteInputState => ({
    id: -1,
    fullName: '',
    riderMass: '',
    bikeMass: '',
    otherMass: '',
    totalMass: '',
    cp: '',
    wPrime: '',
});

const sumStringNumbers = (...strs: string[]): string => {
    let sum = 0;
    strs.forEach((s) => (sum += Number(s)));
    return String(sum);
};

export default function useAthleteReducer(): {
    athlete: AthleteInputState;
    originalAthlete: AthleteInputState;
    athleteDispatch: Dispatch<AthleteAction>;
} {
    // Athlete that can be tweaked
    const [athlete, setAthlete] = useState(createEmptyAthlete);

    // Athlete from the backend. This will not be changed/tweaked so it can be
    // used to reset the tweaked athlete.
    const [originalAthlete, setOriginalAthlete] = useState(createEmptyAthlete);

    // We have to use the useCallback hook so that this function is not recreated
    // on each render causing all components it is passed too to also be re-rendered
    // for no good reason(React things...)
    const athleteDispatch = useCallback(
        (action: AthleteAction) => {
            if (action.type === 'setAthlete') {
                setAthlete({ ...action.athlete });
                setOriginalAthlete({ ...action.athlete });
            } else if (action.type === 'setFullName') {
                setAthlete((prevAthleteState) => ({
                    ...prevAthleteState,
                    fullName: action.fullName,
                }));
            } else if (action.type === 'setRiderMass') {
                setAthlete((prevAthleteState) => ({
                    ...prevAthleteState,
                    riderMass: action.riderMass,
                    totalMass: sumStringNumbers(
                        action.riderMass,
                        prevAthleteState.bikeMass,
                        prevAthleteState.otherMass,
                    ),
                }));
            } else if (action.type === 'setBikeMass') {
                setAthlete((prevAthleteState) => ({
                    ...prevAthleteState,
                    bikeMass: action.bikeMass,
                    totalMass: sumStringNumbers(
                        prevAthleteState.riderMass,
                        action.bikeMass,
                        prevAthleteState.otherMass,
                    ),
                }));
            } else if (action.type === 'setOtherMass') {
                setAthlete((prevAthleteState) => ({
                    ...prevAthleteState,
                    otherMass: action.otherMass,
                    totalMass: sumStringNumbers(
                        prevAthleteState.riderMass,
                        prevAthleteState.bikeMass,
                        action.otherMass,
                    ),
                }));
            } else if (action.type === 'setCP') {
                setAthlete((prevAthleteState) => ({
                    ...prevAthleteState,
                    cp: action.cp,
                }));
            } else if (action.type === 'setWPrime') {
                setAthlete((prevAthleteState) => ({
                    ...prevAthleteState,
                    wPrime: action.wPrime,
                }));
            } else if (action.type === 'reset') {
                setAthlete({ ...originalAthlete });
            } else if (action.type === 'clear') {
                setAthlete(createEmptyAthlete());
                setOriginalAthlete(createEmptyAthlete());
            } else {
                throw new Error('Unknown action');
            }
        },
        [originalAthlete],
    );

    return {
        originalAthlete,
        athlete,
        athleteDispatch,
    };
}
