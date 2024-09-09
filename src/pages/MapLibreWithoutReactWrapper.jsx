import { useEffect, useRef, useState } from 'react'
import maplibregl from 'maplibre-gl';

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

function MapLibreWithoutReactWrapper() {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng] = useState(106.82016488320335);
    const [lat] = useState(-6.203719445771469);
    const [zoom] = useState(5);

    useEffect(() => {
        if (map.current) return; // stops map from intializing more than once
      
        map.current = new maplibregl.Map({
            container: mapContainer.current,
            style: OSM_MAP,
            center: [lng, lat],
            zoom: zoom
        });
        map.current.addControl(new maplibregl.NavigationControl());
    }, [lng, lat, zoom]);
    
    const mapWrapStyle = {
        position: 'relative',
        width: '100%',
        height: '100%'
    }
    const mapStyle = {
        position: 'absolute',
        width: '100%',
        height: '100%'
    }
  return (
    <div className="map-wrap" style={mapWrapStyle}>
        <div ref={mapContainer} className="map" style={mapStyle}/>
    </div>
  )
}

export default MapLibreWithoutReactWrapper