/* global google */
import { Wrapper } from '@googlemaps/react-wrapper';
import { Box } from '@mui/system';
import { useCallback, useEffect, useState } from 'react';
import { Datum } from 'react-charts';
import GoogleMap from './GoogleMap';
import HeightMap from './HeightMap';
import MapCourse from './MapCourse';
import Marker from './Marker';
import mapJSON from './tokyo.json';

type Props = {};

export interface LatLngElev extends google.maps.LatLngLiteral {
    idx: number;
    elev: number;
    segment: number;
}

export default function ManageCoursesPage({}: Props) {
    const [hoverPoint, setHoverPoint] = useState<LatLngElev | null>(null);
    const [segments, setSegments] = useState<LatLngElev[][]>([]);
    const [points, setPoints] = useState<LatLngElev[]>([]);
    const [splits, setSplits] = useState<number[]>([]);
    const [hoverSegment, setHoverSegment] = useState<number | null>(null);

    // Parse map points
    useEffect(() => {
        const allPoints = mapJSON.features[0].geometry.coordinates[0];
        const _points: LatLngElev[][] = [[]];

        let split = 0;
        for (let i = 0; i < allPoints.length; i++) {
            const d = allPoints[i];
            if (splits.length > 0 && i >= splits[split]) {
                split++;
                _points.push([]);
            }

            _points[split].push({
                idx: i,
                lat: d[1],
                lng: d[0],
                elev: d[2],
                segment: split,
            });
        }
        setSegments(_points);

        setPoints(
            allPoints.map((d, i) => ({
                idx: i,
                lat: d[1],
                lng: d[0],
                elev: d[2],
                segment: 0,
            })),
        );
    }, [splits]);

    // Set the current hover segment
    useEffect(() => {
        if (hoverPoint) {
            for (let i = 0; i < splits.length; i++) {
                if (hoverPoint.idx < splits[i]) {
                    setHoverSegment(i);
                    return;
                }
            }
        }
        if (hoverPoint?.idx && hoverPoint?.idx >= splits[splits.length - 1]) {
            setHoverSegment(splits.length);
            return;
        }
        setHoverSegment(null);
    }, [hoverPoint, splits]);

    const handleHeightMapClick = useCallback(
        (point: Datum<LatLngElev> | null) => {
            const newSplitPoint = point?.originalDatum?.idx;
            if (!newSplitPoint || splits.includes(newSplitPoint)) {
                return;
            }

            const newSplits = [...splits, newSplitPoint];
            newSplits.sort((a, b) => a - b);
            console.log(newSplits);
            setSplits(newSplits);
        },
        [splits],
    );

    const renderSegmentMarkers = (map: google.maps.Map | undefined) => {
        const markers = [];

        for (let i = segments.length; i >= 0; i--) {
            const position =
                i < segments.length
                    ? segments[i][0]
                    : points[points.length - 1];
            const isFinish = i === segments.length;
            const isStart = i === 0;
            const isEndPoint = isStart || isFinish;
            const label = isFinish ? 'F' : String(i + 1);
            const title = isFinish ? 'Finish' : 'Segment ' + (i + 1);
            const isHovered =
                hoverSegment !== null &&
                (hoverSegment === i || hoverSegment === i - 1);

            let fillColor = '#ffa43c';
            if (hoverSegment === i - 1 || (hoverSegment === null && isFinish)) {
                fillColor = '#ff4d4d';
            } else if (
                hoverSegment === i ||
                (hoverSegment === null && isStart)
            ) {
                fillColor = '#7eff4b';
            }

            markers.push(
                <Marker
                    map={map}
                    position={position}
                    label={label}
                    title={title}
                    icon={{
                        ...(isEndPoint ? createPinIcon : createCircleIcon)(),
                        fillColor,
                    }}
                    zIndex={isHovered ? 1000 : 0}
                />,
            );
        }

        return markers;
    };

    return (
        <div>
            ManageCoursesPage
            <Wrapper apiKey="AIzaSyDks89zgKUUG0qc_hixpNMndMj6hDOOGWw">
                <GoogleMap
                    style={{ height: '600px', width: '900px' }}
                    zoom={14}
                    center={{ lat: 35.36558, lng: 138.92561 }}
                    zoomControl
                    render={(map) => (
                        <>
                            {renderSegmentMarkers(map)}
                            {hoverPoint && (
                                <Marker
                                    position={hoverPoint}
                                    map={map}
                                    zIndex={1001}
                                />
                            )}
                            {segments.length > 0 && (
                                <MapCourse
                                    points={points}
                                    splits={splits}
                                    hoverSegment={hoverSegment}
                                    map={map}
                                />
                            )}
                        </>
                    )}
                />
            </Wrapper>
            <Box
                sx={{
                    height: '200px',
                    width: '900px',
                }}
            >
                <HeightMap
                    points={points}
                    splits={splits}
                    onHoverPointChange={setHoverPoint}
                    onClick={handleHeightMapClick}
                />
            </Box>
        </div>
    );
}

const createPinIcon = () => ({
    path: 'M384 192c0 87.4-117 243-168.3 307.2c-12.3 15.3-35.1 15.3-47.4 0C117 435 0 279.4 0 192C0 86 86 0 192 0S384 86 384 192z',
    fillColor: '#ffa43c',
    fillOpacity: 1,
    anchor: new google.maps.Point(384 / 2, 512),
    labelOrigin: new google.maps.Point(384 / 2, 512 / 2.5),
    strokeWeight: 0.5,
    strokeColor: '#000000',
    scale: 0.065,
});

const createCircleIcon = () => ({
    path: 'M256 512c141.4 0 256-114.6 256-256S397.4 0 256 0S0 114.6 0 256S114.6 512 256 512z',
    fillColor: '#ffa43c',
    fillOpacity: 1,
    anchor: new google.maps.Point(512 / 2, 512 / 2),
    labelOrigin: new google.maps.Point(512 / 2, 512 / 2),
    strokeWeight: 0.5,
    strokeColor: '#000000',
    scale: 0.035,
});
