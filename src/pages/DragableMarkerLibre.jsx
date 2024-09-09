import {Map, NavigationControl, Source, Layer, GeolocateControl, FullscreenControl } from "react-map-gl/maplibre"
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

const basePointGeojson = {
    type: 'FeatureCollection',
    features: [
        {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [106.82016488320335, -6.203719445771469]
            }
        }
    ]
}


const basePointLayer = {
    id: 'point',
    type: 'circle',
    paint: {
        'circle-radius': 30,
        'circle-color': '#3887be'
    }
}


function DragableMarker() {
    const mapRef = useRef();
    const map = mapRef?.current?.getMap();
    const [pointGeoJson, setPointGeoJson] = useState(basePointGeojson);
    const [pointLayer, setPointLayer] = useState(basePointLayer);
    const [cursor, setCursor] = useState('auto');
    const [coordinatDisplay, setCoordinatDisplay] = useState('none');
 
    // const onMapLoad = useCallback(() => {
    //     const map = mapRef?.current?.getMap();
    //     const canvas = map?.getCanvasContainer();
    //     // const coordinates = document.getElementById('coordinates');
    //     const pointGeojson = {
    //         'type': 'FeatureCollection',
    //         'features': [
    //             {
    //                 'type': 'Feature',
    //                 'geometry': {
    //                     'type': 'Point',
    //                     'coordinates': [106.82016488320335, -6.203719445771469]
    //                 }
    //             }
    //         ]
    //     };

    //     map.addSource('point', {
    //         'type': 'geojson',
    //         'data': pointGeojson
    //     });

    //     map.addLayer({
    //         'id': 'point',
    //         'type': 'circle',
    //         'source': 'point',
    //         'paint': {
    //             'circle-radius': 10,
    //             'circle-color': '#3887be'
    //         }
    //     });

    //     function onMove(e) {
    //         const coords = e.lngLat;
        
    //         // Set a UI indicator for dragging.
    //         canvas.style.cursor = 'grabbing';
        
    //         // Update the Point feature in `geojson` coordinates
    //         // and call setData to the source layer `point` on it.
    //         pointGeojson.features[0].geometry.coordinates = [coords.lng, coords.lat];
    //         map?.getSource('point')?.setData(pointGeojson);
    //     }
        
    //     function onUp(e) {
    //         // const coords = e.lngLat;
        
    //         // Print the coordinates of where the point had
    //         // finished being dragged to on the map.
    //         // coordinates.style.display = 'block';
    //         // coordinates.innerHTML =
    //         //     `Longitude: ${coords.lng}<br />Latitude: ${coords.lat}`;
    //         canvas.style.cursor = '';
        
    //         // Unbind mouse/touch events
    //         map.off('mousemove', onMove);
    //         map.off('touchmove', onMove);
    //     }
          

    //     // When the cursor enters a feature in the point layer, prepare for dragging.
    //     map?.on('mouseenter', 'point', () => {
    //         map?.setPaintProperty('point', 'circle-color', '#3bb2d0');
    //         canvas.style.cursor = 'move';
    //     });

    //     map?.on('mouseleave', 'point', () => {
    //         map?.setPaintProperty('point', 'circle-color', '#3887be');
    //         canvas.style.cursor = '';
    //     });

    //     map?.on('mousedown', 'point', (e) => {
    //         // Prevent the default map drag behavior.
    //         e.preventDefault();

    //         canvas.style.cursor = 'grab';

    //         map?.on('mousemove', onMove);
    //         map?.once('mouseup', onUp);
    //     });

    //     map.on('touchstart', 'point', (e) => {
    //         if (e.points.length !== 1) return;

    //         // Prevent the default map drag behavior.
    //         e.preventDefault();

    //         map?.on('touchmove', onMove);
    //         map?.once('touchend', onUp);
    //     });
   
    // }, [mapRef]);

    const onMove = useCallback((e) => {
        const coords = e.lngLat;
        // Set a UI indicator for dragging.
        setCursor('grabbing');
        
        // Update the Point feature in `geojson` coordinates
        // and call setData to the source layer `point` on it.
        setPointGeoJson((prev) => ({
            ...prev,
            features: [
                {
                    ...prev.features[0],
                    geometry: {
                        ...prev.features[0].geometry,
                        coordinates: [coords.lng, coords.lat]
                    }
                }
            ]
        }));
    }, [])

    const onUp = useCallback(() => {
        // Print the coordinates of where the point had
        // finished being dragged to on the map.

        setCoordinatDisplay('block');
        setCursor('auto');
    
        // Unbind mouse/touch events
        map.off('mousemove', onMove);
        map.off('touchmove', onMove);
    }, [map, onMove])

    const onMouseEnter = useCallback((event) => {
        const feature = event.features && event.features[0] && event.features[0].layer.id === 'point';
        if (feature) {
            setCursor('move');
            setPointLayer((prev) => ({
                ...prev,
                paint: {
                    ...prev.paint,
                    'circle-color': '#3bb2d0'
                }
            }));
        }
    }, []);
    const onMouseLeave = useCallback((event) => {
        const feature = event.features && event.features[0] && event.features[0].layer.id === 'point';
        if (feature) {
            event.preventDefault();
            setCursor('auto');
            setPointLayer((prev) => ({
                ...prev,
                paint: {
                    ...prev.paint,
                    'circle-color': '#3887be'
                }
            }));
        }
    }, []);

    const onMouseDown = useCallback((event) => {
        const feature = event.features && event.features[0] && event.features[0].layer.id === 'point';
        if (feature) {
            event.preventDefault();
            setCursor('grab');
            onMove(event);
            map?.on('mousemove', onMove);
            map?.once('mouseup', onUp);
        }
    }, [map, onMove, onUp]);

    const onTouchStart = useCallback((event) => {
        event.preventDefault();
        const feature = event.features && event.features[0] && event.features[0].layer.id === 'point';
        if (feature) {
            if (event.points.length !== 1) return;
            // Prevent the default map drag behavior.

            map?.on('mousemove', onMove);
            map?.once('mouseup', onUp);
        }
    }, [map, onUp, onMove]);
    return (
        <Map
            ref={mapRef}
            // onLoad={onMapLoad}
            maxPitch={85}
            onTouchStart={onTouchStart}
            onMouseDown={onMouseDown}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            cursor={cursor}
            mapLib={maplibregl} 
            initialViewState={{
                longitude: 106.82016488320335,
                latitude: -6.203719445771469,
                zoom: 5
            }}
            
            interactiveLayerIds={['point']}
            width="100%"
            height="100%"
            mapStyle={OSM_MAP}
            
        >  
            <GeolocateControl position="top-left" />
            <FullscreenControl position="top-left" />
            <NavigationControl position="top-left" />
            <Source type="geojson" data={pointGeoJson}>
                <Layer {...pointLayer}/>
            </Source> 
            <Coordinates coordinatDisplay={coordinatDisplay} lat={pointGeoJson.features[0].geometry.coordinates[1]} long={pointGeoJson.features[0].geometry.coordinates[0]}/>
        </Map>
    )
}


// eslint-disable-next-line react/prop-types
const Coordinates = ({ coordinatDisplay, lat, long }) => {
    const coordinatesStyle = {
        background: 'rgba(0, 0, 0, 0.5)',
        color: '#fffff',
        position: 'absolute',
        bottom: '40px',
        left: '10px',
        padding: '5px 10px',
        margin: 0,
        fontSize: '11px',
        lineHeight: '18px',
        borderRadius: '3px',
        display: coordinatDisplay
    }
    return (
        <pre id="coordinates" className="coordinates" style={coordinatesStyle}>
            Longitude: {long}<br />Latitude: {lat}
        </pre>
    );
}


export default DragableMarker