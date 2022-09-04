/**
 * Input data for an athlete
 */
export type AthleteData = {
    /** Identifying each athlete */
    id?: number;
    /** Athlete's name */
    fullName: string;
    /** Rider's mass, in kg */
    riderMass: number;
    /** Bike's mass, in kg */
    bikeMass: number;
    /** Other mass, in kg */
    otherMass: number;
    /** CP (or FTP), in W */
    cp: number;
    /** W', in J */
    wPrime: number;
};

export function getAthletes(): Promise<AthleteData[]> {
    return fetch('http://localhost:8000/server_functions/athlete/', {
        method: 'GET',
        credentials: 'include',
    }).then(async (response) => {
        if (response.ok) {
            return (await response.json()).athletes;
        } else {
            if (response.headers.get('Content-Type') === 'application/json') {
                const data = await response.json();
                throw new Error(data?.detail);
            } else {
                throw new Error(response.statusText + response.status);
            }
        }
    });
}

export function updateAthlete(
    athleteId: number,
    athleteData: Omit<AthleteData, 'id'>,
): Promise<any> {
    return fetch(
        'http://localhost:8000/server_functions/athlete/' + athleteId,
        {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                fullName: athleteData.fullName,
                riderMass: athleteData.riderMass,
                bikeMass: athleteData.bikeMass,
                otherMass: athleteData.otherMass,
                cp: athleteData.cp,
                wPrime: athleteData.wPrime,
            }),
        },
    ).then(async (response) => {
        if (!response.ok) {
            if (response.headers.get('Content-Type') === 'application/json') {
                const data = await response.json();
                throw new Error(data?.detail);
            } else {
                throw new Error(response.statusText + response.status);
            }
        }
    });
}

/**
 * Create a new athlete
 * @param athleteData
 * @returns ID for the athlete
 */
export function createAthlete(
    athleteData: Omit<AthleteData, 'id'>,
): Promise<number> {
    return fetch('http://localhost:8000/server_functions/athlete/', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            fullName: athleteData.fullName,
            riderMass: athleteData.riderMass,
            bikeMass: athleteData.bikeMass,
            otherMass: athleteData.otherMass,
            cp: athleteData.cp,
            wPrime: athleteData.wPrime,
        }),
    }).then(async (response) => {
        if (response.ok) {
            return (await response.json()).athlete_id;
        } else {
            if (response.headers.get('Content-Type') === 'application/json') {
                const data = await response.json();
                throw new Error(data?.detail);
            } else {
                throw new Error(response.statusText + response.status);
            }
        }
    });
}
