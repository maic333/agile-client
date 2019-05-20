# Agile Client

> A JavaScript / TypeScript abstract client used to perform Request-Response communication over any type of connection (including WebSockets, or any TCP connection)

## Installation

```sh
npm install git+https://github.com/maic333/agile-client.git --save
```

## Usage

### Example: Using the AC (Agile Client) with a [WebSocket](https://www.npmjs.com/package/ws) server

> **Step 1**: Create the AC instance, providing the request client used for communication (in this case it's WebSocket)

```typescript
import { AgileClient } from 'agile-client/dist';
import * as WebSocket from 'ws';
...

// create the AC instance
const ac = new AgileClient<WebSocket>();
```

> **Step 2** (optional): Overwrite the default message handler of the AC
> * by default, it returns a success message (ACK) for every request

```typescript
import { PromiseExecutor } from 'agile-client/dist/types/promise-executor';
...

// overwrite the default message handler of the AC
ac.handleMessage = (message: string, executor: PromiseExecutor<string>) => {
  // check for errors
  if (message === 'error') {
    return executor.reject('Error message');
  }

  // return the result
  executor.resolve(JSON.stringify({
    result: 'OK'
  }));
};
```

> **Step 3**: Configure the AC to handle the messages received on the established connection
> * in this example we are using a WebSocket connection, but you can configure the AC similarly for any other protocol

```typescript
// create the WebSocket server
const wsServer = new WebSocket.Server(config);

// listen for new connections
wsServer.on('connection', (wsClient: WebSocket) => {
  // listen for new messages from client
  wsClient.on('message', (message: string) => {
    // configure the AC to handle received messages
    ac.receiveMessage(wsClient, message);
  });
});
```

> **Step 4**: Use the AC to send messages and wait for the response
> * in this example, 'targetClient' is a WebSocket client, but it can be any client that implements a 'send' method for sending messages to other clients

```typescript
ac.sendMessage(targetClient, message)
  .then((result) => {
    // got a response
    console.log(result);
  })
  .catch((error) => {
    // something went wrong
    console.log(error);
  })
```

## License

ISC
