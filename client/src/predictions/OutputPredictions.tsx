import { Box } from '@mui/system';
import React, { useDeferredValue, useEffect, useState } from 'react';
import { AxisOptions, Chart, Datum, UserSerie } from 'react-charts';
import testData from './csvjson.json';
import courseData from './course.json';

type Props = {
    // timesteps: Timestep[]
};

interface Timestep {
    time: number;
    powerIn: number;
    speed: number;
    speedKmh: number;
    distance: number;
    wPrimeBalance: number;
    yaw: number;
    elevation: number;
}

/**
 * Graph showing change in elevation over distance.
 */
export default function HeightMap({}: // timesteps
Props) {
    const [data, setData] = useState<UserSerie<Timestep>[]>([]);
    const deferredData = useDeferredValue(data);

    useEffect(() => {
        // Aim for around 1000 data points
        const divisor = Math.floor(testData.length / 1000);
        let _output = testData.filter((item, i) => i % divisor === 0);
        console.log(_output.length);

        let ei = 0;
        _output = _output.map((o) => {
            while (
                ei < courseData.length &&
                o.distance > courseData[ei].distance
            ) {
                ei++;
            }

            return {
                ...o,
                elevation: courseData[ei].elevation,
            };
        });

        // const _course = [];
        // const cDivisor= Math.floor( / 1000);
        // for (let i = 0; i < 3949; i++) {
        //     _course.push({
        //         elevation: testData[i].elevation,
        //         distance: testData[i].distance,
        //     });
        // }

        setData([
            {
                id: 'powerIn',
                label: 'Power In',
                data: _output,
                secondaryAxisId: 'powerIn',
            },
            // {
            //     id: 'speed',
            //     label: 'Speed',
            //     data: _output,
            //     secondaryAxisId: 'speed',
            // },
            {
                id: 'wPrimeBalance',
                label: "W' Balance",
                data: _output,
                secondaryAxisId: 'wPrimeBalance',
            },
            // {
            //     id: 'yaw',
            //     label: 'Yaw',
            //     data: _output,
            //     secondaryAxisId: 'yaw'
            // },
            {
                id: 'elevation',
                label: 'Elevation',
                data: _output,
                secondaryAxisId: 'elevation',
            },
        ]);
    }, []);

    const primaryAxis = React.useMemo(
        (): AxisOptions<Timestep> => ({
            getValue: (datum) => datum.distance,
            formatters: {
                cursor: (v: number) => (v / 1000).toFixed(3) + ' km',
                scale: (v: number) => (v / 1000).toFixed(1) + ' km',
            },
            max: testData[testData.length - 1].distance,
        }),
        [],
    );

    const secondaryAxes = React.useMemo(
        (): AxisOptions<Timestep>[] => [
            {
                id: 'elevation',
                getValue: (datum) => datum.elevation,
                formatters: {
                    scale: (v: number) => v + ' m',
                },
                show: false,
                scaleType: 'linear',
            },
            {
                id: 'powerIn',
                getValue: (datum) => datum.powerIn,
                formatters: {
                    scale: (v: number) => v + 'W',
                },
                min: 0,
            },
            // {
            //     id: 'speed',
            //     getValue: (datum) => datum.speed,
            //     formatters: {
            //         scale: (v: number) => v + ' m',
            //     },
            //     position: 'left',
            //     hardMin: -20

            // } ,
            {
                id: 'wPrimeBalance',
                getValue: (datum) => datum.wPrimeBalance,
                formatters: {
                    scale: (v: number) => v + 'J',
                },
                position: 'left',
                min: 0,
                innerBandPadding: 0,
            },
            // {
            //     id: 'yaw',
            //     getValue: (datum) => datum.yaw,
            //     formatters: {
            //         scale: (v: number) => v + ' m',
            //     },
            //     hardMax: 20
            // },
        ],
        [],
    );

    return (
        <Box
            sx={{
                flexGrow: 1,
                m: 0.5,
                width: '1400px',
                height: '300px',
            }}
        >
            {deferredData.length > 0 && (
                <Chart
                    options={{
                        data: deferredData,
                        primaryAxis,
                        secondaryAxes:
                            secondaryAxes as unknown as AxisOptions<Timestep>[],
                        memoizeSeries: true,
                        getSeriesStyle(series, status) {
                            console.log(series);
                            switch (series.id) {
                                case 'elevation':
                                    return {
                                        color: '#dddddd',
                                        strokeWidth: 3,
                                    };
                                case 'speed':
                                    return {
                                        color: '#667dff',
                                    };
                                case 'yaw':
                                    return {
                                        color: '#ffa24a',
                                    };
                                case 'wPrimeBalance':
                                    return {
                                        color: '#667dff',
                                    };
                                case 'powerIn':
                                    return {
                                        color: '#ffa24a',
                                    };
                                default:
                                    return {};
                            }
                        },
                    }}
                />
            )}
        </Box>
    );
}
