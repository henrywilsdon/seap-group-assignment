import { Box } from '@mui/system';
import React, { useEffect, useState } from 'react';
import { AxisOptions, Chart } from 'react-charts';
import mapJSON from './tokyo.json';

type Props = {
    hoverPoint: google.maps.LatLngLiteral | null;
    onHoverPointChange: (point: google.maps.LatLngLiteral | null) => void;
};

type Point = {
    i: number;
    lat: number;
    long: number;
    elev: number;
};

type Series = {
    label: string;
    data: Point[];
};

const allPoints = mapJSON.features[0].geometry.coordinates[0];
const points: Point[] = [];
for (let i = 0; i < allPoints.length; i += 8) {
    const d = allPoints[i];
    points.push({
        i,
        lat: d[0],
        long: d[1],
        elev: d[2],
    });
}
console.log(points);
const data: Series[] = [
    {
        label: 'Height',
        data: points,
    },
];

export default function HeightMap({ hoverPoint, onHoverPointChange }: Props) {
    const [primaryCursor, setPrimaryCursor] = useState(null);

    useEffect(() => {
        if (!hoverPoint) {
            setPrimaryCursor(null);
            return;
        }
        const newPrimaryCursor = points.findIndex((p) => {
            console.log();
            return p.lat === hoverPoint.lat && p.long === hoverPoint.lng;
        });
        console.log(newPrimaryCursor);
    }, [hoverPoint]);

    useEffect(() => {
        const newHoverPoint = primaryCursor ? allPoints[primaryCursor] : null;
        onHoverPointChange(
            newHoverPoint && { lat: newHoverPoint[1], lng: newHoverPoint[0] },
        );
    }, [primaryCursor]);

    const primaryAxis = React.useMemo(
        (): AxisOptions<Point> => ({
            getValue: (datum) => datum.i,
        }),
        [],
    );

    const secondaryAxes = React.useMemo(
        (): AxisOptions<Point>[] => [
            {
                getValue: (datum) => datum.elev,
            },
        ],
        [],
    );

    return (
        <Chart
            options={{
                data,
                primaryAxis,
                secondaryAxes,
                primaryCursor: {
                    value: primaryCursor,
                    onChange: setPrimaryCursor,
                },
                onClickDatum: console.log,
            }}
        />
    );
}
