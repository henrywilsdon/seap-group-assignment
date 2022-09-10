import { Wrapper } from '@googlemaps/react-wrapper';
import { Box } from '@mui/system';
import { hover } from '@testing-library/user-event/dist/hover';
import { useEffect, useState } from 'react';
import HeightMap from './HeightMap';
import Map from './Map';
import Marker from './Marker';

type Props = {};

export default function ManageCoursesPage({}: Props) {
    const [hoverPoint, setHoverPoint] = useState<{
        lat: number;
        lng: number;
    } | null>(null);

    return (
        <div>
            ManageCoursesPage
            <Wrapper apiKey="AIzaSyDks89zgKUUG0qc_hixpNMndMj6hDOOGWw">
                <Map
                    style={{ height: '600px', width: '900px' }}
                    zoom={14}
                    // center={tokyo.current}
                    zoomControl
                    // hoverPos={hoverPoint ? new google.maps.LatLng(hoverPoint[1], hoverPoint[0]) : null}
                >
                    {hoverPoint && <Marker position={hoverPoint} />}
                </Map>
            </Wrapper>
            <Box
                sx={{
                    height: '200px',
                    width: '900px',
                }}
            >
                <HeightMap onHoverPointChange={setHoverPoint} />
            </Box>
        </div>
    );
}
