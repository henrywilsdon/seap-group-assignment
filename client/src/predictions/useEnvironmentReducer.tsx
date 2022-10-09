import { Dispatch, useCallback, useState } from 'react';

export interface EnvironmentInputState {
    windDirection: string;
    windSpeed: string;
    airDensity: string;
}

export type EnvironmentAction =
    | { type: 'setWindDirection'; windDirection: string }
    | { type: 'setWindSpeed'; windSpeed: string }
    | { type: 'setAirDensity'; airDensity: string }
    | { type: 'clear' };

const createEmptyEnvironment = (): EnvironmentInputState => ({
    windDirection: '',
    windSpeed: '',
    airDensity: '',
});

export default function useEnvironmentReducer(): {
    environment: EnvironmentInputState;
    environmentDispatch: Dispatch<EnvironmentAction>;
} {
    // Environment that can be tweaked
    const [environment, setEnvironment] = useState(createEmptyEnvironment);

    // We have to use the useCallback hook so that this function is not recreated
    // on each render causing all components it is passed too to also be re-rendered
    // for no good reason(React things...)
    const environmentDispatch = useCallback(
        (action: EnvironmentAction) => {
            if (action.type === 'setWindDirection') {
                setEnvironment((prevEnvironmentState) => ({
                    ...prevEnvironmentState,
                    windDirection: action.windDirection,
                }));
            } else if (action.type === 'setWindSpeed') {
                setEnvironment((prevEnvironmentState) => ({
                    ...prevEnvironmentState,
                    windSpeed: action.windSpeed,
                }));
            } else if (action.type === 'setAirDensity') {
                setEnvironment((prevEnvironmentState) => ({
                    ...prevEnvironmentState,
                    airDensity: action.airDensity,
                }));
            } else if (action.type === 'clear') {
                setEnvironment(createEmptyEnvironment());
            } else {
                throw new Error('Unknown action');
            }
        },
        [environment],
    );

    return {
        environment,
        environmentDispatch,
    };
}
