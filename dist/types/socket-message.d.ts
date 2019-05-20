export declare enum SocketMessageType {
    NEW_MESSAGE = "NEW_MESSAGE",
    MESSAGE_OK = "MESSAGE_OK",
    MESSAGE_NOK = "MESSAGE_NOK"
}
export declare class SocketMessage {
    transactionId: string;
    type: SocketMessageType;
    payload: string;
}
