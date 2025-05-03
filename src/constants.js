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
        date: '1749'
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
    SCROLL_SPEED: 0.04, 
    MAX_TRANSLATION: 100,
    DEBUG_VOICEOVER: false,
    SOUND_OFF: 0.0,
    SOUND_ON: 0.8,
}

export const TEXTS = {
    INTRO: 'blablabla blabla'
}

export const ASSETS = {
    TEXTURE_PARCHEMIN: '/texture_parchemin.png',
    WAR_FRAME: '/cadre_1942.png' 
}

export const INTERACTION = {
    ZOOM_SPEED: 0.03,
}

// chemin des audio
export const AUDIO_SEQUENCES = {
    'intro': ['/audio/rempart-intro.mp3'],
    [EPOQUES.MEDIEVAL]: ['/audio/rempart-1317.mp3', ],
    [EPOQUES.MODERN]: ['/audio/rempart-1789.mp3'],
    [EPOQUES.WAR]: ['/audio/rempart-1942.mp3'],
    'outro': ['/audio/rempart-fin.mp3'],
}

export default { POSITIONS_ZOOM, POSITIONS_PARCHEMIN, SETTINGS, ASSETS, AUDIO_SEQUENCES, INTERACTION }
