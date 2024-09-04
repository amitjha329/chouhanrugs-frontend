type AckResponse = {
    ack: boolean,
    result: {
        code: "SUCCESS" | "ERROR" | "NO_DATA",
        data: any
    }
}

export interface AckWithReturn<T> {
    ack: boolean,
    result: {
        code: "SUCCESS" | "ERROR" | "NO_DATA",
        data: T
    }
}

export default AckResponse