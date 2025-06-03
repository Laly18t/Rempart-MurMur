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
    DEBUG: false,
    SCROLL_SPEED: 0.009, 
    MAX_TRANSLATION: 116,
    DEBUG_VOICEOVER: false,
    SOUND_OFF: 0.0,
    SOUND_ON: 0.8,
    DEFAULT_ZOOM: 4,
    PORTAL_SIZE: {
        WIDTH: 6.75555556, 
        HEIGHT: 3.8
    },
    AUDIO_MUTED: false,
    PORTAL_ENTER_DURATION: 0.5,
}

export const ASSETS = {
    TEXTURE_PARCHEMIN: '/texture_parchemin.png',
    WAR_FRAME: '/cadre_1942.webp',
    MODERN_FRAME: '/cadre_1697.webp',
    MEDIEVAL_FRAME: '/cadre_1317.webp',
    MEDIEVAL_BADGE: '/badge_1317.webp',
    MODERN_BADGE: '/badge_1789.webp',
    WAR_BADGE: '/badge_1942.webp',
}

export const INTERACTION = {
    ZOOM_SPEED: 0.03,
}

export const TEXTS = {
    TEMOIGNAGE_1:{
        NAME : 'Rémy, 20 ans',
        TEXT: 
        `"Mon conseil aux autres bénévoles serait 
de profiter de leur expérience, l'humain est au 
coeur de ce projet et les rencontres sont souvent 
riche de sens, d'expérience et de partage. 
Bon séjour ! "`
    }, 
    TEMOIGNAGE_2:{
        NAME : 'Lucie, 27 ans',
        TEXT: `"L'archéologie a toujours été un rêve 
et je suis fière d'avoir pu mettre de mon 
labeur pour aider dans la préservation 
d'un site historique. "`
    },
    TEMOIGNAGE_3:{
        NAME : 'Eve, 45 ans',
        TEXT: `" Super expérience, j'avais fait des chantiers 
de volontaires avec REMPART il y a 25 ans 
(volontaire et animatrice) et j'ai retrouvé 
cet été le même esprit d'ouverture aux autres, 
d'échange et de partage. 
Un vrai plaisir ! "`
    },
}

export const SOUND_DESIGN = {
    INTRO_MUSIC: '/audio/intro-music.mp3',
    PORTAL_ENTER: '/audio/portal-enter.wav',
    PORTAL_EXIT: '/audio/portal-exit.wav',
}

// chemin des audio
export const AUDIO_SEQUENCES = {
    STEP: {
        1: null,
        2: null,
        // 3: '/audio/voice/intro.mp3',
        // 4: '/audio/voice/1317_1.mp3',
        // 5: '/audio/voice/1697_2_1.mp3',
        // 6: '/audio/voice/1942_1_2.mp3',
        3: null,
        4: null,
        5: null,
        6: null,
        7: '/audio/voice/fin.mp3'
    },
    SCENE: {
        [EPOQUES.MEDIEVAL]: [
            '/audio/voice/1317_2.mp3',
            '/audio/voice/1317_3.mp3',
            '/audio/voice/1317_4.mp3',
            '/audio/voice/1697_1.mp3',
        ],
        [EPOQUES.MODERN]: [
            // '/audio/test-intro.mp3',
            '/audio/voice/1697_2_2.mp3',
            '/audio/voice/1697_3.mp3',
            '/audio/voice/1697_4.mp3',
            '/audio/voice/1942_1_1.mp3',
        ],
        [EPOQUES.WAR]: [
            // '/audio/test-intro.mp3',
            // '/audio/test-intro.mp3',
            // '/audio/test-intro.mp3',
            '/audio/voice/1942_2.mp3',
            '/audio/voice/1942_3.mp3',
            '/audio/voice/1942_4_1.mp3',
            '/audio/voice/1942_4_2.mp3',
            '/audio/voice/vide.mp3',
        ]
    }
}

export default { POSITIONS_ZOOM, POSITIONS_PARCHEMIN, SETTINGS, ASSETS, AUDIO_SEQUENCES, INTERACTION, TEXTS }
