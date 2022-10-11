import tokyo from './tokyo2.json';

export interface BackendCourseGPS {
    lat: number[];
    long: number[];
    ele: number[];
    distance: number[];
    bearing: number[];
    slope: number[];
}

export default function parseGpx(gpx: string): BackendCourseGPS {
    const backendCourse: BackendCourseGPS = tokyo;

    return backendCourse;
}
