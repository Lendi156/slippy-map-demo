/* eslint-disable react/prop-types */
import {  Map, NavigationControl, Layer, Source, useControl } from "react-map-gl/maplibre"
import maplibregl from 'maplibre-gl';
import { useCallback, useEffect, useRef, useState } from "react";

// Raster Layer
const osmSource = {
  type: "raster",
  tiles: ["https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"],
  tileSize: 256,
  attribution: "&copy; OpenStreetMap Contributors",
  maxzoom: 19
}

const osmLayer =  {
  id: "raster",
  type: "raster",
  source: "raster" // This must match the source key above
}

// Bacground Layer
const backgroundLayer =  {
  id: "background",
  type: 'background',
  visibility: 'visible',
  paint: {
    'background-color': '#475fbf',
    'background-opacity': 1
  }
}


// Fill Layer
const polygonGeoJson =   {
  "type": "Feature",
  "properties": {},
  "geometry": {
    "coordinates": [
      [
        [
          106.8261509155804,
          -6.1741853578465395
        ],
        [
          106.7597771522963,
          -6.245699829224506
        ],
        [
          106.89461453685738,
          -6.241746562134438
        ],
        [
          106.8261509155804,
          -6.1741853578465395
        ]
      ]
    ],
    "type": "Polygon"
  }
}

const fillLayer = {
  'id': 'fill',
  'type': 'fill',
  'layout': {},
  'paint': {
      'fill-color': '#088',
      'fill-opacity': 0.8
  }
}

// Circle Layer
const circleSource = {
  "type": "Feature",
  "properties": {},
  "geometry": {
    "coordinates": [
      107.01248981683705,
      -6.1570886140342225
    ],
    "type": "Point"
  }
}

const circleLayer = {
  'id': 'circle',
  'type': 'circle',
  'paint': {
      'circle-radius': 10,
      'circle-color': '#fcba03'
  }
}

// Heat Map Layer
const heatMapLayer =  {
  'id': 'heatmap',
  'type': 'heatmap',
  'source': 'earthquakes',
  'maxzoom': 9,
  'paint': {
      // Increase the heatmap weight based on frequency and property magnitude
      'heatmap-weight': [
          'interpolate',
          ['linear'],
          ['get', 'mag'],
          0,
          0,
          6,
          1
      ],
      // Increase the heatmap color weight weight by zoom level
      // heatmap-intensity is a multiplier on top of heatmap-weight
      'heatmap-intensity': [
          'interpolate',
          ['linear'],
          ['zoom'],
          0,
          1,
          9,
          3
      ],
      // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
      // Begin color ramp at 0-stop with a 0-transparancy color
      // to create a blur-like effect.
      'heatmap-color': [
          'interpolate',
          ['linear'],
          ['heatmap-density'],
          0,
          'rgba(33,102,172,0)',
          0.2,
          'rgb(103,169,207)',
          0.4,
          'rgb(209,229,240)',
          0.6,
          'rgb(253,219,199)',
          0.8,
          'rgb(239,138,98)',
          1,
          'rgb(178,24,43)'
      ],
      // Adjust the heatmap radius by zoom level
      'heatmap-radius': [
          'interpolate',
          ['linear'],
          ['zoom'],
          0,
          2,
          9,
          20
      ],
      // Transition from heatmap to circle layer by zoom level
      'heatmap-opacity': [
          'interpolate',
          ['linear'],
          ['zoom'],
          7,
          1,
          9,
          0
      ]
  }
}

const heatMapSource = {
  "type": "FeatureCollection",
  "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
  "features": [
    { "type": "Feature", "properties": { "id": "ak16994521", "mag": 2.3, "time": 1507425650893, "felt": null, "tsunami": 0 }, "geometry": { "type": "Point", "coordinates": [106.44463869263967, -6.329279922264362] } },
    { "type": "Feature", "properties": { "id": "ak16994519", "mag": 1.7, "time": 1507425289659, "felt": null, "tsunami": 0 }, "geometry": { "type": "Point", "coordinates": [106.80799824794423, -6.511157556967518] } },
    { "type": "Feature", "properties": { "id": "ak16994517", "mag": 1.6, "time": 1507424832518, "felt": null, "tsunami": 0 }, "geometry": { "type": "Point", "coordinates": [106.66803753034532, -7.088440895657882] } }
  ]
};


// Line Layer
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

