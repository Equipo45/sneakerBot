

export class PropertyNotFoundError extends Error {
    constructor(propertyName, uuid) {
        super(`${propertyName} in id ${uuid.toUpperCase()}`)
        this.name = "PropertyNotFou"
    }
}