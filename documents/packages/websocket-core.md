[← Back to Documentation Landing Page](/)

# `@wireflowapp/websocket-core`

> Framework-agnostic native browser & Node.js WebSocket engine featuring managed reconnections, status tracking, and event routing.

[![npm version](https://img.shields.io/npm/v/@wireflowapp/websocket-core.svg)](https://www.npmjs.com/package/@wireflowapp/websocket-core)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](../../LICENSE)

`@wireflowapp/websocket-core` provides high-performance, resilient native WebSocket management without any dependency on React or Vue. It directly powers [`@wireflowapp/react-websocket`](./react-websocket) and [`@wireflowapp/vue-websocket`](./vue-websocket), and can be used directly in vanilla TypeScript, Node.js, and other frameworks.

---

## Installation

```bash
# Using pnpm
pnpm add @wireflowapp/websocket-core @wireflowapp/core

# Using npm
npm install @wireflowapp/websocket-core @wireflowapp/core

# Using yarn
yarn add @wireflowapp/websocket-core @wireflowapp/core
```

---

## Key Features

- **Standard W3C WebSocket API**: Interacts directly with the native browser or environment WebSocket implementation.
- **Automated Reconnection**: Integrates `@wireflowapp/core`'s `RetryManager` to automatically reconnect when sockets terminate unexpectedly.
- **Stale Event Discarding**: Prevents older or replaced socket instances from firing duplicate callbacks or interfering with fresh connections.
- **Type-Safe Event Subscriptions**: Supports typed event handlers for `"open"`, `"close"`, `"error"`, `"message"`, and `"statusChange"`.
- **Instance Registry**: Includes `WebSocketManager` for storing and cleanly disposing multiple named client instances.

---

## Usage Example

```ts
import { WebSocketClient } from "@wireflowapp/websocket-core";

// 1. Create client instance
const client = new WebSocketClient("wss://echo.websocket.events", {
  autoConnect: true,
  retryAttempts: 5,
  retryDelay: 3000,
  protocols: ["v1.proto"],
  binaryType: "arraybuffer",
  onStatusChange: (status) => {
    console.log("Current status:", status); // "Idle" | "Connecting" | "Connected" | "Failed"
  },
  onMessage: (event) => {
    console.log("Received data:", event.data);
  },
});

// 2. Subscribe to specific events
const unsub = client.on("message", (event) => {
  console.log("Incoming message listener:", event.data);
});

// 3. Send data when connected
if (client.status === "Connected") {
  client.send(JSON.stringify({ type: "ping" }));
}

// 4. Manually trigger disconnect
client.disconnect();

// 5. Clean teardown
client.dispose();
```

---

## Multi-Instance Management (`WebSocketManager`)

When managing multiple distinct WebSocket endpoints across a complex application, use `WebSocketManager`:

```ts
import { WebSocketManager } from "@wireflowapp/websocket-core";

const manager = new WebSocketManager();

// Register multiple endpoints
const chatClient = manager.getOrCreate("chat", "wss://chat.example.com/ws");
const telemetryClient = manager.getOrCreate("telemetry", "wss://metrics.example.com/ws");

// Disconnect and clean up specific client
manager.remove("chat");

// Clean teardown for all clients simultaneously
manager.clear();
```

---

## API Reference

### `WebSocketOptions`

Extends `WireFlowConfig` with native WebSocket options:

```ts
export interface WebSocketOptions extends WireFlowConfig {
  protocols?: string | string[];
  binaryType?: BinaryType;
  onOpen?: (event: Event) => void;
  onClose?: (event: CloseEvent) => void;
  onError?: (event: Event) => void;
  onMessage?: (event: MessageEvent) => void;
  onStatusChange?: (status: ConnectionStatus) => void;
}
```

### `IWebSocketClient` Properties

| Property | Type | Description |
| :--- | :--- | :--- |
| `status` | `ConnectionStatus` (`"Idle"` \| `"Connecting"` \| `"Connected"` \| `"Failed"`) | Current connection state. |
| `isReconnecting` | `boolean` | `true` when reconnection attempts are actively running following a drop or manual `retry()`. |
| `isReconnectFailed` | `boolean` | `true` when retry attempts have exhausted and connection reached `"Failed"`. |
| `isReconnected` | `boolean` | `true` when connection succeeds after a previous disconnect/retry. |
| `socket` | `WebSocket \| null` | Underlying browser WebSocket instance. |
| `url` | `string` | Target WebSocket endpoint URL. |

### `IWebSocketClient` Methods

| Method | Signature | Description |
| :--- | :--- | :--- |
| `connect()` | `() => void` | Initiates connection attempt to the target URL. |
| `retry()` | `() => void` | Triggers a fresh reconnection attempt. |
| `disconnect()` | `() => void` | Gracefully closes socket and cancels scheduled retry timers. |
| `send(data)` | `(data: WebSocketDataType) => boolean` | Sends payload data over the active socket (`string`, `ArrayBuffer`, `Blob`). |
| `on(event, listener)` | `(event, listener) => () => void` | Adds typed event listener; returns unsubscriber function. |
| `off(event, listener)` | `(event, listener) => void` | Removes typed event listener. |
| `once(event, listener)` | `(event, listener) => () => void` | Registers a one-time event listener. |
| `dispose()` | `() => void` | Complete cleanup: closes socket, cancels retries, removes listeners. |

---

## Next Steps

- Use in React: [`@wireflowapp/react-websocket`](./react-websocket)
- Use in Vue 3: [`@wireflowapp/vue-websocket`](./vue-websocket)
- Back to [Documentation Index](/)
