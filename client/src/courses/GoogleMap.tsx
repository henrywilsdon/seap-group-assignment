import React, { useEffect, useState } from 'react';

interface MapProps extends google.maps.MapOptions {
    style: { [key: string]: string };
    onClick?: (e: google.maps.MapMouseEvent) => void;
    onIdle?: (map: google.maps.Map) => void;
    render?: (map: google.maps.Map | undefined) => React.ReactNode;
}

/**
 * Google map frame.
 */
export default function GoogleMap({
    onClick,
    onIdle,
    children,
    style,
    hoverPos,
    onHoverPosChange,
    render,
    ...options
}: React.PropsWithChildren<MapProps> & {
    hoverPos?: google.maps.LatLngLiteral | null;
    onHoverPosChange?: (latLng: google.maps.LatLngLiteral | null) => void;
}) {
    const ref = React.useRef<HTMLDivElement>(null);
    const [map, setMap] = React.useState<google.maps.Map>();
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        if (ref.current && !map) {
            setMap(new window.google.maps.Map(ref.current, {}));
        }
    }, [ref, map]);

    // Currently the map only sets options on load. You will need to use
    // deep equals on options to be able to updated them dynamically.
    useEffect(() => {
        if (map && !loaded) {
            map.setOptions({
                ...options,
            });
            setLoaded(true);
        }
    }, [map, options, loaded]);

    return (
        <>
            <div ref={ref} style={style} />
            {render && render(map)}
            {React.Children.map(children, (child) => {
                if (React.isValidElement(child)) {
                    // set the map prop on the child component
                    return React.cloneElement(child, { map });
                }
            })}
        </>
    );
}
