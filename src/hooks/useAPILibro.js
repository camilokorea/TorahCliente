import { useState } from 'react';
import { useHttpCodes } from './useHttpCodes';

const API_URL = 'https://bibliaapi.comunidadmenorah.com/api/Libro/';
// const API_URL = 'https://localhost:7116/api/Libro/';

export const useApiLibro = () => {
    const {
        codigosHttp
    } = useHttpCodes();

    const [apiTorah, setApiTorah] = useState(null);
    const [loadingApiTorah, setLoadingApiTorah] = useState(false);
    const [errorLibros, setErrorLibros] = useState(null);

    const fetchTorah = async () => {
        setLoadingApiTorah(true);
        setErrorLibros(null);
        try {
            const response = await fetch(API_URL + 'get/torah');

            if (!response.ok) {
                setErrorLibros('Se produjo un error al tratar de obtener la Torah desde el servidor: ' + response.status + ' ' + codigosHttp[response.status]);
            } else {
                const data = await response.json();
                setApiTorah(data);
            }
        } catch (err) {
            setErrorLibros(err.message);
        } finally {
            setLoadingApiTorah(false);
        }
    };

    return {
        loadingApiTorah,
        errorLibros,
        apiTorah,
        fetchTorah
    };
};
