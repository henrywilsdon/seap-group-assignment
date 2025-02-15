import { Box } from '@mui/system';
import React, { useEffect, useState } from 'react';
import { AxisOptions, Chart, Datum } from 'react-charts';
import { GpsPoint, Split } from './useMapState';

type Props = {
    points: GpsPoint[];
    splits: Split[];
    onHoverDistanceChange: (point: number | null) => void;
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
    onHoverDistanceChange,
    onClick,
}: Props) {
    const [data, setData] = useState<Series[]>([]);

    useEffect(() => {
        if (points.length === 0) {
            setData([]);
            return;
        }

        setData(
            splits.map((split, splitIdx) => {
                const _points: GpsPoint[] = [];
                for (
                    let i = splitIdx > 0 ? splits[splitIdx - 1].endPointIdx : 0;
                    i < split.endPointIdx;
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
        onHoverDistanceChange(
            newHoverPoint ? newHoverPoint.totalDistance : null,
        );
    };

    const primaryAxis = React.useMemo(
        (): AxisOptions<GpsPoint> => ({
            getValue: (datum) => datum.totalDistance,
            formatters: {
                scale: (v: number) => (v / 1000).toPrecision(2) + ' km',
            },
            max: points && points[points.length - 1]?.distance,
        }),
        [points],
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
