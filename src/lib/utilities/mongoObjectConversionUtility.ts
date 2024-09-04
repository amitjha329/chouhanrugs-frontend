import { ObjectId } from 'mongodb'
export function _id(hex?: string) {
    if (hex?.length !== 24) return new ObjectId()
    return new ObjectId(hex)
}
const converter = {
    /** Takes a mongoDB object and returns a plain old JavaScript object */
    from<T = Record<string, unknown>>(object: Record<string, any>): T {
        const newObject: Record<string, unknown> = {}
        for (const key in object) {
            const value = object[key]
            if (key === "_id") {
                newObject.id = value.toHexString()
            } else if (key === "userId") {
                newObject[key] = value.toHexString()
            } else {
                newObject[key] = value
            }
        }
        return newObject as T
    },
    /** Takes a plain old JavaScript object and turns it into a mongoDB object */
    to<T = Record<string, unknown>>(object: Record<string, any>) {
        const newObject: Record<string, unknown> = {
            _id: _id(object.id),
        }
        for (const key in object) {
            const value = object[key]
            if (key === "userId") newObject[key] = _id(value)
            else if (key === "id") continue
            else newObject[key] = value
        }
        return newObject as T & { _id: ObjectId }
    },

    fromWithNoFieldChange<T = Record<string, unknown>>(object: Record<string, any>, ...otherFields: string[]): T {
        const newObject: Record<string, unknown> = {}
        for (const key in object) {
            const value = object[key]
            if (key === "_id") {
                newObject[key] = value.toString()
            } else if ((otherFields.includes(key) || key === "userId")) {
                newObject[key] = value.toString()
            } else {
                newObject[key] = value
            }
        }
        return newObject as T
    },

    fromAlgoliaHitToData<T = Record<string, unknown>>(object: Record<string, any>): T {
        const newObject: Record<string, unknown> = {}
        for (const key in object) {
            const value = object[key]
            if (key === "objectID") {
                newObject["_id"] = value
            } else {
                newObject[key] = value
            }
        }
        return newObject as T
    }
}

export default converter