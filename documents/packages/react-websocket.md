[← Back to Documentation Landing Page](../README.md)

# `@wireflowapp/react-websocket`

> Idiomatic React hook (`useWebSocket`) for native WebSocket connections in React 18 & 19 with Strict Mode & Fast Refresh safety.

[![npm version](https://img.shields.io/npm/v/@wireflowapp/react-websocket.svg)](https://www.npmjs.com/package/@wireflowapp/react-websocket)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](../../LICENSE)

`@wireflowapp/react-websocket` binds native WebSocket management into React's reactive state. It handles React 18+ double-effect invocations in Strict Mode, avoids infinite reconnection loops from inline objects, and prevents memory leaks on component unmount.

---

## Installation

```bash
# Using pnpm
pnpm add @wireflowapp/react-websocket @wireflowapp/websocket-core @wireflowapp/core react react-dom

# Using npm
npm install @wireflowapp/react-websocket @wireflowapp/websocket-core @wireflowapp/core react react-dom

# Using yarn
yarn add @wireflowapp/react-websocket @wireflowapp/websocket-core @wireflowapp/core react react-dom
```

---

## Quick Start Example

```tsx
import React, { useState } from "react";
import { useWebSocket } from "@wireflowapp/react-websocket";

export function LiveTerminal() {
  const [logs, setLogs] = useState<string[]>([]);
  const [command, setCommand] = useState("");

  const {
    status,
    isReconnecting,
    isReconnectFailed,
    isReconnected,
    send,
    connect,
    disconnect,
    retry,
  } = useWebSocket(
    "wss://echo.websocket.events",
    {
      autoConnect: true,
      retryAttempts: 5,
      retryDelay: 3000,
      onOpen: () => console.log("WebSocket connection established"),
      onMessage: (event) => setLogs((prev) => [...prev, String(event.data)]),
      onClose: (event) => console.log("WebSocket closed with code:", event.code),
      onError: (err) => console.error("WebSocket error:", err),
    }
  );

  const handleSend = () => {
    if (command.trim()) {
      send(command);
      setCommand("");
    }
  };

  return (
    <div>
      <h3>Status: <span>{status}</span></h3>
      {isReconnecting && <p>Reconnecting...</p>}
      {isReconnectFailed && <p style={{ color: "red" }}>Reconnection failed.</p>}
      {isReconnected && <p style={{ color: "green" }}>Reconnected successfully!</p>}

      {/* Manual Connection Controls */}
      <div>
        <button onClick={connect} disabled={status === "Connected"}>Connect</button>
        <button onClick={disconnect} disabled={status === "Idle"}>Disconnect</button>
        <button onClick={retry} disabled={status === "Connected"}>Retry</button>
      </div>

      {/* Command Sender */}
      <div>
        <input
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          placeholder="Type message..."
        />
        <button onClick={handleSend} disabled={status !== "Connected"}>
          Send
        </button>
      </div>

      {/* Stream Logs */}
      <ul>
        {logs.map((log, i) => (
          <li key={i}>{log}</li>
        ))}
      </ul>
    </div>
  );
}
```

---

## Key Guarantees & Architecture

### 1. React 18+ Strict Mode Immunity
In React 18 development, components mount, unmount, and immediately remount. `useWebSocket` cleanly tears down socket connections on unmount and safely connects on remount without creating ghost duplicate sockets.

### 2. Reference Stability
Passing inline options or callback functions will **not** trigger infinite reconnect loops:
```tsx
// This is completely safe in Wireflow:
useWebSocket("wss://example.com/ws", {
  retryAttempts: 5,
  onMessage: (e) => handleData(e), // Stable; will not recreate socket on re-render!
});
```

### 3. Next.js & SSR Safety
Ships with `"use client"` directive. It safely defers connection instantiation until running in client browser environments.

---

## API Reference

### Hook Signature

```ts
function useWebSocket(
  url: string,
  options?: UseWebSocketOptions
): UseWebSocketResult
```

### `UseWebSocketResult`

| Property | Type | Description |
| :--- | :--- | :--- |
| `status` | `ConnectionStatus` (`"Idle"` \| `"Connecting"` \| `"Connected"` \| `"Failed"`) | React state reflecting active connection status. |
| `isReconnecting` | `boolean` | `true` when reconnect attempts are active following a drop or manual `retry()`. |
| `isReconnectFailed` | `boolean` | `true` when all reconnect attempts have exhausted and connection reached `"Failed"`. |
| `isReconnected` | `boolean` | `true` when connection succeeds after a previous disconnect/retry. |
| `connect` | `() => void` | Initiates connection attempt to the target URL. |
| `retry` | `() => void` | Manually triggers reconnection attempt. |
| `disconnect` | `() => void` | Cleanly disconnects the socket and cancels pending retry timers. |
| `send` | `(data: WebSocketDataType) => boolean` | Transmits payload over active socket. Returns `true` if dispatched. |
| `client` | `WebSocketClient \| null` | Direct access to underlying `WebSocketClient` instance. |

### `UseWebSocketOptions`

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `autoConnect` | `boolean` | `true` | Connect automatically on mount or URL change. |
| `retryOnDisconnect` | `boolean` | `true` | Auto-reconnect when connection drops unexpectedly. |
| `retryAttempts` | `number` | `5` | Maximum number of retry attempts before `"Failed"`. |
| `retryDelay` | `number` | `3000` | Delay in ms between retries. |
| `protocols` | `string \| string[]` | `undefined` | Native WebSocket sub-protocols. |
| `binaryType` | `BinaryType` | `undefined` | `"blob"` or `"arraybuffer"`. |
| `onOpen` | `(event: Event) => void` | `undefined` | Open callback. |
| `onClose` | `(event: CloseEvent) => void` | `undefined` | Close callback. |
| `onError` | `(event: Event) => void` | `undefined` | Error callback. |
| `onMessage` | `(event: MessageEvent) => void` | `undefined` | Incoming data callback. |
| `onStatusChange` | `(status: ConnectionStatus) => void` | `undefined` | Status change callback. |

---

## Next Steps

- Check out the runnable interactive example: [`examples/react-websocket`](../../examples/react-websocket/README.md)
- Explore React Socket.IO: [`@wireflowapp/react-socketio`](./react-socketio.md)
- Back to [Documentation Index](../README.md)
