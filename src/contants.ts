export const dev = Boolean(process.env.FUNCTIONS_EMULATOR);
export const location = 'us-central1'
export const FIREBASE_CONFIG = JSON.parse(process.env.FIREBASE_CONFIG || '')
export const IMAGE_VERSIONS = [{
    type: 'x3',
    width: 1800,
    height: 2400
},
{
    type: 'x2',
    width: 1200,
    height: 1600
},
{
    type: 'x1',
    width: 600,
    height: 800
},
{
    type: 'thumb',
    width: 400,
    height: 250
},
]