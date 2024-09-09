import {  Map, NavigationControl, Layer } from "react-map-gl/maplibre"
import maplibregl from 'maplibre-gl';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

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

function Add3DModel() {

    const getLayer = () => {
        const modelOrigin = [106.82016488320335, -6.203719445771469];
        const modelAltitude = 0;
        const modelRotate = [Math.PI / 2, Math.PI * 0, Math.PI * 0];
        const modelAsMercatorCoordinate = maplibregl.MercatorCoordinate.fromLngLat(
            modelOrigin,
            modelAltitude
        );
        
        // transformation parameters to position, rotate and scale the 3D model onto the map
        const modelTransform = {
            translateX: modelAsMercatorCoordinate.x,
            translateY: modelAsMercatorCoordinate.y,
            translateZ: modelAsMercatorCoordinate.z,
            rotateX: modelRotate[0],
            rotateY: modelRotate[1],
            rotateZ: modelRotate[2],
            /* Since our 3D model is in real world meters, a scale transform needs to be
            * applied since the CustomLayerInterface expects units in MercatorCoordinates.
            */
            scale: modelAsMercatorCoordinate.meterInMercatorCoordinateUnits() * 3
        };
        
        const customLayer = {
            id: '3d-model',
            type: 'custom',
            renderingMode: '3d',
            onAdd(map, gl) {
                this.camera = new THREE.Camera();
                this.scene = new THREE.Scene();
        
                // create two three.js lights to illuminate the model
                const directionalLight = new THREE.DirectionalLight(0xffffff);
                directionalLight.position.set(0, -70, 100).normalize();
                this.scene.add(directionalLight);
        
                const directionalLight2 = new THREE.DirectionalLight(0xffffff);
                directionalLight2.position.set(0, 70, 100).normalize();
                this.scene.add(directionalLight2);
        
                // use the three.js GLTF loader to add the 3D model to the three.js scene
                const loader = new GLTFLoader();
                loader.load(
                    '/truckFlat.glb',
                    (gltf) => {
                        this.scene.add(gltf.scene);
                    }
                );
                this.map = map;
        
                // use the MapLibre GL JS map canvas for three.js
                this.renderer = new THREE.WebGLRenderer({
                    canvas: map.getCanvas(),
                    context: gl,
                    antialias: true
                });
        
                this.renderer.autoClear = false;
            },
            render(gl, matrix) {
                const rotationX = new THREE.Matrix4().makeRotationAxis(
                    new THREE.Vector3(1, 0, 0),
                    modelTransform.rotateX
                );
                const rotationY = new THREE.Matrix4().makeRotationAxis(
                    new THREE.Vector3(0, 1, 0),
                    modelTransform.rotateY
                );
                const rotationZ = new THREE.Matrix4().makeRotationAxis(
                    new THREE.Vector3(0, 0, 1),
                    modelTransform.rotateZ
                );
        
                const m = new THREE.Matrix4().fromArray(matrix);
                const l = new THREE.Matrix4()
                    .makeTranslation(
                        modelTransform.translateX,
                        modelTransform.translateY,
                        modelTransform.translateZ
                    )
                    .scale(
                        new THREE.Vector3(
                            modelTransform.scale,
                            -modelTransform.scale,
                            modelTransform.scale
                        )
                    )
                    .multiply(rotationX)
                    .multiply(rotationY)
                    .multiply(rotationZ);
        
                this.camera.projectionMatrix = m.multiply(l);
                this.renderer.resetState();
                this.renderer.render(this.scene, this.camera);
                this.map.triggerRepaint();
            }
        };
        return customLayer;
    };

    return (
        <Map
            mapLib={maplibregl}
            initialViewState={{
                longitude: 106.82016488320335,
                latitude: -6.203719445771469,
                zoom: 18,
                antialias: true,
                pitch: 60
            }}
            mapStyle={OSM_MAP}
      >
            <NavigationControl position="top-left" />
            <Layer {...getLayer()} />
      </Map>
    )
}

export default Add3DModel