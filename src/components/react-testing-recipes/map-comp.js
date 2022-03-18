import React from 'react'

function MapComponent(props) {
    return (
        <LoadScript id="script-loader" googleMapsApiKey="YOUR_API_KEY">
            <GoogleMap id="example-map" center={props.center} />
        </LoadScript>
    );
}

export default MapComponent