import { convertLength } from '@mui/material/styles/cssUtils';
import { Box } from '@mui/system';
import React, { useEffect, useState } from 'react';
import { AxisOptions, Chart, Datum } from 'react-charts';
import { GpsPoint } from './useMapState';

type Props = {
    points: GpsPoint[];
    splits: number[];
    onHoverPointChange: (point: GpsPoint | null) => void;
    onClick:
        | ((
              datum: Datum<GpsPoint> | null,
              event: React.MouseEvent<SVGSVGElement, MouseEvent>,
          ) => void)
        | undefined;
};

type Series = {
    label: string;
    data: GpsPoint[];
};

/**
 * Graph showing change in elevation over distance.
 */
export default function HeightMap({
    points,
    splits,
    onHoverPointChange,
    onClick,
}: Props) {
    const [data, setData] = useState<Series[]>([]);

    useEffect(() => {
        console.log('create height map data');

        if (points.length === 0) {
            setData([]);
            return;
        }

        setData(
            [...splits, points.length].map((split, splitIdx) => {
                const _points: GpsPoint[] = [];
                for (
                    let i = splitIdx > 0 ? splits[splitIdx - 1] : 0;
                    i < split;
                    i += 4
                ) {
                    _points.push(points[i]);
                }
                return {
                    data: _points,
                    label: `Segment ${splitIdx + 1} elev.`,
                };
            }),
        );
    }, [points, splits]);

    const handleFocusDatum = (datum: Datum<GpsPoint> | null) => {
        const newHoverPoint = datum ? points[datum.originalDatum.idx] : null;
        onHoverPointChange(newHoverPoint);
    };

    const primaryAxis = React.useMemo(
        (): AxisOptions<GpsPoint> => ({
            getValue: (datum) => datum.totalDistanceKm,
            formatters: {
                scale: (v: number) => v + ' km',
            },
        }),
        [],
    );

    const secondaryAxes = React.useMemo(
        (): AxisOptions<GpsPoint>[] => [
            {
                getValue: (datum) => datum.elev,
                formatters: {
                    scale: (v: number) => v + ' m',
                },
            },
        ],
        [],
    );

    if (data.length > 0) {
        return (
            <Box
                sx={{
                    flexGrow: 1,
                    m: 0.5,
                }}
            >
                <Chart
                    options={{
                        data,
                        primaryAxis,
                        secondaryAxes,
                        onClickDatum: onClick,
                        onFocusDatum: handleFocusDatum,
                    }}
                />
            </Box>
        );
    } else {
        return null;
    }
}
