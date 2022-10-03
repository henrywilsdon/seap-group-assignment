import { Box } from '@mui/system';
import { useCallback } from 'react';
import { Datum } from 'react-charts';
import CourseMap from './CourseMap';
import HeightMap from './HeightMap';
import mapJSON from './tokyo.json';
import { LatLngElev, useMapState } from './useMapState';

type Props = {};

export default function ManageCoursesPage({}: Props) {
    const {
        points,
        splits,
        hoverPoint,
        hoverSplitIdx,
        setHoverPoint,
        addSplit,
    } = useMapState(
        mapJSON.features[0].geometry.coordinates[0] as [
            number,
            number,
            number,
        ][],
    );

    const handleHeightMapClick = useCallback(
        (point: Datum<LatLngElev> | null) => {
            const newSplitPointIdx = point?.originalDatum?.idx || null;
            addSplit(newSplitPointIdx);
        },
        [addSplit],
    );

    return (
        <div>
            <CourseMap
                points={points}
                splits={splits}
                hoverPoint={hoverPoint}
                hoverSplitIdx={hoverSplitIdx}
            />
            <Box
                sx={{
                    height: '200px',
                    width: '900px',
                }}
            >
                <HeightMap
                    points={points}
                    splits={splits}
                    onHoverPointChange={setHoverPoint}
                    onClick={handleHeightMapClick}
                />
            </Box>
        </div>
    );
}
