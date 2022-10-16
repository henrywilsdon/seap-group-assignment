import { CourseData } from './ManageCoursesPage';

const BACK_END_URL = 'http://localhost:8000/api/course/';

export type BackendCourse = {
    id?: number;
    name?: string;
    location?: string;
    last_updated?: string;
    gps_geo_json?: any;
};

/**
 * Convert course data from the back-end
 * @param backendCourse
 * @returns
 */
function backendCourseToFrontend(backendCourse: BackendCourse): CourseData {
    const course: CourseData = {};
    course.id = backendCourse.id;
    course.name = backendCourse.name;
    course.location = backendCourse.location;

    if (backendCourse.last_updated) {
        course.last_updated = new Date(backendCourse.last_updated);
    }
    if (backendCourse.gps_geo_json) {
        course.gps_data = backendCourse.gps_geo_json;
    }
    return course;
}

/**
 * Convert course data to the back-end format
 * @param backendCourse
 * @returns
 */
function backendCourseFromFrontend(course: CourseData): BackendCourse {
    const backendCourse: BackendCourse = {};
    backendCourse.name = course.name;
    backendCourse.location = course.location;
    backendCourse.last_updated = new Date().toISOString();

    // Hard-code the GPS data by now
    backendCourse.gps_geo_json = {
        latitude: [],
        longitude: [],
        elevation: [],
        horizontal_distance_to_last_point: [],
        bearing_from_last_point: [],
    };
    return backendCourse;
}
/**
 * Get all courses from the back-end
 */
export function getCourses(): Promise<CourseData[]> {
    return fetch(BACK_END_URL, {
        method: 'GET',
        credentials: 'include',
    }).then(async (response) => {
        if (response.ok) {
            const courses: BackendCourse[] = (await response.json())[
                'All Courses:'
            ];
            return courses.map<CourseData>(backendCourseToFrontend);
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

/**
 * Create a new course in the back-end
 */
export function createCourse(course: CourseData): Promise<void> {
    return fetch(BACK_END_URL, {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify(backendCourseFromFrontend(course)),
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
 * Update a course to the back-end
 */
export function updateCourse(courseId: any, course: CourseData): Promise<void> {
    return fetch(`${BACK_END_URL}${courseId}/`, {
        method: 'PUT',
        credentials: 'include',
        body: JSON.stringify(backendCourseFromFrontend(course)),
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
 * Delete a course from the back-end
 */
export function deleteCourse(courseId: any): Promise<void> {
    return fetch(`${BACK_END_URL}${courseId}/`, {
        method: 'DELETE',
        credentials: 'include',
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
