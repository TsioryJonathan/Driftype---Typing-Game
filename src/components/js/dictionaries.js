const wordDictionaries = {
    en: {
        easy: ['the', 'be', 'to', 'of', 'and', 'with', 'this', 'from', 'they', 'will', 'word', 'good', 'time', 'year', 'work', 'life', 'place', 'after', 'thing', 'under', 'great', 'light', 'house', 'right', 'small', 'world'],
        medium: ['because', 'people', 'before', 'through', 'should', 'number', 'family', 'system', 'question', 'between', 'answer', 'school', 'country', 'example', 'morning', 'another'],
        hard: ['government', 'something', 'important', 'different', 'education', 'university', 'technology', 'experience', 'everything', 'development', 'environment', 'communication']
    },
    fr: {
        easy: ['le', 'la', 'les', 'est', 'sont', 'pour', 'dans', 'avec', 'mais', 'nous', 'vous', 'elle', 'tout', 'bien', 'rien', 'aime', 'voir', 'jours', 'temps', 'petit', 'grand', 'sous', 'mains', 'beaux', 'table'],
        medium: ['bonjour', 'maison', 'voiture', 'travail', 'famille', 'histoire', 'moment', 'personne', 'semaine', 'français', 'pendant', 'toujours', 'écrire', 'musique', 'lecture'],
        hard: ['maintenant', 'développer', 'université', 'différent', 'informatique', 'magnifique', 'restaurant', 'comprendre', 'appartement', 'administration', 'communication']
    },
    es: {
        easy: ['el', 'la', 'de', 'que', 'en', 'por', 'con', 'todo', 'pero', 'bien', 'algo', 'tú', 'nada', 'luz', 'casa', 'hoy', 'noche', 'voces', 'libro', 'manos', 'cosas', 'hasta', 'antes', 'sobre'],
        medium: ['tiempo', 'siempre', 'gracias', 'trabajo', 'después', 'español', 'momento', 'durante', 'primero', 'persona', 'familia', 'caminar', 'palabra'],
        hard: ['desarrollo', 'diferente', 'siguiente', 'necesario', 'estudiante', 'importante', 'tecnología', 'restaurante', 'comunicación', 'aprendizaje']
    },
    de: {
        easy: ['der', 'die', 'und', 'ist', 'von', 'sie', 'mit', 'für', 'aber', 'nach', 'mehr', 'haus', 'licht', 'nacht', 'leben', 'uhr', 'dunkel', 'woche', 'unter', 'dinge'],
        medium: ['arbeit', 'freund', 'wasser', 'sprache', 'familie', 'fenster', 'straße', 'morgen', 'abend', 'deutsch', 'zwischen', 'denken', 'lesen'],
        hard: ['geschichte', 'entwicklung', 'universität', 'wissenschaft', 'technologie', 'verschiedene', 'interessant', 'kommunikation', 'entscheidung']
    },
    it: {
        easy: ['il', 'la', 'che', 'per', 'con', 'una', 'sono', 'ma', 'hai', 'più', 'luna', 'tempo', 'notte', 'amico', 'luce', 'casa', 'gioco', 'vento', 'fuoco'],
        medium: ['grazie', 'lavoro', 'sempre', 'quando', 'italiano', 'momento', 'durante', 'famiglia', 'persona', 'settimana', 'scrivere', 'pensare'],
        hard: ['sviluppo', 'università', 'differente', 'tecnologia', 'importante', 'ristorante', 'bellissimo', 'significato', 'comunicazione']
    },
    pt: {
        easy: ['o', 'a', 'de', 'que', 'em', 'um', 'com', 'não', 'uma', 'bem', 'luz', 'vida', 'coisa', 'certo', 'tempo', 'hoje', 'falar', 'porta', 'festa', 'gente'],
        medium: ['trabalho', 'sempre', 'depois', 'durante', 'primeiro', 'pessoa', 'família', 'momento', 'obrigado', 'escrever', 'pensando'],
        hard: ['desenvolvimento', 'diferente', 'tecnologia', 'universidade', 'importante', 'restaurante', 'experiência', 'comunicação']
    },
    numbers: {
        easy: Array.from({length: 100}, () => String(Math.floor(Math.random() * 1000))),
        medium: Array.from({length: 100}, () => String(Math.floor(Math.random() * 10000))),
        hard: Array.from({length: 100}, () => String(Math.floor(Math.random() * 100000)))
    }
};


// Function to get words based on difficulty and language
export const getWordsByDifficulty = (mode, lang = 'en') => {
    if (lang === 'numbers') {
        const dictionary = wordDictionaries.numbers;
        const wordList = dictionary[mode];
        const words = [];
        const wordCount = 200;
        for (let i = 0; i < wordCount; i++) {
            const randomIndex = Math.floor(Math.random() * wordList.length);
            words.push(wordList[randomIndex]);
        }
        return words;
    }
    const dictionary = wordDictionaries[lang] || wordDictionaries['en'];
    const wordList = dictionary[mode] || dictionary['medium'];
    const words = [];
    const wordCount = 200;
    for (let i = 0; i < wordCount; i++) {
        const randomIndex = Math.floor(Math.random() * wordList.length);
        words.push(wordList[randomIndex]);
    }
    return words;
};

export const getRandomWord = (mode) => {
    const lang = document.getElementById('language').value;
    const wordList = getWordsByDifficulty(mode, lang);
    return wordList[Math.floor(Math.random() * wordList.length)];
};
