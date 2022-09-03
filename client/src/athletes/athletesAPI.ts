/**
 * Input data for an athlete
 */
export type AthleteData = {
    /** Identifying each athlete */
    id: number;
    /** Athlete's name */
    name: string;
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
    return fetch('/server_functions/athlete', {
        method: 'GET',
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
