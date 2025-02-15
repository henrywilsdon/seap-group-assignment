/* global google */
import { Wrapper } from '@googlemaps/react-wrapper';
import { ReactNode, useMemo } from 'react';
import GoogleMap from './GoogleMap';
import CoursePolyline from './CoursePolyline';
import Marker from './Marker';
import { GpsPoint, Split } from './useMapState';

type Props = {
    points: GpsPoint[];
    splits: Split[];
    bounds?: google.maps.LatLngBoundsLiteral | null;
    hoverDistance: number | null;
    hoverSplitIdx: number | null;
};

const mapStyle = { flexGrow: '1', height: '100%' };

/**
 * Show google map with course path segments overlayed.
 */
export default function CourseMap(props: Props) {
    const { points, splits, bounds, hoverDistance, hoverSplitIdx } = props;
    const hoverPoint = useMemo<google.maps.LatLngLiteral | null>(() => {
        if (hoverDistance === null) {
            return null;
        }
        const pointIdx = binSearchDist(points, hoverDistance);

        if (pointIdx < 0 || pointIdx >= points.length) {
            return null;
        }
        return {
            lat: points[pointIdx].lat,
            lng: points[pointIdx].lng,
        } as google.maps.LatLngLiteral;
    }, [hoverDistance, points]);

    const renderSegmentMarkers = (map: google.maps.Map | undefined) => {
        const markers: ReactNode[] = [];
        const markerPosIdxs = [0, ...splits.map((s) => s.endPointIdx)];

        for (let i = markerPosIdxs.length - 1; i >= 0; i--) {
            const position = points[markerPosIdxs[i]];
            const isFinish = i === markerPosIdxs.length - 1;
            const isStart = i === 0;
            const isEndPoint = isStart || isFinish;
            const label = isFinish ? 'F' : String(i + 1);
            const title = isFinish ? 'Finish' : 'Segment ' + (i + 1);
            const isHovered =
                hoverSplitIdx !== null &&
                (hoverSplitIdx === i || hoverSplitIdx === i - 1);

            let fillColor = '#ffa43c';
            if (
                hoverSplitIdx === i - 1 ||
                (hoverSplitIdx === null && isFinish)
            ) {
                fillColor = '#ff4d4d';
            } else if (
                hoverSplitIdx === i ||
                (hoverSplitIdx === null && isStart)
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
        <Wrapper apiKey="AIzaSyDks89zgKUUG0qc_hixpNMndMj6hDOOGWw">
            <GoogleMap
                style={mapStyle}
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
                        {points.length > 0 && (
                            <CoursePolyline
                                points={points}
                                splits={splits}
                                bounds={bounds}
                                hoverSegment={hoverSplitIdx}
                                map={map}
                            />
                        )}
                    </>
                )}
                {...(points.length === 0 && {
                    zoom: 10,
                    center: { lat: -34.92866, lng: 138.59863 },
                })}
            />
        </Wrapper>
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

function binSearchDist(points: GpsPoint[], dist: number): number | never {
    let low = 0;
    let mid = 0;
    let high = points.length - 1;

    while (low <= high) {
        mid = Math.floor((low + high) / 2);
        if (dist < points[mid].totalDistance) {
            high = mid - 1;
        } else if (dist > points[mid].totalDistance) {
            low = mid + 1;
        } else {
            return mid;
        }
    }
    return mid;
}
