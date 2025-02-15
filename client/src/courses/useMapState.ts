/**global google */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { BackendCourse, BackendGpsPoints } from './CourseApi';

export interface GpsPoint extends google.maps.LatLngLiteral {
    idx: number;
    elev: number;
    segment: number;
    distance: number;
    totalDistance: number;
}

export interface Split {
    endPointIdx: number;
    roughness: number;
}

const DEFAULT_ROUGHNESS = 2;

/**
 * State for course map and height map.
 */
export function useMapState(
    backendGpsPoints: BackendGpsPoints | null | undefined,
): {
    points: GpsPoint[];
    splits: Split[];
    hoverDistance: number | null;
    hoverSplitIdx: number | null;
    centerLatLng: google.maps.LatLngLiteral | null;
    boundsLatLng: google.maps.LatLngBoundsLiteral | null;
    setHoverDistance: React.Dispatch<React.SetStateAction<number | null>>;
    setHoverSplitIdx: React.Dispatch<React.SetStateAction<number | null>>;
    addSplit: (pointIdx: number | null) => void;
    removeSplit: (pointIdx: number) => void;
    changeRoughness: (pointIdx: number, roughness: number) => void;
    createBackendGpsPoints: () => BackendCourse['gps_geo_json'] | null;
} {
    const [hoverDistance, setHoverDistance] = useState<number | null>(null);
    const [points, setPoints] = useState<GpsPoint[]>([]);

    const [splits, setSplits] = useState<Split[]>([]);
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

        prevBackendGpsPoints.current = backendGpsPoints;

        const newSplits: Split[] = [];
        const newPoints: GpsPoint[] = [];
        let maxLat = -90;
        let minLat = 90;
        let maxLng = -180;
        let minLng = 180;

        let lastSegNum = 0;
        let totalDistance = 0;
        for (let i = 0; i < backendGpsPoints.latitude.length; i++) {
            maxLat = Math.max(maxLat, backendGpsPoints.latitude[i]);
            minLat = Math.min(minLat, backendGpsPoints.latitude[i]);
            maxLng = Math.max(maxLng, backendGpsPoints.longitude[i]);
            minLng = Math.min(minLng, backendGpsPoints.longitude[i]);

            totalDistance +=
                backendGpsPoints.horizontal_distance_to_last_point[i] || 0;
            newPoints.push({
                idx: i,
                lat: backendGpsPoints.latitude[i],
                lng: backendGpsPoints.longitude[i],
                elev: backendGpsPoints.elevation[i],
                distance: backendGpsPoints.horizontal_distance_to_last_point[i],
                totalDistance: parseFloat(totalDistance.toFixed(3)),
                segment: backendGpsPoints.segment[i],
            });

            if (
                backendGpsPoints.segment[i] !== lastSegNum ||
                i === backendGpsPoints.elevation.length - 1
            ) {
                lastSegNum = backendGpsPoints.segment[i];
                newSplits.push({
                    endPointIdx: i,
                    roughness: backendGpsPoints.roughness[i - 1],
                });
            }
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

        setSplits(newSplits);
        setPoints(newPoints);
    }, [backendGpsPoints]);

    // Set the current hover split
    useEffect(() => {
        if (hoverDistance) {
            for (let i = 0; i < splits.length; i++) {
                if (
                    hoverDistance * (points.length - 1) <
                    splits[i].endPointIdx
                ) {
                    setHoverSplitIdx(i);
                    return;
                }
            }
        }
        if (
            hoverDistance != null &&
            splits.length > 0 &&
            hoverDistance * (points.length - 1) >=
                splits[splits.length - 1].endPointIdx
        ) {
            setHoverSplitIdx(splits.length);
            return;
        }
        setHoverSplitIdx(null);
    }, [hoverDistance, splits, points]);

    const addSplit = useCallback(
        (pointIdx: number | null) => {
            if (!pointIdx || splits.find((s) => s.endPointIdx === pointIdx)) {
                return;
            }

            const newSplits: Split[] = [
                ...splits,
                {
                    endPointIdx: pointIdx,
                    roughness: DEFAULT_ROUGHNESS,
                },
            ];
            newSplits.sort((a, b) => a.endPointIdx - b.endPointIdx);
            setSplits(newSplits);
        },
        [splits],
    );

    const removeSplit = useCallback(
        (splitIdx: number) => {
            if (splits.length <= 2) {
                setSplits([
                    {
                        endPointIdx: points.length - 1,
                        roughness: DEFAULT_ROUGHNESS,
                    },
                ]);
                return;
            }
            setSplits((prevSplits) => {
                const newSplits = [...prevSplits];
                newSplits.splice(splitIdx, 1);
                if (splitIdx === splits.length - 1) {
                    newSplits[newSplits.length - 1].endPointIdx =
                        points.length - 1;
                }
                return newSplits;
            });
        },
        [splits, points],
    );

    const changeRoughness = useCallback(
        (splitIdx: number, roughness: number) => {
            const newSplits = [...splits];
            newSplits[splitIdx].roughness = roughness;
            setSplits(newSplits);
        },
        [splits],
    );

    const createBackendGpsPoints = useCallback<
        () => BackendGpsPoints | null
    >(() => {
        if (!backendGpsPoints) {
            return null;
        }

        const segment: number[] = [];
        const roughness: number[] = [];

        let currentSplitIdx = 0;
        for (let i = 0; i < points.length; i++) {
            const currentSplit = splits[currentSplitIdx];
            if (
                i >= currentSplit.endPointIdx &&
                currentSplitIdx + 1 < splits.length
            ) {
                currentSplitIdx++;
            }

            segment[i] = currentSplitIdx;
            roughness[i] = currentSplit.roughness;
        }

        return {
            ...backendGpsPoints,
            segment,
            roughness,
        } as BackendGpsPoints;
    }, [backendGpsPoints, splits, points]);

    return {
        points,
        splits,
        hoverDistance,
        hoverSplitIdx,
        centerLatLng,
        boundsLatLng,
        setHoverDistance,
        setHoverSplitIdx,
        addSplit,
        removeSplit,
        changeRoughness,
        createBackendGpsPoints,
    };
}
