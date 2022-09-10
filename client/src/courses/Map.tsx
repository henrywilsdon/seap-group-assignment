import { isLatLngLiteral } from '@googlemaps/typescript-guards';
import { MarkEmailReadTwoTone } from '@mui/icons-material';
import { createCustomEqual } from 'fast-equals';
import React, { useEffect, useState } from 'react';

interface MapProps extends google.maps.MapOptions {
    style: { [key: string]: string };
    onClick?: (e: google.maps.MapMouseEvent) => void;
    onIdle?: (map: google.maps.Map) => void;
}

export default function Map({
    onClick,
    onIdle,
    children,
    style,
    hoverPos,
    ...options
}: React.PropsWithChildren<MapProps> & {
    hoverPos?: google.maps.LatLng | null;
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
            map.data.loadGeoJson('tokyo.json');
            setLoaded(true);
        }
    }, [map, options, loaded]);

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
        <>
            <div ref={ref} style={style} />
            {React.Children.map(children, (child) => {
                if (React.isValidElement(child)) {
                    // set the map prop on the child component
                    return React.cloneElement(child, { map });
                }
            })}
        </>
    );
}
