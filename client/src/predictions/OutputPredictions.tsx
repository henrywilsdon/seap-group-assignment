import { HorizontalRule } from '@mui/icons-material';
import { ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React, { useDeferredValue, useEffect, useState } from 'react';
import { AxisOptions, Chart, UserSerie } from 'react-charts';
import courseData from './course.json';
import testData from './csvjson.json';

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
    const [series, setSeries] = useState<UserSerie<Timestep>[]>([]);
    const [visibleSeries, setVisibleSeries] = useState<UserSerie<Timestep>[]>(
        [],
    );
    const deferredSeries = useDeferredValue(visibleSeries);
    const [isVisible, setIsVisible] = useState<Record<string, boolean>>({
        elevation: true,
        powerIn: false,
        power: true,
        wPrimeBalance: true,
        yaw: false,
        speed: false,
    });
    const [togglebuttonVal, setToggleButtonVal] = useState(
        'wPrimeBalance_powerIn',
    );

    useEffect(() => {
        if (togglebuttonVal === 'wPrimeBalance_powerIn') {
            setIsVisible((prevIsVisible) => ({
                ...prevIsVisible,
                elevation: prevIsVisible.elevation,
                wPrimeBalance: true,
                powerIn: true,
                speed: false,
                yaw: false,
                power: false,
            }));
        } else if (togglebuttonVal === 'speed_yaw') {
            setIsVisible((prevIsVisible) => ({
                ...prevIsVisible,
                elevation: prevIsVisible.elevation,
                wPrimeBalance: false,
                powerIn: false,
                speed: true,
                yaw: true,
                power: false,
            }));
        } else if (togglebuttonVal === 'speed_power') {
            setIsVisible((prevIsVisible) => ({
                ...prevIsVisible,
                elevation: prevIsVisible.elevation,
                wPrimeBalance: false,
                powerIn: false,
                speed: true,
                yaw: false,
                power: true,
            }));
        } else {
            setIsVisible((prevIsVisible) => ({
                ...prevIsVisible,
                elevation: prevIsVisible.elevation,
                wPrimeBalance: false,
                powerIn: false,
                speed: false,
                yaw: false,
                power: false,
            }));
        }
    }, [togglebuttonVal]);

    useEffect(() => {
        if (!Object.values(isVisible).includes(true)) {
            setIsVisible({
                ...isVisible,
                elevation: true,
            });
        }
    }, [isVisible]);

    useEffect(() => {
        // Aim for around 1000 data points
        const divisor =
            testData.length > 1000 ? Math.floor(testData.length / 1000) : 1;
        let _output = testData.filter((item, i) => i % divisor === 0);

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

        setSeries([
            {
                id: 'powerIn',
                label: 'Power In',
                data: _output,
                secondaryAxisId: 'powerIn',
            },
            {
                id: 'power',
                label: 'Power',
                data: _output,
                secondaryAxisId: 'power',
            },
            {
                id: 'speed',
                label: 'Speed',
                data: _output,
                secondaryAxisId: 'speed',
            },
            {
                id: 'wPrimeBalance',
                label: "W' Balance",
                data: _output,
                secondaryAxisId: 'wPrimeBalance',
            },
            {
                id: 'yaw',
                label: 'Yaw',
                data: _output,
                secondaryAxisId: 'yaw',
            },
            {
                id: 'elevation',
                label: 'Elevation',
                data: _output,
                secondaryAxisId: 'elevation',
            },
        ]);
    }, []);

    useEffect(() => {
        setVisibleSeries(
            series.filter((vs) => vs.id !== undefined && isVisible[vs.id]),
        );
    }, [series, isVisible]);

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
        (): (AxisOptions<Timestep> & { name: string })[] => [
            {
                id: 'elevation',
                name: 'Elevation',
                getValue: (datum) => datum.elevation,
                formatters: {
                    scale: (v: number) => v + ' m',
                },
                show:
                    Object.values(isVisible).reduce(
                        (count, iv) => count + Number(iv),
                        0,
                    ) === 1,
                scaleType: 'linear',
                styles: {
                    color: '#dddddd',
                    strokeWidth: 3,
                },
            },
            {
                id: 'powerIn',
                name: 'Power In',
                getValue: (datum) => datum.powerIn,
                formatters: {
                    scale: (v: number) => v + 'W',
                },
                min: 0,
                show: isVisible.powerIn,
                styles: {
                    color: '#ffa24a',
                },
            },
            {
                id: 'power',
                name: 'Power',
                getValue: (datum) => datum.powerIn,
                formatters: {
                    scale: (v: number) => v + 'W',
                },
                min: 0,
                show: isVisible.power,
                showDatumElements: true,
                styles: {
                    color: '#ffa24a',
                    stroke: 'transparent',
                },
            },
            {
                id: 'speed',
                name: 'Speed',
                getValue: (datum) => datum.speed,
                formatters: {
                    scale: (v: number) => v + ' m/s',
                },
                position: 'left',
                hardMin: isVisible.yaw ? -20 : 0,
                show: isVisible.speed,
                styles: {
                    color: '#667dff',
                },
            },
            {
                id: 'wPrimeBalance',
                name: "W' Balance",
                getValue: (datum) => datum.wPrimeBalance,
                formatters: {
                    scale: (v: number) => v + 'J',
                },
                position: 'left',
                min: 0,
                show: isVisible.wPrimeBalance,
                styles: {
                    color: '#667dff',
                },
            },
            {
                id: 'yaw',
                name: 'Yaw',
                getValue: (datum) => datum.yaw,
                formatters: {
                    scale: (v: number) => (<>{v}&deg;</>) as unknown as string,
                },
                hardMax: 20,
                show: isVisible.yaw,
                styles: {
                    color: '#ffa24a',
                },
            },
        ],
        [isVisible],
    );

    const handleVisibleSerieChange = (seriesName: string) => () => {
        setIsVisible((prevVisibleSerie) => {
            return {
                ...prevVisibleSerie,
                [seriesName]: !prevVisibleSerie[seriesName],
            };
        });
    };

    const handleToggleButtonChange = (
        event: any,
        newToggleButtonVal: string,
    ) => {
        setToggleButtonVal(newToggleButtonVal);
    };

    const renderLegend = () => {
        return secondaryAxes.map((sax) => {
            if (typeof sax?.id !== 'string' || !isVisible[sax.id]) {
                return null;
            }
            return (
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    <Typography variant="subtitle2" color="textSecondary">
                        {sax.name}
                    </Typography>
                    <HorizontalRule
                        fontSize="large"
                        htmlColor={sax?.styles?.color || 'inherit'}
                    />
                </Box>
            );
        });
    };

    return (
        <Box>
            <Box
                sx={{
                    flexGrow: 1,
                    m: 0.5,
                    width: '1400px',
                    height: '300px',
                }}
            >
                {deferredSeries.length > 0 && (
                    <Chart
                        options={{
                            data: deferredSeries,
                            primaryAxis,
                            secondaryAxes:
                                secondaryAxes as unknown as AxisOptions<Timestep>[],
                            memoizeSeries: true,
                            getSeriesStyle(series, status) {
                                const ax = secondaryAxes.find(
                                    (sax) => sax.id === series.secondaryAxisId,
                                );
                                if (!ax || !ax.styles) {
                                    return {};
                                }
                                return ax.styles;
                            },
                        }}
                    />
                )}
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    gap: 2,
                    justifyContent: 'center',
                }}
            >
                {renderLegend()}
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    gap: 2,
                    justifyContent: 'center',
                }}
            >
                <ToggleButtonGroup
                    color="primary"
                    size="small"
                    value={isVisible.elevation}
                    exclusive
                    onClick={handleVisibleSerieChange('elevation')}
                >
                    <ToggleButton value={true}>Elevation</ToggleButton>
                </ToggleButtonGroup>
                <ToggleButtonGroup
                    color="primary"
                    size="small"
                    value={togglebuttonVal}
                    exclusive
                    onChange={handleToggleButtonChange}
                >
                    <ToggleButton value="wPrimeBalance_powerIn">
                        W' &amp; Power In
                    </ToggleButton>
                    <ToggleButton value="speed_yaw">
                        Speed &amp; Yaw
                    </ToggleButton>
                    <ToggleButton value="speed_power">
                        Speed &amp; Power
                    </ToggleButton>
                </ToggleButtonGroup>
            </Box>
        </Box>
    );
}
