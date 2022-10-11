/**global google */
import React, { useCallback, useEffect, useState } from 'react';

// [longitude, latitude, elevation]
type GeoJsonPoint = [number, number, number];

export interface GpsPoint extends google.maps.LatLngLiteral {
    idx: number;
    elev: number;
    segment: number;
    distance: number;
}

/**
 * State for course map and height map.
 */
export function useMapState(gpsPoints: GeoJsonPoint[]): {
    points: GpsPoint[];
    splits: number[];
    hoverPoint: GpsPoint | null;
    hoverSplitIdx: number | null;
    setHoverPoint: React.Dispatch<React.SetStateAction<GpsPoint | null>>;
    setHoverSplitIdx: React.Dispatch<React.SetStateAction<number | null>>;
    addSplit: (point: number | null) => void;
} {
    const [hoverPoint, setHoverPoint] = useState<GpsPoint | null>(null);
    const [points, setPoints] = useState<GpsPoint[]>([]);
    const [splits, setSplits] = useState<number[]>([]);
    const [hoverSplitIdx, setHoverSplitIdx] = useState<number | null>(null);

    // Parse map points
    useEffect(() => {
        setPoints(
            gpsPoints.map((d: number[], i: number) => ({
                idx: i,
                lat: d[1],
                lng: d[0],
                elev: d[2],
                segment: 0,
            })),
        );
    }, [splits, gpsPoints]);

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

    const removeSplit = useCallback((pointIdx: number) => {
        // TODO implement remove course split
    }, []);

    return {
        points,
        splits,
        hoverPoint,
        hoverSplitIdx,
        setHoverPoint,
        setHoverSplitIdx,
        addSplit,
    };
}