// Symbol Layer
const symbolSource =  {
  'type': 'Feature',
  'geometry': {
    'type': 'Point',
    'coordinates': [107.26556213239985, -6.513831741033641]
  }
};
const symbolLayer = {
  'id': 'symbol',
  'type': 'symbol',
  'source': 'symbol', // reference the data source
  'layout': {
      'icon-image': 'cat', // reference the image
      'icon-size': 0.25
  }
}

// Hillshade Layer
const hillShadeLayer = {
  'id': 'hillshade',
  'source': 'hillshade',
  'type': 'hillshade'
}

// Fill extrussion Layer
const fillExtrussionLayer = {
  'id': 'extrussion',
  'type': 'fill-extrusion',
  'source': 'extrussion',
  'paint': {
      // See the MapLibre Style Specification for details on data expressions.
      // https://maplibre.org/maplibre-style-spec/expressions/

      // Get the fill-extrusion-color from the source 'color' property.
      'fill-extrusion-color': ['get', 'color'],

      // Get fill-extrusion-height from the source 'height' property.
      'fill-extrusion-height': ['get', 'height'],

      // Get fill-extrusion-base from the source 'base_height' property.
      'fill-extrusion-base': ['get', 'base_height'],

      // Make extrusions slightly opaque for see through indoor walls.
      'fill-extrusion-opacity': 0.5
  }
}

const fillExtrussionSource = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
        "properties": {
          "level": 1,
          "name": "Dinding",
          "height": 6000,
          "base_height": 3000,
          "color": "gray"
        },
        "geometry": {
          "coordinates": [
            [
              [
                106.94567648728486,
                -6.254340067040445
              ],
              [
                106.94535948665089,
                -6.281439156882243
              ],
              [
                106.98783757163011,
                -6.280808961488702
              ],
              [
                106.98720357036211,
                -6.253394724561133
              ],
              [
                106.98339956275134,
                -6.253394724561133
              ],
              [
                106.98371656338531,
                -6.276712672846472
              ],
              [
                106.94948049489415,
                -6.277973072783112
              ],
              [
                106.94948049489415,
                -6.2546551808198245
              ],
              [
                106.94567648728486,
                -6.254340067040445
              ]
            ]
          ],
          "type": "Polygon"
        },
        "id": "91ab1ee01729c33568c7b57eb258e699"
    },
    {
      "type": "Feature",
        "properties": {
          "level": 1,
          "name": "lantai",
          "height": 3000,
          "base_height": 3000,
          "color": "blue"
        },
        "geometry": {
          "coordinates": [
            [
              [
                106.98730227195063,
                -6.253296595186029
              ],
              [
                106.94577518887337,
                -6.253611709594338
              ],
              [
                106.94577518887337,
                -6.281656130249786
              ],
              [
                106.98825327385259,
                -6.281025935120439
              ],
              [
                106.98730227195063,
                -6.253296595186029
              ]
            ]
          ],
          "type": "Polygon"
        },
        "id": "91ab1ee01729c33568c7b57eb258e610"
    },
    {
      "type": "Feature",
        "properties": {
          "level": 1,
          "name": "Dinding kiri",
          "height": 6000,
          "base_height": 3000,
          "color": "gray"
        },
        "geometry": {
          "coordinates": [
            [
              [
                106.94581095399195,
                -6.253522514525471
              ],
              [
                106.94581095399195,
                -6.2555602977220275
              ],
              [
                106.96171884000734,
                -6.2555602977220275
              ],
              [
                106.96171884000734,
                -6.253522514525471
              ],
              [
                106.94581095399195,
                -6.253522514525471
              ]
            ]
          ],
          "type": "Polygon"
        },
        "id": "91ab1ee01729c33568c7b57eb258e611"
    },
    {
      "type": "Feature",
        "properties": {
          "level": 1,
          "name": "Dinding kanan",
          "height": 6000,
          "base_height": 3000,
          "color": "gray"
        },
        "geometry": {
          "coordinates": [
            [
              [
                106.98336668489293,
                -6.253196468477228
              ],
              [
                106.97065677596379,
                -6.253196468477228
              ],
              [
                106.97065677596379,
                -6.255641808884164
              ],
              [
                106.98336668489293,
                -6.255641808884164
              ],
              [
                106.98336668489293,
                -6.253196468477228
              ]
            ]
          ],
          "type": "Polygon"
        },
        "id": "91ab1ee01729c33568c7b57eb258e612"
    },
    {
      "type": "Feature",
        "properties": {
          "level": 1,
          "name": "Atas pintu",
          "height": 6000,
          "base_height": 5500,
          "color": "gray"
        },
        "geometry": {
          "coordinates": [
            [
              [
                106.96180083941857,
                -6.253685537474084
              ],
              [
                106.96180083941857,
                -6.255641808884164
              ],
              [
                106.97065677596379,
                -6.255641808884164
              ],
              [
                106.97065677596379,
                -6.253685537474084
              ],
              [
                106.96180083941857,
                -6.253685537474084
              ]
            ]
          ],
          "type": "Polygon"
        },
        "id": "91ab1ee01729c33568c7b57eb258e613"
    }
  ]
}



