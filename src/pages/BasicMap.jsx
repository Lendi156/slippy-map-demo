import {  Map, NavigationControl } from "react-map-gl/maplibre"
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
  // sky: {
  //     "sky-color": "#199EF3",
  //     "sky-horizon-blend": 0.5,
  //     "horizon-color": "#ffffff"
  //   },
  layers: [
    {
      id: "osm",
      type: "raster",
      source: "osm" // This must match the source key above
    }
  ]
};

function BasicMapLibre() {
  // let llb = new LngLatBounds(
  //   new LngLat(-73.9876, 40.7661),
  //   new LngLat(-73.9397, 40.8002)
  // );
  // console.log(llb)
    return (
      <Map
        mapLib={maplibregl}
        initialViewState={{
            longitude: 106.82016488320335,
            latitude: -6.203719445771469,
            zoom: 5
        }}
        mapStyle={OSM_MAP}
            
      >
        <NavigationControl position="top-left" />

      </Map>
    )
}

export default BasicMapLibre