import React, { useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { Wrapper, Status } from '@googlemaps/react-wrapper';
import Map from './Map';

type Props = {};

export default function ManageCoursesPage({}: Props) {
    return (
        <div>
            ManageCoursesPage
            <Wrapper apiKey="AIzaSyDks89zgKUUG0qc_hixpNMndMj6hDOOGWw">
                <Map
                    style={{ height: '1000px', width: '1000px' }}
                    zoom={5}
                    // center={tokyo.current}
                    zoomControl
                />
            </Wrapper>
        </div>
    );
}
