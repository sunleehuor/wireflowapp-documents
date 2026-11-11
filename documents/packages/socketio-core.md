[← Back to Documentation Landing Page](../README.md)

# `@wireflowapp/socketio-core`

> Framework-agnostic client engine wrapping `socket.io-client` with Wireflow's 4-state lifecycle, retry mapping, and instance registries.

[![npm version](https://img.shields.io/npm/v/@wireflowapp/socketio-core.svg)](https://www.npmjs.com/package/@wireflowapp/socketio-core)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](../../LICENSE)

`@wireflowapp/socketio-core` provides seamless integration with Socket.IO servers. It maps Socket.IO's internal manager events to Wireflow's standardized `"Idle" | "Connecting" | "Connected" | "Failed"` state machine and provides unified lifecycle controls.

---

## Installation

```bash
# Using pnpm
pnpm add @wireflowapp/socketio-core @wireflowapp/core socket.io-client

# Using npm
npm install @wireflowapp/socketio-core @wireflowapp/core socket.io-client

# Using yarn
yarn add @wireflowapp/socketio-core @wireflowapp/core socket.io-client
```

---

## Key Features

- **Direct Socket.IO Manager Mapping**: Maps Wireflow options (`retryAttempts`, `retryDelay`) directly to Socket.IO's built-in reconnection configuration (`reconnectionAttempts`, `reconnectionDelay`).
- **Normalized Status**: Replaces raw Socket.IO event soup (`connect`, `disconnect`, `connect_error`, `reconnect_failed`) with a single, clear `status` property.
- **Manual Disconnect Suppression**: Prevents unwanted automatic reconnections when a socket is explicitly closed by `disconnect()`.
- **Custom Event Channeling**: Type-safe `emit`, `on`, `off`, and `once` wrappers with automatic subscriber cleanup.
- **Multi-Instance Registry**: Includes `SocketIOManager` for managing multiple Socket.IO namespaces and endpoints.

---

## Usage Example

```ts
import { SocketIOClient } from "@wireflowapp/socketio-core";

// 1. Initialize client
const client = new SocketIOClient("http://localhost:3000", {
  autoConnect: true,
  retryAttempts: 5,
  retryDelay: 3000,
  socketOptions: {
    transports: ["websocket"],
    auth: { token: "secret-token" },
  },
  onStatusChange: (status) => console.log("Socket.IO status:", status),
  onConnect: () => console.log("Connected to server!"),
  onDisconnect: (reason) => console.log("Disconnected:", reason),
});

// 2. Subscribe to custom server events
const unsubscribe = client.on("chat_message", (data) => {
  console.log("Chat received:", data);
});

// 3. Emit custom events with arbitrary parameters
client.emit("chat_message", { text: "Hello from SocketIOClient!" });

// 4. Manually disconnect or trigger retry
client.disconnect();
client.retry();

// 5. Clean teardown
unsubscribe();
client.dispose();
```

---

## Multi-Instance Management (`SocketIOManager`)

```ts
import { SocketIOManager } from "@wireflowapp/socketio-core";

const manager = new SocketIOManager();

// Manage multiple namespace connections
const mainSocket = manager.getOrCreate("main", "http://localhost:3000/main");
const adminSocket = manager.getOrCreate("admin", "http://localhost:3000/admin");

// Dispose individual instance
manager.remove("admin");

// Clean disposal of all sockets
manager.clear();
```

---

## API Reference

### `SocketIOOptions`

Extends `WireFlowConfig` with Socket.IO options:

```ts
export interface SocketIOOptions extends WireFlowConfig {
  socketOptions?: Partial<ManagerOptions & SocketOptions>;
  onConnect?: () => void;
  onDisconnect?: (reason: Socket.DisconnectReason) => void;
  onConnectError?: (error: Error) => void;
  onStatusChange?: (status: ConnectionStatus) => void;
}
```

### `ISocketIOClient` Properties

| Property | Type | Description |
| :--- | :--- | :--- |
| `status` | `ConnectionStatus` (`"Idle"` \| `"Connecting"` \| `"Connected"` \| `"Failed"`) | Current connection state. |
| `isReconnecting` | `boolean` | `true` when reconnection attempts are actively running following a drop or manual `retry()`. |
| `isReconnectFailed` | `boolean` | `true` when retry attempts have exhausted and connection reached `"Failed"`. |
| `isReconnected` | `boolean` | `true` when connection succeeds after a previous disconnect/retry. |
| `socket` | `Socket \| null` | Underlying `socket.io-client` Socket instance. |
| `url` | `string` | Target Socket.IO server URL. |

### `ISocketIOClient` Methods

| Method | Signature | Description |
| :--- | :--- | :--- |
| `connect()` | `() => void` | Initiates connection attempt to the target Socket.IO server. |
| `retry()` | `() => void` | Triggers a fresh reconnection attempt. |
| `disconnect()` | `() => void` | Suppresses auto-reconnect and disconnects socket. Status transitions to `"Idle"`. |
| `emit(event, ...args)` | `(event: string, ...args: any[]) => boolean` | Emits an event with arbitrary payload arguments. Returns `true` if dispatched. |
| `on(event, listener)` | `(event, listener) => () => void` | Registers an event listener; returns unsubscriber function. |
| `off(event, listener)` | `(event, listener) => void` | Removes an active event listener. |
| `once(event, listener)` | `(event, listener) => () => void` | Registers a one-time event listener. |
| `dispose()` | `() => void` | Complete teardown: closes socket, cancels retries, removes listeners. |

---

## Next Steps

- Use in React: [`@wireflowapp/react-socketio`](./react-socketio.md)
- Use in Vue 3: [`@wireflowapp/vue-socketio`](./vue-socketio.md)
- Back to [Documentation Index](../README.md)
