import {FullscreenControl, GeolocateControl, Layer, Map, NavigationControl, ScaleControl, Source } from "react-map-gl/maplibre"
import maplibregl from 'maplibre-gl';
import { useCallback, useRef } from "react";

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

function ImageAndVideoOverlay() { 

  const mapRef = useRef();

  const onMapLoad = useCallback(async () => {
    const map = mapRef?.current?.getMap();
    const image = await map?.loadImage('https://upload.wikimedia.org/wikipedia/commons/7/7c/201408_cat.png');
    map?.addImage('cat', image?.data);
    map?.addSource('point', {
      'type': 'geojson',
      'data': {
          'type': 'FeatureCollection',
          'features': [
              {
                  'type': 'Feature',
                  'geometry': {
                      'type': 'Point',
                      'coordinates': [107.4473693562266,
                        -6.465813992268096]
                  }
              }
          ]
      }
  });
  map?.addLayer({
      'id': 'points',
      'type': 'symbol',
      'source': 'point',
      'layout': {
          'icon-image': 'cat',
          'icon-size': 0.25
      }
  });
  }, [mapRef]);
  
  return (
      <Map
      id="myMap"
      ref={mapRef}
      onLoad={onMapLoad}
      mapLib={maplibregl} 
      initialViewState={{
          longitude: 106.82636589700195,
          latitude: -6.167953604914047,
          zoom: 10
      }}
      width="100%"
      height="100%"
      mapStyle={OSM_MAP}
          
    >            
      <GeolocateControl position="top-left" />
      <FullscreenControl position="top-left" />
      <NavigationControl position="top-left" />
      <Source type="image" url="https://maps.lib.utexas.edu/maps/historical/newark_nj_1922.jpg" coordinates={[
        
        [  // top left
          106.7461554050546,
          -6.17366085767992
        ],
       
        [ // top right
          106.90533769366255,
          -6.169459271674754
        ],
        [ // bottom right
          106.90252378417438,
          -6.253478740090799
        ],
        [ // bottom left
          106.74055775776378,
          -6.253477406830427
        ]
      ]}>
        <Layer type="raster" />
      </Source>
      <Source
        type="video"
        urls={[
          'https://upload.wikimedia.org/wikipedia/commons/f/f4/Demo_Video_Tutorial.webm'
        ]}
        coordinates={[
          [
            106.69479756499146,
            -6.320895664817641
          ],
          [
            107.06067775443648,
            -6.324397577330302
          ],
          [
            107.0638506789295,
            -6.526691060746842
          ],
          [
            106.68085878671695,
            -6.5304183168585865
          ]
        ]}
      >
        <Layer type="raster" />
      </Source>
      <ScaleControl />
      </Map>
  )
}

export default ImageAndVideoOverlay