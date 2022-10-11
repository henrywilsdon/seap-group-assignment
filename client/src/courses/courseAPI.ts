import { GpsPoint } from './useMapState';

type CourseGps = [
    //
    [number, number, number, number],
];

interface BackendCourseGPS {
    lat: number[];
    long: number[];
    ele: number[];
    distance: number[];
    bearing: number[];
    slope: number[];
}

export default function parseGpx(gpx: string): GpsPoint[] {
    const backendCourse: BackendCourseGPS = {
        lat: [],
        long: [],
        ele: [],
        distance: [],
        bearing: [],
        slope: [],
    };

    const gpsPoints: GpsPoint[] = [];
    for (let i = 0; i < backendCourse.lat.length; i++) {
        gpsPoints.push({
            idx: i,
            lat: backendCourse.lat[i],
            lng: backendCourse.long[i],
            elev: backendCourse.ele[i],
            distance: backendCourse.distance[i],
            segment: 0,
        });
    }

    return gpsPoints;
}
