import jsonData from './uuidJson.js'

export function getShoeWeb(uuid) {
    return `https://www.snipes.es/p/${uuid}.html`
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