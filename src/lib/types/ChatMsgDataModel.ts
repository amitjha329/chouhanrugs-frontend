export type ChatMsgDataModel = {
    type: "customer" | "agent",
    message: string,
    date: string
}