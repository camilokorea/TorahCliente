// Agrupación por secciones según la posición del libro dentro de su testamento.
// Solo se aplica si el testamento tiene el número de libros esperado; si no, se muestra una sola lista.
const SECTIONS = {
    39: [
        ['Torah', 5],
        ['Libros históricos', 12],
        ['Poéticos y sapienciales', 5],
        ['Profetas mayores', 5],
        ['Profetas menores', 12],
    ],
    27: [
        ['Evangelios', 4],
        ['Hechos', 1],
        ['Cartas de Saulo', 13],
        ['Cartas generales', 8],
        ['Revelación', 1],
    ],
};

const SMALL_WORDS = new Set(['de', 'del', 'los', 'las', 'la', 'el', 'y', 'a']);

// "JOSUÉ - YaHoShúa" -> "Josué - YaHoShúa": solo cambia las palabras que vienen en mayúsculas.
export const displayName = (name = '') =>
    name
        .split(' ')
        .map((word, i) => {
            if (word !== word.toUpperCase() || !/\p{L}/u.test(word)) return word;
            const lower = word.toLocaleLowerCase('es');
            if (i > 0 && SMALL_WORDS.has(lower)) return lower;
            return lower.replace(/\p{L}/u, (c) => c.toLocaleUpperCase('es'));
        })
        .join(' ');

export const normalize = (text = '') =>
    text.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim();

const splitSections = (books) => {
    const plan = SECTIONS[books.length];
    if (!plan) return [{ title: null, books }];
    let start = 0;
    return plan.map(([title, count]) => {
        const section = { title, books: books.slice(start, start + count) };
        start += count;
        return section;
    });
};

export const buildIndex = (torah) => {
    const books = torah.libros.map((libro, order) => ({
        id: libro.id,
        order,
        name: displayName(libro.nombre),
        rawName: libro.nombre,
        abbreviation: libro.abreviacion,
        testament: libro.testamento,
        chapters: libro.capitulos,
        chapterCount: libro.capitulos.length,
        search: normalize(`${libro.nombre} ${libro.abreviacion}`),
    }));

    const bookById = new Map(books.map((b) => [b.id, b]));

    // Orden de testamentos según el primer libro de cada uno (Tanaj antes que Brit haDashá).
    const testamentNames = [...new Set(books.map((b) => b.testament))];
    const testaments = testamentNames.map((name) => {
        const testamentBooks = books.filter((b) => b.testament === name);
        return { name, books: testamentBooks, sections: splitSections(testamentBooks) };
    });

    const neighbor = (bookId, chapterNumber, step) => {
        const book = bookById.get(bookId);
        if (!book) return null;
        const pos = book.chapters.findIndex((c) => c.capituloNumero === chapterNumber);
        const target = book.chapters[pos + step];
        if (pos >= 0 && target) return { book, chapter: target.capituloNumero };
        const otherBook = books[book.order + step];
        if (!otherBook || !otherBook.chapters.length) return null;
        const edge = step > 0 ? otherBook.chapters[0] : otherBook.chapters[otherBook.chapters.length - 1];
        return { book: otherBook, chapter: edge.capituloNumero };
    };

    return {
        books,
        bookById,
        testaments,
        glosario: torah.glosario?.contenido ?? '',
        dedicatoria: torah.dedicatoria?.contenido ?? '',
        nextChapter: (bookId, chapter) => neighbor(bookId, chapter, 1),
        prevChapter: (bookId, chapter) => neighbor(bookId, chapter, -1),
    };
};
