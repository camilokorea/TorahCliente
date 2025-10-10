import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import React, { useEffect, useState, useMemo } from 'react';
import { useDb } from './hooks/useDb';
import { useApiLibro } from './hooks/useAPILibro';
import { useApiVersion } from './hooks/useAPIVersion';
import { ToastContainer, toast } from 'react-toastify';
import { Routes, Route, useNavigate} from 'react-router-dom';

import BottomMenuComponent from './components/BottomMenuComponent';
import LibroComponent from './components/LibroComponent';
import BibliaComponent from './components/BibliaComponent';
import DedicatoriaComponent from './components/DedicatoriaComponent';
import GlosarioComponent from './components/GlosarioComponent';

function App() {
  const [data, setData] = useState(null);
  const [librosAntiguoTestamento, setLibrosAntiguoTestamento] = useState([]);
  const [librosNuevoTestamento, setLibrosNuevoTestamento] = useState([]);
  const [testamentos, setTestamentos] = useState([]);
  const [dedicatoria, setDedicatoria] = useState(null);
  const [glosario, setGlosario] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const navigate = useNavigate();
  
  const {
    torah,
    version,
    setVersion,
    loadingDb,
    loadingDbLibros,
    loadingDbVersion,
    loadingDbInsertVersion,
    loadingDbInsertarLibro,
    errorDb,
    queryTorah,
    queryVersion,
    insertTorah,
    insertUltimaVersion
  } = useDb();

  const {
    lastVersion,
    loadingVersion,
    errorVersion,
    fetchUltimaVersion
  } = useApiVersion();

  const {
    loadingApiTorah,
    errorLibros,
    apiTorah,
    fetchTorah
  } = useApiLibro();

  const updateOnlineStatus = async () => {
    setIsOnline(navigator.onLine);

    if (navigator.onLine) {
      await queryVersion();
    }
  };

  useEffect(() => {
    async function initialLoad() {
      await queryVersion();
      await queryTorah();
      window.addEventListener('online', updateOnlineStatus);
      window.addEventListener('offline', updateOnlineStatus);
    }

    initialLoad();
  }, []);

  useEffect(() => {
    if (torah.length > 0) {
      setData(torah);
    } else {
      if (isOnline === true) {
        fetchTorah();
      }
    }
  }, [torah]);

  useEffect(() => {
    if (loadingDbVersion) {
      toast.info("Cargando datos de version instalada en dispositivo", { position: "bottom-right" });
    }
  }, [loadingDbVersion]);

  useEffect(() => {
    if (loadingApiTorah) {
      toast.info("Cargando datos de version en el servidor", { position: "bottom-right" });
    }
  }, [loadingApiTorah]);

  useEffect(() => {
    if (loadingDbLibros) {
      toast.info("Cargando de la Torah instalada en dispositivo", { position: "bottom-right" });
    }
  }, [loadingDbLibros]);

  useEffect(() => {
    if (loadingDb) {
      toast.info("Inicializando base de datos en dispositivo", { position: "bottom-right" });
    }
  }, [loadingDb]);

  useEffect(() => {
    if (loadingVersion) {
      toast.info("Inicializando base de datos en dispositivo", { position: "bottom-right" });
    }
  }, [loadingVersion]);

  useEffect(() => {
    if (errorLibros) {
      toast.error("Hubo un problema cargando los datos de la Torah del servidor", { position: "bottom-right" });
    }
  }, [errorLibros]);

  useEffect(() => {
    if (errorVersion) {
      toast.error("Hubo un problema cargando datos de la ultima version en el servidor", { position: "bottom-right" });
    }
  }, [errorVersion]);

  useEffect(() => {
    if (loadingDbInsertVersion) {
      toast.info("Salvando datos de version en dispositivo", { position: "bottom-right" });
    }
  }, [loadingDbInsertVersion]);

  useEffect(() => {
    if (loadingDbInsertarLibro) {
      toast.info("Salvando datos de Torah descargados en dispositivo", { position: "bottom-right" });
    }
  }, [loadingDbInsertarLibro]);

  useEffect(() => {
    if (errorDb) {
      toast.error("Error de aplicacion: " + errorDb, { position: "bottom-right" });
    }
  }, [errorDb]);

  useEffect(() => {
    if (version !== false) {
      if (isOnline === true) {
        fetchUltimaVersion();
      }
    }
  }, [version]);

  useMemo(async () => {
    if (lastVersion !== null) {
      if (version === undefined) {
        await insertUltimaVersion(lastVersion);
        setVersion(lastVersion);
      }

      if (version) {
        if (version.version < lastVersion.version) {
          await insertUltimaVersion(lastVersion);
          setVersion(lastVersion);
          if (isOnline === true) {
            await fetchTorah();
          }
        }
      }
    }
  }, [lastVersion]);

  useMemo(async () => {
    insertTorah(apiTorah);
    await queryTorah();
  }, [apiTorah]);

  useEffect(() => {
    if (data) {
      if (data[0]) {
        setTestamentos(data[0].testamentos.sort((a, b) => b.localeCompare(a)));
        setDedicatoria(data[0].dedicatoria);
        setGlosario(data[0].glosario);

        setLibrosAntiguoTestamento(data[0].libros.filter(item => {
          return item.testamento == data[0].testamentos[0];
        }));

        setLibrosNuevoTestamento(data[0].libros.filter(item => {
          return item.testamento == data[0].testamentos[1];
        }));
      }
    }
  }, [data]);

  const onSelect = (option) => {
    navigate(option);
  };

  return (
    <div className="app">
      <ToastContainer />
      <Routes>
        <Route path="/" element={<BibliaComponent librosAntiguoTestamento={librosAntiguoTestamento} librosNuevoTestamento={librosNuevoTestamento} testamentos={testamentos} />} />
        <Route path="/libro/:id" element={<LibroComponent />} />
        <Route path="/dedicatoria" element={<DedicatoriaComponent dedicatoria={dedicatoria}/>} />
        <Route path="/glosario" element={<GlosarioComponent glosario={glosario} />} />
      </Routes>
      <BottomMenuComponent onSelect={onSelect} isOnline={isOnline} version={version?.version} />
    </div>
  );
}

// Register Service Worker for PWA functionality
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('./service-worker.js')
      .then(registration => console.log('ServiceWorker registered: ', registration))
      .catch(error => console.log('ServiceWorker registration failed: ', error));
  });
}

export default App;
