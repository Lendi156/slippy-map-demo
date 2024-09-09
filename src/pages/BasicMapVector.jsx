import {Map, NavigationControl } from "react-map-gl/maplibre"
import maplibregl from 'maplibre-gl';

function BasicMapLibre() {
    return (
        <Map
            mapLib={maplibregl} 
            initialViewState={{
                longitude: 106.82016488320335,
                latitude: -6.203719445771469,
                zoom: 5
            }}
            mapStyle="https://demotiles.maplibre.org/style.json"
            
        >
            <NavigationControl position="top-left" />
        </Map>
    )
}

export default BasicMapLibre