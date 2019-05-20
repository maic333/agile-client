"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SocketMessageType;
(function (SocketMessageType) {
    // new message emitted by a client
    SocketMessageType["NEW_MESSAGE"] = "NEW_MESSAGE";
    // success response for a previously emitted message
    SocketMessageType["MESSAGE_OK"] = "MESSAGE_OK";
    // error response for a previously emitted message
    SocketMessageType["MESSAGE_NOK"] = "MESSAGE_NOK";
})(SocketMessageType = exports.SocketMessageType || (exports.SocketMessageType = {}));
var SocketMessage = /** @class */ (function () {
    function SocketMessage() {
    }
    return SocketMessage;
}());
exports.SocketMessage = SocketMessage;
