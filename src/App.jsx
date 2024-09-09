import reactLogo from './assets/image/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import { Link, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import MarkerPolygonLine from './pages/MarkerPolygonLine';
import ImageAndVideoOverlay from './pages/ImageAndVideoOverlay';
import Events from './pages/Events';
import DragableMarker from './pages/DragableMarkerLibre';
import BasicMap from './pages/BasicMap';
import BasicMapVector from './pages/BasicMapVector';
import MapLibreWithoutReactWrapper from './pages/MapLibreWithoutReactWrapper';
import LayerAndSourceExample from './pages/LayerAndSourceExample';
import MapGLComponentExample from './pages/MapGLComponentExample';
import Add3DModel from './pages/Add3DModel';


function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<BasicMap />} />
          <Route path="/base-map-vector" element={<BasicMapVector />} />
          <Route path="marker-polygon-line" element={<MarkerPolygonLine />} />
          <Route path="overlay-image" element={<ImageAndVideoOverlay />} />
          <Route path="events" element={<Events />} />
          <Route path="dragable-marker" element={<DragableMarker />} />
          <Route path="without-react-wrapper" element={<MapLibreWithoutReactWrapper />} />
          <Route path="layer-source-example" element={<LayerAndSourceExample />} />
          <Route path='mapgl-component' element={<MapGLComponentExample />} />
          <Route path='3d-object' element={<Add3DModel />} />



          {/* Using path="*"" means "match anything", so this route
                acts like a catch-all for URLs that we don't have explicit
                routes for. */}
          <Route path="*" element={<NoMatch />} />
        </Route>
      </Routes>
    </>
  )
}

function Layout() {
  const location = useLocation();
  const menuData = [
    { title: 'Base Map Example', url: '/' },
    { title: 'Base Map Vector Example', url: '/base-map-vector' },
    { title: 'Layer and Source Example', url: '/layer-source-example' },
    { title: 'React Map GL Component Example', url: '/mapgl-component' },
    { title: 'Overlay Image', url: '/overlay-image' },
    { title: 'Events', url: '/events' },
    { title: 'Marker, Polygon, and Line', url: '/marker-polygon-line' },
    { title: 'Dragable Marker', url: '/dragable-marker' },
    { title: 'Without React Wrapper', url: '/without-react-wrapper' },
    { title: '3d Object', url: '/3d-object' },

  ]
  return (
    <>
      <header>
        <div>
          <a href="https://vitejs.dev" target="_blank">
            <img src={viteLogo} className="logo" alt="Vite logo" />
          </a>
          <a href="https://react.dev" target="_blank">
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
        </div>
        <h1 id="title">Vite + React</h1>
        {/* A "layout route" is a good place to put markup you want to
            share across all the pages on your site, like navigation. */}
        <nav>
          <ul>
            {menuData?.map(({ title, url }) => (
              <li className={location.pathname === url ? 'page-opened' : ''} key={url}>
                <Link to={url}>{title}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <hr />
      </header>

      {/* An <Outlet> renders whatever child route is currently active,
          so you can think about this <Outlet> as a placeholder for
          the child routes we defined above. */}
      <main>
        <Outlet />
      </main>
    </>
  );
}

function NoMatch() {
  return (
    <div>
      <h2>Nothing to see here!</h2>
      <p>
        <Link to="/">Go to the home page</Link>
      </p>
    </div>
  );
}

export default App
