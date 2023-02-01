import jsonData from './uuidJson.js'

export function getShoeWeb(uuid) {
    return `https://www.solebox.com/en_ES/p/${uuid}.html`
}

export function getShoeObject(key){
    return {
        name:key,
        uuid:jsonData[key]
    }
}

export function getAllKeys() {
    return Object.keys(jsonData)
}