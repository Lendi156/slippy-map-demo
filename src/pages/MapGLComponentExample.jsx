import {FullscreenControl, GeolocateControl, Layer, Map, Marker, NavigationControl, ScaleControl, Source, Popup, MapProvider, AttributionControl, useControl, useMap } from "react-map-gl/maplibre"
import maplibregl from 'maplibre-gl';
import { useState } from "react";


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
    },
  },
  layers: [
    {
      id: "osm",
      type: "raster",
      source: "osm" // This must match the source key above
    }
  ]
};

const lineGeoJson = {
    "type": "Feature",
    "properties": {},
    "geometry": {
        "coordinates": [
            [
                106.5259841604165,
                -6.354683752969933
            ],
            [
                107.50666845729029,
                -6.417574936805721
            ]
        ],
        "type": "LineString"
    }
};
  
const lineLayer = {
    id: 'line',
    type: 'line',
    paint: {
        'line-color': '#000000',
        'line-width': 2, 
    }
}
  
function MapGLComponentExample() {
    const [showPopUp, setShowPopUp] = useState(false);
    // Two maps could be firing 'move' events at the same time, if the user interacts with one
    // while the other is in transition.
    // This state specifies which map to use as the source of truth
    // It is set to the map that received user input last ('movestart')
    // const [activeMap, setActiveMap] = useState('left');

    // const onLeftMoveStart = useCallback(() => setActiveMap('left'), []);
    // const onRightMoveStart = useCallback(() => setActiveMap('right'), []);
  
    return (
        <MapProvider>
            <div className="map-provider-container">
                <Map
                    id="leftMap"
                    mapLib={maplibregl} 
                    initialViewState={{
                        longitude: 106.82636589700195,
                        latitude: -6.167953604914047,
                        zoom: 10,
                        pitch: 30}}
                    style={
                        {
                            position: 'absolute',
                            width: '50%',
                            height: '100%'
                        }
                    }
                    cursor="pointer"
                    mapStyle={OSM_MAP}
                    // onMoveStart={onLeftMoveStart}
                    // onMove={activeMap === 'left' && onMove}
            >
                <Marker
                draggable={true}
                longitude={106.82636589700195}
                latitude={-6.167953604914047}
                anchor="center"
                onClick={(e) => {
                    e.originalEvent.stopPropagation();
                    setShowPopUp(true);
                }}
                />
                {showPopUp && <Popup longitude={106.82636589700195} latitude={-6.167953604914047} anchor="bottom" onClose={() => setShowPopUp(false)}>
                <span className="popup">You are here</span>
                </Popup>}
                

                    <Source type="geojson" data={lineGeoJson}>
                        <Layer {...lineLayer}/>
                    </Source> 
                    <GeolocateControl position="top-left" />
                    <FullscreenControl position="top-left" />
                    <NavigationControl position="top-left" />
                    <ScaleControl />

                </Map>
                <Map
                    id="rightMap"
                    initialViewState={{
                        longitude: 106.82636589700195,
                        latitude: -6.167953604914047,
                        zoom: 10,
                        pitch: 30
                    }}
                    // onMoveStart={onRightMoveStart}
                    attributionControl={false}
                    // onMove={activeMap === 'right' && onMove}
                    style={
                        {
                            position: 'absolute',
                            left: '50%',
                            width: '50%',
                            height: '100%'
                        }
                    }
                    mapStyle="https://demotiles.maplibre.org/style.json"
                >
                    <ButtonControl />
                    <AttributionControl customAttribution={`Map provided by <a href="https://maplibre.org/">MapLibre hehehe</a>`} compact={true} style={{ color: 'black'}}/>
                </Map>
            </div>
            
        </MapProvider>
        
    )
}

class ButtonCheckControl {
    constructor(text, callback) {
      this._text = text;
      this._callback = callback;
    }
    onAdd(map) {
        this._map = map;
        this._container = document.createElement('button');
        this._container.className = 'maplibregl-ctrl';
        this._container.addEventListener("contextmenu", (e) => e.preventDefault());
        this._container.addEventListener("click", () => this._callback());
        this._container.textContent = this._text;
        return this._container;
    }
  
    onRemove() {
        this._container.parentNode.removeChild(this._container);
        this._map = undefined;
    }
  }

function ButtonControl() {

    const {leftMap, rightMap} = useMap();

    const onClick = () => {
        leftMap.flyTo({center: [116.82252222222222,
            -0.9121611111111111]});
        rightMap.flyTo({center: [ 101.69946966919008,
            3.153488789435528]});
    };
    useControl(() => new ButtonCheckControl('Go to IKN and Kuala Lumpur', () => onClick()), {position: 'top-right',});
    return null;
  }
  

export default MapGLComponentExample