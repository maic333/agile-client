"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var socket_message_1 = require("./types/socket-message");
var uuid_1 = require("uuid");
/**
 * Abstract client used to perform Request-Response communication over any type of connection
 */
var AgileClient = /** @class */ (function () {
    function AgileClient(requestTimeout) {
        // map each request to a Promise (each request is identified by a unique Transaction ID)
        this.requestPromiseMap = new Map();
        // map each request to corresponding timeout identifier
        this.requestTimeoutMap = new Map();
        // request timeout (in ms); defaults to 5 seconds
        this.requestTimeout = 5000;
        this.requestTimeout = requestTimeout || this.requestTimeout;
    }
    /**
     * TO BE OVERWRITTEN
     * Handle a received message. By default, always respond with an ACK
     */
    AgileClient.prototype.handleMessage = function (message, executor) {
        executor.resolve('OK');
    };
    /**
     * Send a message to a client
     */
    AgileClient.prototype.sendMessage = function (client, message) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            // generate a new Transaction ID
            var transactionId = uuid_1.v4();
            // create message in proper format
            var socketMessage = {
                transactionId: transactionId,
                type: socket_message_1.SocketMessageType.NEW_MESSAGE,
                payload: message
            };
            // send the JSON stringified message
            client.send(JSON.stringify(socketMessage));
            // resolve/reject the Promise when we get the response (see 'receiveMessage' method)
            _this.requestPromiseMap.set(transactionId, { resolve: resolve, reject: reject });
            // check for timeout
            var timeoutID = setTimeout(function () {
                // request timeout reached
                // reject Promise
                reject('Timeout');
                // remove Promise from the map
                _this.requestPromiseMap.delete(transactionId);
                // remove timeout from the map
                _this.requestTimeoutMap.delete(transactionId);
            }, _this.requestTimeout
            /* tslint:disable-next-line */
            );
            // keep a reference to this timeout so it can be removed when receiving the response
            _this.requestTimeoutMap.set(transactionId, timeoutID);
        });
    };
    /**
     * Handle a message received from a client
     */
    AgileClient.prototype.receiveMessage = function (client, message) {
        var _this = this;
        try {
            // convert message to the expected format
            var socketMessage_1 = JSON.parse(message);
            switch (socketMessage_1.type) {
                case socket_message_1.SocketMessageType.NEW_MESSAGE: {
                    // got a new message
                    // get the response
                    var responsePromise = new Promise(function (resolve, reject) {
                        _this.handleMessage(socketMessage_1.payload, { resolve: resolve, reject: reject });
                    });
                    responsePromise
                        .then(function (res) {
                        // send back a success response
                        var successResponse = {
                            transactionId: socketMessage_1.transactionId,
                            type: socket_message_1.SocketMessageType.MESSAGE_OK,
                            payload: res
                        };
                        client.send(JSON.stringify(successResponse));
                    })
                        .catch(function (err) {
                        // send back an error response
                        var successResponse = {
                            transactionId: socketMessage_1.transactionId,
                            type: socket_message_1.SocketMessageType.MESSAGE_NOK,
                            payload: err
                        };
                        client.send(JSON.stringify(successResponse));
                    });
                    break;
                }
                case socket_message_1.SocketMessageType.MESSAGE_OK: {
                    // got a success response
                    // remove the corresponding timeout event
                    var timeoutId = this.requestTimeoutMap.get(socketMessage_1.transactionId);
                    clearTimeout(timeoutId);
                    // remove timeout from the map
                    this.requestTimeoutMap.delete(socketMessage_1.transactionId);
                    var promiseExecutor = this.requestPromiseMap.get(socketMessage_1.transactionId);
                    if (promiseExecutor) {
                        // resolve the Promise
                        promiseExecutor.resolve(socketMessage_1.payload);
                        // remove Promise from the map
                        this.requestPromiseMap.delete(socketMessage_1.transactionId);
                    }
                    else {
                        // ignore unexpected message
                    }
                    break;
                }
                case socket_message_1.SocketMessageType.MESSAGE_NOK: {
                    // got an error response
                    // remove the corresponding timeout event
                    var timeoutId = this.requestTimeoutMap.get(socketMessage_1.transactionId);
                    clearTimeout(timeoutId);
                    // remove timeout from the map
                    this.requestTimeoutMap.delete(socketMessage_1.transactionId);
                    var promiseExecutor = this.requestPromiseMap.get(socketMessage_1.transactionId);
                    if (promiseExecutor) {
                        // reject the Promise
                        promiseExecutor.reject(socketMessage_1.payload);
                        // remove Promise from the map
                        this.requestPromiseMap.delete(socketMessage_1.transactionId);
                    }
                    else {
                        // ignore unexpected message
                    }
                    break;
                }
                default: {
                    // ignore unexpected message
                }
            }
        }
        catch (err) {
            // ignore wrongly formatted messages
        }
    };
    return AgileClient;
}());
exports.AgileClient = AgileClient;
