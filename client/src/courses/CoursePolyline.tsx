/** global google */
import React, { useEffect, useRef } from 'react';
import { GpsPoint, Split } from './useMapState';

type Props = {
    points: GpsPoint[];
    splits: Split[];
    hoverSegment: number | null;
    map?: google.maps.Map;
    bounds?: google.maps.LatLngBoundsLiteral | null;
};

/**
 * Adds polyline to map.
 */
export default function CoursePolyline({
    points,
    splits,
    hoverSegment,
    map,
    bounds,
}: Props) {
    const segmentPaths = useRef<google.maps.Polyline[] | []>([]);
    const prevMap = useRef<google.maps.Map | null>(null);
    const prevBounds = useRef<google.maps.LatLngBoundsLiteral | null>(null);

    useEffect(() => {
        if (!map || !bounds) {
            return;
        }

        // Only run if map just loaded or bounds has changed
        if (!prevMap.current || bounds !== prevBounds.current) {
            console.log(!prevMap.current, bounds !== prevBounds.current);
            map.fitBounds(bounds);
            prevMap.current = map;
            prevBounds.current = bounds;
        }
    }, [map, bounds]);

    React.useEffect(() => {
        if (!map) return;

        segmentPaths.current.forEach((segment) => segment.setMap(null));
        segmentPaths.current = [];

        let prevSplitEndPoint = 0;
        segmentPaths.current = splits.map((splt) => {
            const path = new google.maps.Polyline({
                path: points.slice(prevSplitEndPoint, splt.endPointIdx),
                geodesic: true,
                strokeColor: '#00aeff',
                strokeWeight: 4,
            });
            path.setMap(map);
            prevSplitEndPoint = splt.endPointIdx;
            return path;
        });

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
