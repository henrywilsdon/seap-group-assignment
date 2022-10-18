import { Dispatch, useCallback, useState } from 'react';

export interface MechanicalInputState {
    crrValue: string;
    mechEfficiency: string;
    molWhlFront: string;
    molWhlRear: string;
    wheelRadius: string;
}

export type MechanicalAction =
    | { type: 'setCrr'; crrValue: string }
    | { type: 'setMechEfficiency'; mechEfficiency: string }
    | { type: 'setMolWhlFront'; molWhlFront: string }
    | { type: 'setMolWhlRear'; molWhlRear: string }
    | { type: 'setWheelRadius'; wheelRadius: string }
    | { type: 'clear' };

const createEmptyMechanical = (): MechanicalInputState => ({
    crrValue: '',
    mechEfficiency: '',
    molWhlFront: '',
    molWhlRear: '',
    wheelRadius: '',
});

export default function useMechanicalReducer(): {
    mechanical: MechanicalInputState;
    mechanicalDispatch: Dispatch<MechanicalAction>;
} {
    // Mechanical that can be tweaked
    const [mechanical, setMechanical] = useState(createEmptyMechanical);

    // We have to use the useCallback hook so that this function is not recreated
    // on each render causing all components it is passed too to also be re-rendered
    // for no good reason(React things...)
    const mechanicalDispatch = useCallback((action: MechanicalAction) => {
        if (action.type === 'setCrr') {
            setMechanical((prevMechanicalState) => ({
                ...prevMechanicalState,
                crrValue: action.crrValue,
            }));
        } else if (action.type === 'setMechEfficiency') {
            setMechanical((prevMechanicalState) => ({
                ...prevMechanicalState,
                mechEfficiency: action.mechEfficiency,
            }));
        } else if (action.type === 'setMolWhlFront') {
            setMechanical((prevMechanicalState) => ({
                ...prevMechanicalState,
                molWhlFront: action.molWhlFront,
            }));
        } else if (action.type === 'setMolWhlRear') {
            setMechanical((prevMechanicalState) => ({
                ...prevMechanicalState,
                molWhlRear: action.molWhlRear,
            }));
        } else if (action.type === 'setWheelRadius') {
            setMechanical((prevMechanicalState) => ({
                ...prevMechanicalState,
                wheelRadius: action.wheelRadius,
            }));
        } else if (action.type === 'clear') {
            setMechanical(createEmptyMechanical());
        } else {
            throw new Error('Unknown action');
        }
    }, []);

    return {
        mechanical,
        mechanicalDispatch,
    };
}
