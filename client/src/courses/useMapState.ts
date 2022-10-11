/**global google */
import React, { useCallback, useEffect, useState } from 'react';
import { BackendCourseGPS } from './courseAPI';

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
export function useMapState(gpsPoints: BackendCourseGPS | null): {
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
} {
    const [hoverPoint, setHoverPoint] = useState<GpsPoint | null>(null);
    const [points, setPoints] = useState<GpsPoint[]>([]);
    const [splits, setSplits] = useState<number[]>([]);
    const [hoverSplitIdx, setHoverSplitIdx] = useState<number | null>(null);
    const [centerLatLng, setCenterLatLng] =
        useState<google.maps.LatLngLiteral | null>(null);
    const [boundsLatLng, setBoundsLatLng] =
        useState<google.maps.LatLngBoundsLiteral | null>(null);

    // Parse map points
    useEffect(() => {
        if (!gpsPoints) {
            setPoints([]);
            setSplits([]);
            setCenterLatLng(null);
            return;
        }
        console.log('parse points');
        const newPoints: GpsPoint[] = [];
        let maxLat = -90;
        let minLat = 90;
        let maxLng = -180;
        let minLng = 180;

        let totalDistanceKm = 0;
        for (let i = 0; i < gpsPoints.lat.length; i++) {
            maxLat = Math.max(maxLat, gpsPoints.lat[i]);
            minLat = Math.min(minLat, gpsPoints.lat[i]);
            maxLng = Math.max(maxLng, gpsPoints.lon[i]);
            minLng = Math.min(minLng, gpsPoints.lon[i]);

            totalDistanceKm += (gpsPoints.distance[i] || 0) / 1000;
            newPoints.push({
                idx: i,
                lat: gpsPoints.lat[i],
                lng: gpsPoints.lon[i],
                elev: gpsPoints.ele[i],
                distance: gpsPoints.distance[i],
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
        console.log(minLat, maxLat, minLng, maxLng);

        setPoints(newPoints);
    }, [gpsPoints]);

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
    };
}
