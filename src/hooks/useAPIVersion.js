import { useState } from 'react';
import { useHttpCodes } from './useHttpCodes';

const API_URL = 'https://bibliaapi.comunidadmenorah.com/api/VersionControlador/';
// const API_URL = 'https://localhost:7116/api/VersionControlador/';

export const useApiVersion = () => {
    const {
        codigosHttp
    } = useHttpCodes();

    const [lastVersion, setLastVersion] = useState(null);
    const [loadingVersion, setLoadingVersion] = useState(false);
    const [errorVersion, setErrorVersion] = useState(null);

    const fetchUltimaVersion = async () => {
        setLoadingVersion(true);
        setErrorVersion(null);
        try {
            const response = await fetch(API_URL + 'ultimaversion');

            if (!response.ok) {
                setErrorVersion('Error obteniendo ultima version: ' + response.status + ' ' + codigosHttp[response.status]);
            } else {
                const data = await response.json();
                setLastVersion(data);
            }
        } catch (err) {
            setErrorVersion(err.message);
        } finally {
            setLoadingVersion(false);
        }
    };

    return {
        lastVersion,
        loadingVersion,
        errorVersion,
        fetchUltimaVersion
    };
};
