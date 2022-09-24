import { isLatLngLiteral } from '@googlemaps/typescript-guards';
import { MarkEmailReadTwoTone, ThirtyFpsSharp } from '@mui/icons-material';
import { createCustomEqual } from 'fast-equals';
import React, { createContext, useEffect, useState } from 'react';
import PointWithIndex from './PointWithIndex';
import tokyoJson from './tokyo.json';

interface MapProps extends google.maps.MapOptions {
    style: { [key: string]: string };
    onClick?: (e: google.maps.MapMouseEvent) => void;
    onIdle?: (map: google.maps.Map) => void;
}

export const MapContext = createContext<{ map: google.maps.Map | undefined }>({
    map: undefined,
});

export default function Map({
    onClick,
    onIdle,
    children,
    style,
    hoverPos,
    onHoverPosChange,
    ...options
}: React.PropsWithChildren<MapProps> & {
    hoverPos?: google.maps.LatLngLiteral | null;
    onHoverPosChange?: (latLng: google.maps.LatLngLiteral | null) => void;
}) {
    const ref = React.useRef<HTMLDivElement>(null);
    const [map, setMap] = React.useState<google.maps.Map>();
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        if (map && !loaded) {
            map.setOptions({
                center: new window.google.maps.LatLng(35.36558, 138.92561),
                ...options,
            });
            // const features = map.data.addGeoJson(tokyoJson);
            // console.log(features[0].getGeometry()?.getType());

            // const feature = createMapFeature();
            // map.data.add(feature);
            // map.data.addListener('mouseover', function (event: { latLng: google.maps.LatLng }) {
            //     onHoverPosChange && onHoverPosChange({ lat: event.latLng.lat(), lng: event.latLng.lng() });
            //     console.log(event)
            // });
            setLoaded(true);
        }
    }, [map, options, loaded]);

    const createMapFeature = () => {
        class PointWithIdx extends google.maps.Data.Point {
            pointIdx: number;

            constructor(
                latLng: google.maps.LatLng | google.maps.LatLngLiteral,
                pointIdx: number,
            ) {
                super(latLng);
                this.pointIdx = pointIdx;
            }
        }

        const points: PointWithIdx[] = [];
        const allPoints = tokyoJson.features[0].geometry.coordinates[0];
        for (let i = 0; i < allPoints.length; i += 8) {
            const d = allPoints[i];
            points.push(new PointWithIdx({ lat: d[0], lng: d[1] }, i));
        }

        return new google.maps.Data.Feature({
            geometry: new google.maps.Data.GeometryCollection(points),
        });
    };

    useEffect(() => {
        if (map) {
            ['click', 'idle'].forEach((eventName) =>
                google.maps.event.clearListeners(map, eventName),
            );

            if (onClick) {
                map.addListener('click', onClick);
            }

            if (onIdle) {
                map.addListener('idle', () => onIdle(map));
            }
        }
    }, [map, onClick, onIdle]);

    useEffect(() => {
        if (ref.current && !map) {
            setMap(new window.google.maps.Map(ref.current, {}));
        }
    }, [ref, map]);

    return (
        <MapContext.Provider value={{ map }}>
            <div ref={ref} style={style} />
            {React.Children.map(children, (child) => {
                if (React.isValidElement(child)) {
                    // set the map prop on the child component
                    return React.cloneElement(child, { map });
                }
            })}
        </MapContext.Provider>
    );
}