function LayerAndSourceExample() {
  const mapRef = useRef();
  const [visibility, setVisibility] = useState({
    'background': true,
    'raster': true,
    'fill': true,
    'circle': true,
    'heatmap': true,
    'line': true,
    'symbol': true,
    'hillshade': true,
    'extrussion': true
  });

  const [isImageLoaded, setImageLoaded] = useState(false);
  
  const onMapLoad = useCallback(async () => {
    const map = mapRef?.current?.getMap();
    const image = await map?.loadImage('https://upload.wikimedia.org/wikipedia/commons/7/7c/201408_cat.png');
    map.addImage('cat', image?.data);
    setImageLoaded(true)
  }, [mapRef]);
  
  const goToHill = () => {
    mapRef?.current?.flyTo({center: [11.39085, 47.27574]});
  }

  useEffect(() => {
    const allLayerId = [
      'background',
      'raster',
      'fill',
      'circle',
      'heatmap',
      'line',
      'symbol',
      'hillshade',
      'extrussion'
    ];
    const map = mapRef?.current?.getMap();

    allLayerId?.forEach((id) => {
      if (visibility[id]) {
        map?.setLayoutProperty(id, 'visibility', 'visible');
      } else {
        map?.setLayoutProperty(id, 'visibility', 'none');
      }
    })
  }, [visibility])

  // const layerListOpened = Object.keys(visibility).filter(key => visibility[key]);
  
    return (
      <Map
        ref={mapRef}
        onLoad={onMapLoad}
        mapLib={maplibregl} 
        initialViewState={{
            longitude: 106.82016488320335,
            latitude: -6.203719445771469,
          zoom: 7
        }}
            
      >
        <NavigationControl position="top-left" />
        <Layer id="background" {...backgroundLayer} />       
        <Source id="raster" type="raster" {...osmSource}>
          <Layer {...osmLayer}  key={1} />
        </Source>
        <Source id="fill" type="geojson" data={polygonGeoJson}>
          <Layer {...fillLayer} />
        </Source>
        <Source id="circle" type="geojson" data={circleSource}>
          <Layer {...circleLayer} />
        </Source>
        <Source id="heatmap" type="geojson" data={heatMapSource}>
          <Layer {...heatMapLayer} /> 
        </Source>
        <Source id="line" type="geojson" data={lineGeoJson}>
          <Layer {...lineLayer} />
        </Source>
        {isImageLoaded && <Source id="symbol" type="geojson" data={symbolSource}>
          <Layer {...symbolLayer} />
        </Source>}
        <Source id="hillshade" type="raster-dem" url="https://demotiles.maplibre.org/terrain-tiles/tiles.json" tileSize={256} >
          <Layer {...hillShadeLayer} />
        </Source>
        <Source id="extrussion" type="geojson" data={fillExtrussionSource} >
          <Layer {...fillExtrussionLayer} />
        </Source>
        <ButtonControl goToHill={goToHill} />
        <LayerControl setVisibility={setVisibility} visibility={visibility}/>
      </Map>
    )
}

const LayerControl = ({ setVisibility, visibility }) => {
  const layer = [
    'background',
    'raster',
    'fill',
    'circle',
    'heatmap',
    'line',
    'symbol',
    'hillshade',
    'extrussion'
  ]
  const onVisibilityChange = (name, value) => {
    setVisibility((prev) => ({...prev, [name]: value}));
  };
  return (
    <div className="control-panel">
    {layer.map(name => (
      <div key={name} className="input">
        <label>{name}</label>
        <input
          type="checkbox"
          checked={visibility[name]}
          onChange={evt => onVisibilityChange(name, evt.target.checked)}
        />
      </div>
    ))}
  </div>
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

function ButtonControl({ goToHill }) {
  const onClick = () => {
    goToHill()
  };
  useControl(() => new ButtonCheckControl('Check Hill Shade', () => onClick()), {position: 'bottom-right',});
  return null;
}


export default LayerAndSourceExample