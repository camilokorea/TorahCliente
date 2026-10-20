const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://bibliaapi.ministeriomenorah.com/api/';

// La API no envía Content-Length; se usa un tamaño aproximado para la barra de progreso.
const APPROX_TORAH_BYTES = 4_400_000;

const fail = (what, response) => {
    throw new Error(`${what} (${response.status})`);
};

export const imagenRemotaUrl = (id) => `${API_BASE_URL}Imagen/${id}`;

export const fetchEstudios = async () => {
    const response = await fetch(API_BASE_URL + 'Estudio/publicados', { cache: 'no-store' });
    if (!response.ok) fail('No se pudieron consultar los estudios', response);
    return response.json();
};

export const fetchImagen = async (id) => {
    const response = await fetch(imagenRemotaUrl(id));
    if (!response.ok) fail('No se pudo descargar una imagen', response);
    return response.blob();
};

export const fetchUltimaVersion = async () => {
    const response = await fetch(API_BASE_URL + 'VersionControlador/ultimaversion', { cache: 'no-store' });
    if (!response.ok) fail('No se pudo consultar la versión', response);
    return response.json();
};

export const fetchTorah = async (onProgress) => {
    const response = await fetch(API_BASE_URL + 'Libro/get/torah', { cache: 'no-store' });
    if (!response.ok) fail('No se pudo descargar el texto', response);

    if (!onProgress || !response.body) {
        return response.json();
    }

    const total = Number(response.headers.get('Content-Length')) || APPROX_TORAH_BYTES;
    const reader = response.body.getReader();
    const chunks = [];
    let received = 0;

    for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        received += value.length;
        onProgress(Math.min(received / total, 0.97));
    }

    onProgress(1);
    const bytes = new Uint8Array(received);
    let offset = 0;
    for (const chunk of chunks) {
        bytes.set(chunk, offset);
        offset += chunk.length;
    }
    return JSON.parse(new TextDecoder().decode(bytes));
};
