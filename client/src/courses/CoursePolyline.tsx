import React, { useRef } from 'react';
import { GpsPoint } from './useMapState';

type Props = {
    points: GpsPoint[];
    splits: number[];
    hoverSegment: number | null;
    map?: google.maps.Map;
};

/**
 * Adds polyline to map.
 */
export default function CoursePolyline({
    points,
    splits,
    hoverSegment,
    map,
}: Props) {
    const segmentPaths = useRef<google.maps.Polyline[] | []>([]);

    React.useEffect(() => {
        if (!map) return;

        segmentPaths.current.forEach((segment) => segment.setMap(null));
        segmentPaths.current = [];

        let prevSplitEndPoint = 0;
        segmentPaths.current = [...splits, points.length - 1].map(
            (splitEndPoint) => {
                const path = new google.maps.Polyline({
                    path: points.slice(prevSplitEndPoint, splitEndPoint),
                    geodesic: true,
                    strokeColor: '#00aeff',
                    strokeWeight: 4,
                });
                path.setMap(map);
                prevSplitEndPoint = splitEndPoint;
                return path;
            },
        );

        // Remove from map on unmount
        return () => {
            segmentPaths.current.forEach((segment) => segment.setMap(null));
        };
    }, [map, points, splits]);

    React.useEffect(() => {
        if (!map) return;

        segmentPaths.current.forEach((path, segment) => {
            if (segment === hoverSegment) {
                path.set('strokeColor', '#000000');
                path.set('strokeWeight', 5);
                path.set('zIndex', google.maps.Marker.MAX_ZINDEX);
            } else {
                path.set('strokeColor', '#00aeff');
                path.set('strokeWeight', 4);
                path.set('zIndex', 0);
            }
        });
    }, [map, hoverSegment]);

    return null;
}
