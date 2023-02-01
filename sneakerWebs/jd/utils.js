import jsonData from './uuidJson.js'

export function getShoeWeb(uuid) {
    return `https://www.jdsports.es/product/!/${uuid}_jdsportses/`
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