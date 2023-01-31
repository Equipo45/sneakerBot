import jsonData from './uuidJson.js'

export function getShoeWeb(uuid) {
    return `https://www.asos.com/es/prd/${uuid}`
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