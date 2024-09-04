import { ChatMsgDataModel } from "./ChatMsgDataModel";

type ChatMsgListDataModel = {
    _id: string;
    messages: ChatMsgDataModel[];
}

export default ChatMsgListDataModel