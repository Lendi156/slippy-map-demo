import {Map, NavigationControl, Marker } from "react-map-gl/maplibre"
import maplibregl from 'maplibre-gl';
import { useCallback, useRef, useState } from "react";

const OSM_MAP = {
  version: 8,
  name: "MapLibre Demo Tiles",
  sources: {
    "osm": {
      type: "raster",
      tiles: ["https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"],
      tileSize: 256,
      attribution: "&copy; OpenStreetMap Contributors",
      maxzoom: 19
    }
  },
  layers: [
    {
      id: "osm",
      type: "raster",
      source: "osm" // This must match the source key above
    }
  ]
  };
  

function Events() {
    const mapRef = useRef();
    const[latLong, setLatLong] = useState([0, 0]);
    const [showMarker, setShowMarker] = useState(false);
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            setLatLong([position.coords.latitude, position.coords.longitude]);
        })
    }
    const onMapLoad = useCallback(() => {
        const map = mapRef?.current?.getMap();
       
        map.on('click', () => {
            map.flyTo({
                center: [latLong[1], latLong[0]],
                zoom: 14
            });
            setTimeout(() => setShowMarker(true), 1000);
        });
    }, [mapRef, latLong]);
    
    return (
        <Map
            ref={mapRef}
            mapLib={maplibregl} 
            onLoad={onMapLoad}
            initialViewState={{
                longitude: 106.82016488320335,
                latitude: -6.203719445771469,
                zoom: 5
            }}
            width="100%"
            height="100%"
            mapStyle={OSM_MAP}
            
        >  
            {showMarker && <Marker latitude={latLong[0]} longitude={latLong[1]} anchor="center"/>}
            <NavigationControl position="top-left" />
        </Map>
    )
}

export default Events