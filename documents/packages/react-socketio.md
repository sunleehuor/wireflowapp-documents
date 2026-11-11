[← Back to Documentation Landing Page](../README.md)

# `@wireflowapp/react-socketio`

> Idiomatic React hook (`useSocketIO`) for Socket.IO connections in React 18 & 19 with typed event subscriptions and lifecycle safety.

[![npm version](https://img.shields.io/npm/v/@wireflowapp/react-socketio.svg)](https://www.npmjs.com/package/@wireflowapp/react-socketio)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](../../LICENSE)

`@wireflowapp/react-socketio` exposes high-level Socket.IO integration for React. It manages subscriptions, emissions, connection statuses, and guarantees zero socket leakage during React fast-refresh and Strict Mode mounting cycles.

---

## Installation

```bash
# Using pnpm
pnpm add @wireflowapp/react-socketio @wireflowapp/socketio-core @wireflowapp/core socket.io-client react react-dom

# Using npm
npm install @wireflowapp/react-socketio @wireflowapp/socketio-core @wireflowapp/core socket.io-client react react-dom

# Using yarn
yarn add @wireflowapp/react-socketio @wireflowapp/socketio-core @wireflowapp/core socket.io-client react react-dom
```

---

## Quick Start Example

```tsx
import React, { useEffect, useState } from "react";
import { useSocketIO } from "@wireflowapp/react-socketio";

export function RealtimeDashboard() {
  const [alerts, setAlerts] = useState<string[]>([]);
  const [channel, setChannel] = useState("general");

  const {
    status,
    isReconnecting,
    isReconnectFailed,
    isReconnected,
    emit,
    on,
    connect,
    disconnect,
    retry,
  } = useSocketIO(
    "http://localhost:3000",
    {
      autoConnect: true,
      retryAttempts: 5,
      retryDelay: 3000,
      socketOptions: {
        transports: ["websocket"],
      },
    }
  );

  // Subscribe to custom event with clean unmount handling
  useEffect(() => {
    const unsubscribe = on("system_alert", (payload: any) => {
      setAlerts((prev) => [...prev, String(payload.message || payload)]);
    });

    return unsubscribe;
  }, [on]);

  const joinChannel = () => {
    emit("join_room", { room: channel });
  };

  return (
    <div>
      <h3>Socket.IO Status: <span>{status}</span></h3>
      {isReconnecting && <p>Reconnecting to Socket.IO...</p>}
      {isReconnectFailed && <p style={{ color: "red" }}>Reconnection failed after maximum attempts.</p>}
      {isReconnected && <p style={{ color: "green" }}>Reconnected successfully!</p>}

      {/* Controls */}
      <div>
        <button onClick={connect} disabled={status === "Connected"}>Connect</button>
        <button onClick={disconnect} disabled={status === "Idle"}>Disconnect</button>
        <button onClick={retry} disabled={status === "Connected"}>Retry</button>
      </div>

      {/* Emit Actions */}
      <div>
        <input value={channel} onChange={(e) => setChannel(e.target.value)} />
        <button onClick={joinChannel} disabled={status !== "Connected"}>
          Join Room
        </button>
      </div>

      {/* Alerts */}
      <ul>
        {alerts.map((alert, i) => (
          <li key={i}>{alert}</li>
        ))}
      </ul>
    </div>
  );
}
```

---

## API Reference

### Hook Signature

```ts
function useSocketIO(
  url: string,
  options?: UseSocketIOOptions
): UseSocketIOResult
```

### `UseSocketIOResult`

| Property | Type | Description |
| :--- | :--- | :--- |
| `status` | `ConnectionStatus` (`"Idle"` \| `"Connecting"` \| `"Connected"` \| `"Failed"`) | React state tracking active connection status. |
| `isReconnecting` | `boolean` | `true` when reconnect attempts are active following a drop or manual `retry()`. |
| `isReconnectFailed` | `boolean` | `true` when all reconnect attempts have exhausted and connection reached `"Failed"`. |
| `isReconnected` | `boolean` | `true` when connection succeeds after a previous disconnect/retry. |
| `connect` | `() => void` | Initiates connection attempt to the target Socket.IO server. |
| `retry` | `() => void` | Manually triggers reconnection attempt. |
| `disconnect` | `() => void` | Disconnects the socket cleanly and cancels pending retries. |
| `emit` | `(event: string, ...args: any[]) => boolean` | Emits an event with arbitrary payload data. |
| `on` | `(event: string, listener: (...args: any[]) => void) => () => void` | Registers an event listener; returns an unsubscriber for `useEffect`. |
| `off` | `(event: string, listener: (...args: any[]) => void) => void` | Removes an active event listener. |
| `client` | `SocketIOClient \| null` | Direct reference to underlying `SocketIOClient` instance. |

### `UseSocketIOOptions`

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `autoConnect` | `boolean` | `true` | Connect automatically on mount or URL change. |
| `retryOnDisconnect` | `boolean` | `true` | When `true`, Socket.IO's reconnection manager handles unexpected drops. |
| `retryAttempts` | `number` | `5` | Maximum reconnection attempts forwarded to Socket.IO. |
| `retryDelay` | `number` | `3000` | Delay in ms forwarded to Socket.IO manager. |
| `socketOptions` | `Partial<ManagerOptions & SocketOptions>` | `undefined` | Low-level configuration (e.g. `transports`, `auth`, `query`). |
| `onConnect` | `() => void` | `undefined` | Callback fired on successful connection. |
| `onDisconnect` | `(reason: string) => void` | `undefined` | Callback fired on disconnect. |
| `onConnectError` | `(error: Error) => void` | `undefined` | Callback fired on connection error. |
| `onStatusChange` | `(status: ConnectionStatus) => void` | `undefined` | Callback fired on state transition. |

---

## Next Steps

- Check out the runnable interactive example: [`examples/react-socketio`](../../examples/react-socketio/README.md)
- Explore Vue 3 Socket.IO: [`@wireflowapp/vue-socketio`](./vue-socketio.md)
- Back to [Documentation Index](../README.md)
