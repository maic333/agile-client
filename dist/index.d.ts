import { PromiseExecutor } from './types/promise-executor';
interface IClientT {
    send: (message: string) => any;
}
/**
 * Abstract client used to perform Request-Response communication over any type of connection
 */
export declare class AgileClient<ClientT extends IClientT> {
    private requestPromiseMap;
    private requestTimeoutMap;
    private requestTimeout;
    constructor(requestTimeout?: number);
    /**
     * TO BE OVERWRITTEN
     * Handle a received message. By default, always respond with an ACK
     */
    handleMessage(message: string, executor: PromiseExecutor<string>): void;
    /**
     * Send a message to a client
     */
    sendMessage(client: ClientT, message: string): Promise<string>;
    /**
     * Handle a message received from a client
     */
    receiveMessage(client: ClientT, message: string): void;
}
export {};
