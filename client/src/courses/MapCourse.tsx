import React, { useContext } from 'react';
import { LatLngElev } from './ManageCoursesPage';
import { MapContext } from './Map';
import tokyoJson from './tokyo.json';

type Props = {
    points: LatLngElev[][];
};

export default function MapCourse({ points }: Props) {
    const { map } = useContext(MapContext);
    React.useEffect(() => {
        if (!map) return;
        // const features = map.data.addGeoJson(tokyoJson);
        // console.log(features[0].getGeometry()?.getType());
        const colors = ['red', 'blue', 'green', 'pink'];
        const features = points.map((splitPoints, splitIdx) => {
            return map.data.add(
                new google.maps.Data.Feature({
                    geometry: new google.maps.Data.LineString(
                        splitPoints.map((p) => {
                            return {
                                lat: p.lat,
                                lng: p.lng,
                            } as google.maps.LatLngLiteral;
                        }),
                    ),
                    properties: {
                        strokeColor: colors[splitIdx],
                        fillColor: colors[splitIdx],
                    },
                }),
            );
        });
        console.log(features);
        console.log(features[0].toGeoJson(console.log));
        // feature.setProperty('strokeColor', 'black');

        // remove  from map on unmount
        return () => {};
    }, [map]);

    return null;
}
