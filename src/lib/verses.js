// Los versículos vienen con su número al inicio del texto ("1 En el principio...").
// Algunos están partidos en dos entradas: la segunda no trae número y continúa la anterior.
// Se usa el número del texto (no la posición) y los fragmentos se unen a su versículo.
const LEADING_NUMBER = /^\s*(\d{1,3})(?:[\s.:]+|(?=\p{L}))(.*)$/su;

export const parseVerses = (raw = []) => {
    const verses = [];

    for (const entry of raw) {
        const text = (entry ?? '').trim();
        if (!text) continue;

        const last = verses[verses.length - 1];
        const expected = last ? last.n + 1 : 1;
        const match = text.match(LEADING_NUMBER);
        const n = match ? Number(match[1]) : null;

        // Un número que no avanza la secuencia es parte del texto ("110 años"), no un versículo nuevo.
        if (n !== null && (n === expected || (last && n > last.n) || (!last && n >= 1))) {
            verses.push({ n, text: match[2].trim() });
        } else if (last) {
            last.text = `${last.text} ${text}`;
        } else {
            verses.push({ n: 1, text });
        }
    }

    return verses;
};
