export const EPOQUES = {
    MEDIEVAL: 'monde-medieval',
    MODERN: 'monde-moderne',
    WAR: 'monde-guerre'
}


export const DATA = {
    medieval: {
        name: EPOQUES.MEDIEVAL,
        date: '1317'
    },
    moderne: {
        name: EPOQUES.MODERN,
        date: '1786'
    },
    guerre: {
        name: EPOQUES.WAR,
        date: '1942'
    },
}

// A REFAIRE pour simplifier - mettre en MAJ
export const POSITIONS_ZOOM = {
    [EPOQUES.MEDIEVAL]: [35, 0, 4],
    [EPOQUES.MODERN]: [65, 0, 4],
    [EPOQUES.WAR]: [95, 0, 4],
}
export const POSITIONS_PARCHEMIN = {
    [EPOQUES.MEDIEVAL]: [35, 0, 0],
    [EPOQUES.MODERN]: [65, 0, 0],
    [EPOQUES.WAR]: [95, 0, 0],
}

export const SETTINGS = {
    DEBUG: true,
    SCROLL_SPEED: 0.009, 
    MAX_TRANSLATION: 116,
    DEBUG_VOICEOVER: false,
    SOUND_OFF: 0.0,
    SOUND_ON: 0.8,
    DEFAULT_ZOOM: 4,
    PORTAL_SIZE: {
        WIDTH: 6.75555556, 
        HEIGHT: 3.8
    }
}

export const TEXTS = {
    LOADER: "Ceci est un exemple de texte de chargement qui peut être remplacé par n'importe quelle autre phrase.",
    INTRO: 'blablabla blabla'
}

export const ASSETS = {
    TEXTURE_PARCHEMIN: '/texture_parchemin.png',
    WAR_FRAME: '/cadre_1942.png',
    MODERN_FRAME: '/cadre_1789.png',
    MEDIEVAL_FRAME: '/cadre_1317.png',
    MEDIEVAL_BADGE: '/badge_1317.png',
    MODERN_BADGE: '/badge_1789.png',
    WAR_BADGE: '/badge_1942.png',
}

export const INTERACTION = {
    ZOOM_SPEED: 0.03,
}

// chemin des audio
export const AUDIO_SEQUENCES = {
    STEP: {
        1: null,
        // 2: null,
        3: null,
        2: '/audio/rempart-intro.mp3', 
        // 2: '/audio/test-intro.mp3',
        // 3: '/audio/test-intro.mp3',
        4: null,
        5: null,
        6: '/audio/rempart-fin.mp3'
    },
    SCENE: {
        [EPOQUES.MEDIEVAL]: [
            // '/audio/rempart-1317.mp3',
            '/audio/test-intro.mp3',
            // '/audio/test-intro.mp3',
            // '/audio/rempart-1317_4.mp3',
            // '/audio/rempart-1317_5.mp3',
        ],
        [EPOQUES.MODERN]: [
            // '/audio/rempart-1789.mp3',
            // '/audio/test-intro.mp3',
            // '/audio/test-intro.mp3',
            // '/audio/test-intro.mp3',
            // null,
        ],
        [EPOQUES.WAR]: [
            // '/audio/test-intro.mp3',
            // null,
        ]
    },
    FX: {

    }
}

export default { POSITIONS_ZOOM, POSITIONS_PARCHEMIN, SETTINGS, ASSETS, AUDIO_SEQUENCES, INTERACTION }
