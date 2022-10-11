export interface BackendCourseGPS {
    lat: number[];
    lon: number[];
    ele: number[];
    distance: number[];
}

export function parseGpx(gpxFile: File): Promise<BackendCourseGPS> {
    const form = new FormData();
    form.append('attachment', gpxFile);

    return fetch('http://localhost:8000/api/upload/', {
        method: 'POST',
        credentials: 'include',
        body: form,
    }).then(async (response) => {
        if (response.ok) {
            const responseObj: { detail: string } & BackendCourseGPS =
                await response.json();

            return {
                lat: responseObj.lat.map((v) => Number(v)),
                lon: responseObj.lon.map((v) => Number(v)),
                ele: responseObj.ele.map((v) => Number(v)),
                distance: responseObj.distance.map((v) => Number(v)),
            };
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
