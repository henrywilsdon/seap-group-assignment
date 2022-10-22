/**global google */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { BackendCourse, BackendGpsPoints } from './CourseApi';

export interface GpsPoint extends google.maps.LatLngLiteral {
    idx: number;
    elev: number;
    segment: number;
    distance: number;
    totalDistanceKm: number;
}

/**
 * State for course map and height map.
 */
export function useMapState(backendGpsPoints: BackendGpsPoints | null): {
    points: GpsPoint[];
    splits: number[];
    hoverPoint: GpsPoint | null;
    hoverSplitIdx: number | null;
    centerLatLng: google.maps.LatLngLiteral | null;
    boundsLatLng: google.maps.LatLngBoundsLiteral | null;
    setHoverPoint: React.Dispatch<React.SetStateAction<GpsPoint | null>>;
    setHoverSplitIdx: React.Dispatch<React.SetStateAction<number | null>>;
    addSplit: (pointIdx: number | null) => void;
    removeSplit: (pointIdx: number) => void;
    createBackendGpsPoints: () => BackendCourse['gps_geo_json'] | null;
} {
    const [hoverPoint, setHoverPoint] = useState<GpsPoint | null>(null);
    const [points, setPoints] = useState<GpsPoint[]>([]);
    const [splits, setSplits] = useState<number[]>([]);
    const [hoverSplitIdx, setHoverSplitIdx] = useState<number | null>(null);
    const [centerLatLng, setCenterLatLng] =
        useState<google.maps.LatLngLiteral | null>(null);
    const [boundsLatLng, setBoundsLatLng] =
        useState<google.maps.LatLngBoundsLiteral | null>(null);
    const prevBackendGpsPoints = useRef<BackendGpsPoints | null>(null);

    // Parse map points
    useEffect(() => {
        if (!backendGpsPoints) {
            setPoints([]);
            setSplits([]);
            setCenterLatLng(null);
            return;
        }

        // Reset splits if course changes
        if (backendGpsPoints !== prevBackendGpsPoints.current) {
            setSplits([]);
        }
        prevBackendGpsPoints.current = backendGpsPoints;

        const newPoints: GpsPoint[] = [];
        let maxLat = -90;
        let minLat = 90;
        let maxLng = -180;
        let minLng = 180;

        let totalDistanceKm = 0;
        for (let i = 0; i < backendGpsPoints.latitude.length; i++) {
            maxLat = Math.max(maxLat, backendGpsPoints.latitude[i]);
            minLat = Math.min(minLat, backendGpsPoints.latitude[i]);
            maxLng = Math.max(maxLng, backendGpsPoints.longitude[i]);
            minLng = Math.min(minLng, backendGpsPoints.longitude[i]);

            totalDistanceKm +=
                (backendGpsPoints.horizontal_distance_to_last_point[i] || 0) /
                1000;
            newPoints.push({
                idx: i,
                lat: backendGpsPoints.latitude[i],
                lng: backendGpsPoints.longitude[i],
                elev: backendGpsPoints.elevation[i],
                distance: backendGpsPoints.horizontal_distance_to_last_point[i],
                totalDistanceKm: parseFloat(totalDistanceKm.toFixed(3)),
                segment: 0,
            });
        }

        setBoundsLatLng({
            north: maxLat,
            east: maxLng,
            south: minLat,
            west: maxLng,
        });
        setCenterLatLng({
            lat: minLat + (maxLat - minLat) / 2,
            lng: minLng + (maxLng - minLng) / 2,
        });

        setPoints(newPoints);
    }, [backendGpsPoints]);

    // Set the current hover split
    useEffect(() => {
        if (hoverPoint) {
            for (let i = 0; i < splits.length; i++) {
                if (hoverPoint.idx < splits[i]) {
                    setHoverSplitIdx(i);
                    return;
                }
            }
        }
        if (hoverPoint?.idx && hoverPoint?.idx >= splits[splits.length - 1]) {
            setHoverSplitIdx(splits.length);
            return;
        }
        setHoverSplitIdx(null);
    }, [hoverPoint, splits]);

    const addSplit = useCallback(
        (pointIdx: number | null) => {
            if (!pointIdx || splits.includes(pointIdx)) {
                return;
            }

            const newSplits = [...splits, pointIdx];
            newSplits.sort((a, b) => a - b);
            setSplits(newSplits);
        },
        [splits],
    );

    const removeSplit = useCallback(
        (splitIdx: number) => {
            if (splits.length <= 1) {
                setSplits([]);
                return;
            }

            // TODO  Keep rouchness class

            setSplits((prevSplits) => {
                const newSplits = [...prevSplits];
                newSplits.splice(splitIdx, 1);
                return newSplits;
            });
        },
        [splits],
    );

    const createBackendGpsPoints = useCallback(() => {
        if (!backendGpsPoints) {
            return null;
        }
        return backendGpsPoints;
    }, [backendGpsPoints]);

    return {
        points,
        splits,
        hoverPoint,
        hoverSplitIdx,
        centerLatLng,
        boundsLatLng,
        setHoverPoint,
        setHoverSplitIdx,
        addSplit,
        removeSplit,
        createBackendGpsPoints,
    };
}
