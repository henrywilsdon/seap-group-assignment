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

/**
 * Server Athlete model
 */
type BackendAthlete = {
    id?: number;
    name: string;
    rider_mass: number;
    bike_mass: number;
    other_mass: number;
    total_mass: number;
    CP_FTP: number;
    W_prime: number;
};

export function getAthletes(): Promise<AthleteData[]> {
    return fetch('http://localhost:8000/api/athlete/', {
        method: 'GET',
        credentials: 'include',
    }).then(async (response) => {
        if (response.ok) {
            const athletes: BackendAthlete[] = (await response.json()).athletes;
            return athletes.map<AthleteData>(backendAthleteToFrontend);
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
    const backendAthlete = frontendAthleteToBackend(athleteData);
    return fetch('http://localhost:8000/api/athlete/' + athleteId + '/', {
        method: 'PUT',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(backendAthlete),
    }).then(async (response) => {
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
    const backendAthlete = frontendAthleteToBackend(athleteData);
    return fetch('http://localhost:8000/api/athlete/', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(backendAthlete),
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

function frontendAthleteToBackend(
    frontendAthlete: AthleteData,
): BackendAthlete {
    return {
        id: frontendAthlete.id,
        name: frontendAthlete.fullName,
        rider_mass: frontendAthlete.riderMass,
        bike_mass: frontendAthlete.bikeMass,
        other_mass: frontendAthlete.otherMass,
        total_mass:
            frontendAthlete.riderMass +
            frontendAthlete.bikeMass +
            frontendAthlete.otherMass,
        CP_FTP: frontendAthlete.cp,
        W_prime: frontendAthlete.wPrime,
    };
}

function backendAthleteToFrontend(backendAthlete: BackendAthlete): AthleteData {
    return {
        id: backendAthlete.id,
        fullName: backendAthlete.name,
        riderMass: backendAthlete.rider_mass,
        bikeMass: backendAthlete.bike_mass,
        otherMass: backendAthlete.other_mass,
        cp: backendAthlete.CP_FTP,
        wPrime: backendAthlete.W_prime,
    };
}
