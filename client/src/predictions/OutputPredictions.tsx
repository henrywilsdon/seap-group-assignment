import { HorizontalRule } from '@mui/icons-material';
import { ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React, {
    useCallback,
    useDeferredValue,
    useEffect,
    useMemo,
    useState,
} from 'react';
import {
    AxisOptions,
    Chart,
    ChartOptions,
    Datum,
    UserSerie,
} from 'react-charts';
import {
    PredictionOutputSegment,
    PredictionOutputTimeSteps,
} from './PredictionsAPI';

type Props = {
    outputTimesteps: PredictionOutputTimeSteps;
    outputSegments: PredictionOutputSegment[];
    onHoverPointChange: (point: number | null) => void;
};

interface Timestep {
    idx: number;
    time: number;
    powerIn: number;
    speed: number;
    distance: number;
    wPrimeBalance: number;
    yaw: number;
    elevation: number;
    segment: number;
}

/**
 * Graph showing change in elevation over distance.
 */
export default function HeightMap({
    onHoverPointChange,
    outputTimesteps,
    outputSegments,
}: Props) {
    const ogDataLength = outputTimesteps.distance.length;
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
    const [hoverSegment, setHoverSegment] = useState<number | null>(null);
    const [sampleDataLength, setSampleDataLength] = useState(0);

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
            ogDataLength > 1000 ? Math.floor(ogDataLength / 1000) : 1;

        const segments: Timestep[][] = [[]];
        let cumTimesteps = 0;
        const splits = outputSegments.map((s) => (cumTimesteps += s.timesteps));
        let currentSplitIdx = 0;
        let count = 0;
        for (let i = 0; i < ogDataLength; i += divisor) {
            if (i >= splits[currentSplitIdx]) {
                currentSplitIdx++;
                segments.push([]);
            }

            const tStep: Timestep = {
                idx: i,
                distance: outputTimesteps.distance[i],
                elevation: outputTimesteps.elevation[i],
                powerIn: outputTimesteps.power_in[i],
                speed: outputTimesteps.speed[i],
                time: 0,
                wPrimeBalance: outputTimesteps.w_prim_balance[i],
                yaw: outputTimesteps.yaw[i],
                segment: currentSplitIdx,
            };

            segments[currentSplitIdx].push(tStep);
            count++;
        }

        const temp: UserSerie<Timestep>[] = [];
        segments.forEach((s, i) => {
            [
                {
                    id: 'powerIn',
                    label: 'Power In',
                    data: s,
                    secondaryAxisId: 'powerIn',
                    color: '#fcb471',
                },
                {
                    id: 'power',
                    label: 'Power',
                    data: s,
                    secondaryAxisId: 'power',
                    color: '#fcb471',
                },
                {
                    id: 'speed',
                    label: 'Speed',
                    data: s,
                    secondaryAxisId: 'speed',
                    color: '#667dff',
                },
                {
                    id: 'wPrimeBalance',
                    label: "W' Balance",
                    data: s,
                    secondaryAxisId: 'wPrimeBalance',
                    color: '#667dff',
                },
                {
                    id: 'yaw',
                    label: 'Yaw',
                    data: s,
                    secondaryAxisId: 'yaw',
                    color: '#fcb471',
                },
                {
                    id: 'elevation',
                    label: 'Elevation',
                    data: s,
                    secondaryAxisId: 'elevation',
                    color: '#dddddd',
                },
            ].forEach((ser) => temp.push(ser));
        });
        setSampleDataLength(count);
        setSeries(temp);
    }, [outputSegments, outputTimesteps, ogDataLength]);

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
            max: outputTimesteps.distance[ogDataLength - 1],
        }),
        [ogDataLength, outputTimesteps],
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
                    color: '#ffa149',
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
                    color: '#fcb471',
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
                    color: '#566fff',
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
                    color: '#fcb471',
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

    const handleFocusDatum = useCallback(
        (datum: Datum<Timestep> | null) => {
            onHoverPointChange(
                datum ? datum.originalDatum.idx / ogDataLength : null,
            );
            setHoverSegment(datum ? datum.originalDatum.segment : null);
        },
        [onHoverPointChange, ogDataLength],
    );

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

    const options = useMemo(
        (): ChartOptions<Timestep> => ({
            data: deferredSeries,
            primaryAxis,
            secondaryAxes: secondaryAxes as unknown as AxisOptions<Timestep>[],
            memoizeSeries: false,
            getSeriesStyle(_series, status) {
                const ax = secondaryAxes.find(
                    (sax) => sax.id === _series.secondaryAxisId,
                );
                return {
                    ...ax?.styles,
                    opacity:
                        hoverSegment != null
                            ? _series.indexPerAxis === hoverSegment
                                ? 1
                                : 0.5
                            : 1,
                };
            },
            onFocusDatum: handleFocusDatum,
        }),
        [
            deferredSeries,
            handleFocusDatum,
            primaryAxis,
            secondaryAxes,
            hoverSegment,
        ],
    );

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
                {deferredSeries.length > 0 && <Chart options={options} />}
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
