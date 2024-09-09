import {FullscreenControl, GeolocateControl, Layer, Map, Marker, NavigationControl, ScaleControl, Source, Popup } from "react-map-gl/maplibre"
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
  
const polygonLayer = {
    'id': 'maine',
    'type': 'fill',
    'layout': {},
    'paint': {
        'fill-color': '#088',
        'fill-opacity': 0.8
    }
}

const multiSourceGeoJson = {
    'type': 'FeatureCollection',
    'features': [
        {
            'type': 'Feature',
            'geometry': {
                'type': 'Polygon',
                'coordinates': [
                    [
                      [
                        106.96051425975116,
                        -6.159461142606034
                      ],
                      [
                        106.95498747828788,
                        -6.236660225319895
                      ],
                      [
                        106.99234526684614,
                        -6.243117239818133
                      ],
                      [
                        106.99657063618974,
                        -6.234722826976494
                      ],
                      [
                        107.02093707899434,
                        -6.234400575094426
                      ],
                      [
                        107.02223391647505,
                        -6.24311856847882
                      ],
                      [
                        107.04270213017736,
                        -6.243119488318698
                      ],
                      [
                        107.04174091147382,
                        -6.194675798371264
                      ],
                      [
                        107.03980017622553,
                        -6.158493200017801
                      ],
                      [
                        107.02355760489468,
                        -6.144274894980299
                      ],
                      [
                        106.99788736674361,
                        -6.143303687816626
                      ],
                      [
                        106.96701499737952,
                        -6.148472697482134
                      ],
                      [
                        106.96051425975116,
                        -6.159461142606034
                      ]
                    ]
                  ]
            }
        },
        {
            "type": "Feature",
            "properties": {},
            "geometry": {
              "coordinates": [
                107.01248981683705,
                -6.1570886140342225
              ],
              "type": "Point"
            }
          },
          {
            "type": "Feature",
            "properties": {},
            "geometry": {
              "coordinates": [
                107.0237198205474,
                -6.165865752257005
              ],
              "type": "Point"
            }
          },
          {
            "type": "Feature",
            "properties": {},
            "geometry": {
              "coordinates": [
                107.01086905383659,
                -6.174238056625285
              ],
              "type": "Point"
            }
          },
          {
            "type": "Feature",
            "properties": {},
            "geometry": {
              "coordinates": [
                106.98479797993389,
                -6.161871919344776
              ],
              "type": "Point"
            }
          },
          {
            "type": "Feature",
            "properties": {},
            "geometry": {
              "coordinates": [
                106.99161292321332,
                -6.171844770087105
              ],
              "type": "Point"
            }
          },
          {
            "type": "Feature",
            "properties": {},
            "geometry": {
              "coordinates": [
                106.99723462217662,
                -6.149505917532821
              ],
              "type": "Point"
            }
          }
    ]
}

const multiFillLayer = {
    'id': 'park-boundary',
    'type': 'fill',
    'paint': {
        'fill-color': '#B42222',
        'fill-opacity': 0.4
    },
    'filter': ['==', '$type', 'Polygon']
}

const multiCircleLayer = {
    'id': 'park-volcanoes',
    'type': 'circle',
    'paint': {
        'circle-radius': 6,
        'circle-color': '#FFFFFF'
    },
    'filter': ['==', '$type', 'Point']
}

function BasicMapLibre() {
  const [showPopUp, setShowPopUp] = useState(false);
    return (
        <Map
            mapLib={maplibregl} 
            initialViewState={{
                longitude: 106.82636589700195,
                latitude: -6.167953604914047,
                zoom: 10
            }}
            width="100%"
            cursor="pointer"
            height="100%"
            mapStyle={OSM_MAP}
            
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

            <Source type="geojson" data={polygonGeoJson}>
                <Layer {...polygonLayer}/>
            </Source>
            <Source type="geojson" data={multiSourceGeoJson}>
                <Layer {...multiFillLayer} />
                <Layer {...multiCircleLayer}/>
            </Source>
            
            <GeolocateControl position="top-left" />
            <FullscreenControl position="top-left" />
            <NavigationControl position="top-left" />
            <ScaleControl />

        </Map>
    )
}

export default BasicMapLibre