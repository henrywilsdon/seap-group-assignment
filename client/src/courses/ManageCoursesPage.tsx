import { Wrapper } from '@googlemaps/react-wrapper';
import { Paper, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useEffect, useState } from 'react';
import HeightMap from './HeightMap';
import Map from './Map';
import MapCourse from './MapCourse';
import Marker from './Marker';
import mapJSON from './tokyo.json';
type Props = {};

export interface LatLngElev extends google.maps.LatLngLiteral {
    idx: number;
    elev: number;
}

export default function ManageCoursesPage({}: Props) {
    const [hoverPoint, setHoverPoint] = useState<{
        lat: number;
        lng: number;
    } | null>(null);
    const [points, setPoints] = useState<LatLngElev[][]>([]);
    const [splits, setSplits] = useState([1000]);

    useEffect(() => {
        const allPoints = mapJSON.features[0].geometry.coordinates[0];
        const _points: LatLngElev[][] = [[]];

        let split = 0;
        for (let i = 0; i < allPoints.length; i++) {
            const d = allPoints[i];
            if (splits.length > 0 && i >= splits[split]) {
                split++;
                _points.push([]);
            }

            _points[split].push({
                idx: i,
                lat: d[1],
                lng: d[0],
                elev: d[2],
            });
        }
        setPoints(_points);
    }, [splits]);

    const handleHoverPosChange = (latLng: google.maps.LatLngLiteral | null) => {
        console.log(latLng);
        setHoverPoint(latLng);
    };

    return (
        <div>
            ManageCoursesPage
            <Paper sx={{ m: 3, p: 2 }} variant="outlined">
                <Typography variant="h3" gutterBottom>
                    Test
                </Typography>
                <TextField label="Test" />
                <TextField label="Test2" />
            </Paper>
            {/* <Wrapper apiKey="AIzaSyDks89zgKUUG0qc_hixpNMndMj6hDOOGWw" >
                <Map
                    style={{ height: '600px', width: '900px' }}
                    zoom={14}
                    // center={tokyo.current}
                    zoomControl
                    // hoverPos={hoverPoint ? new google.maps.LatLng(hoverPoint[1], hoverPoint[0]) : null}
                    onHoverPosChange={handleHoverPosChange}
                >
                    {hoverPoint && <Marker position={hoverPoint} />}
                    {points.length > 0 && <MapCourse points={points} />}
                </Map>
            </Wrapper>
            <Box
                sx={{
                    height: '200px',
                    width: '900px',
                }}
            >
                <HeightMap
                    hoverPoint={hoverPoint}
                    onHoverPointChange={setHoverPoint}
                />
            </Box> */}
        </div>
    );
}
