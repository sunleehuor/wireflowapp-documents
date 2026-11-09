[← Back to Documentation Landing Page](/)

# `@wireflowapp/vue-socketio`

> Socket.IO composable (`useSocketIO`) for Vue 3 Composition API with reactive status tracking, event channeling, and auto-cleanup.

[![npm version](https://img.shields.io/npm/v/@wireflowapp/vue-socketio.svg)](https://www.npmjs.com/package/@wireflowapp/vue-socketio)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](../../LICENSE)

`@wireflowapp/vue-socketio` provides an idiomatic Vue 3 composable for `socket.io-client`. It exposes a reactive `status: Ref<ConnectionStatus>`, intuitive `emit` and `on` methods, and automatically tears down subscriptions and connections upon component unmount.

---

## Installation

```bash
# Using pnpm
pnpm add @wireflowapp/vue-socketio @wireflowapp/socketio-core @wireflowapp/core socket.io-client vue

# Using npm
npm install @wireflowapp/vue-socketio @wireflowapp/socketio-core @wireflowapp/core socket.io-client vue

# Using yarn
yarn add @wireflowapp/vue-socketio @wireflowapp/socketio-core @wireflowapp/core socket.io-client vue
```

---

## Quick Start Example (`<script setup>`)

```vue
<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useSocketIO } from "@wireflowapp/vue-socketio";

const chatMessages = ref<string[]>([]);
const messageInput = ref("");

const { status, emit, on, connect, disconnect, retry } = useSocketIO(
  "http://localhost:3000",
  {
    autoConnect: true,
    retryAttempts: 5,
    retryDelay: 3000,
    socketOptions: {
      transports: ["websocket"],
    },
    onConnect: () => console.log("Socket.IO connected"),
    onDisconnect: (reason) => console.log("Socket.IO disconnected:", reason),
  }
);

onMounted(() => {
  // Listen for custom server events
  on("chat_message", (payload: any) => {
    chatMessages.value.push(String(payload.text || payload));
  });
});

function handleSend() {
  if (messageInput.value.trim()) {
    emit("chat_message", { text: messageInput.value });
    messageInput.value = "";
  }
}
</script>

<template>
  <div>
    <h2>Vue Socket.IO Example</h2>
    <p>Status: <strong>{{ status }}</strong></p>

    <!-- Controls -->
    <div>
      <button @click="connect" :disabled="status === 'Connected'">Connect</button>
      <button @click="disconnect" :disabled="status === 'Idle'">Disconnect</button>
      <button @click="retry" :disabled="status === 'Connected'">Retry</button>
    </div>

    <!-- Message Sender -->
    <div>
      <input v-model="messageInput" placeholder="Enter message..." />
      <button @click="handleSend" :disabled="status !== 'Connected'">Send</button>
    </div>

    <!-- Chat Messages -->
    <ul>
      <li v-for="(msg, index) in chatMessages" :key="index">{{ msg }}</li>
    </ul>
  </div>
</template>
```

---

## Vue Reactivity & Lifecycle Integration

- **Reactive State**: `status` is a Vue 3 `Ref<ConnectionStatus>`. Direct template binding (`{{ status }}`) works without manual `.value` unwrapping.
- **Automatic Lifecycle Cleanup**: When the component unmounts, Vue's `onUnmounted` hook automatically calls `client.dispose()`, closing the socket and removing all active event listeners.

---

## API Reference

### Composable Signature

```ts
function useSocketIO(
  url: string,
  options?: UseSocketIOOptions
): UseSocketIOResult
```

### `UseSocketIOResult`

| Property | Type | Description |
| :--- | :--- | :--- |
| `status` | `Ref<ConnectionStatus>` (`"Idle"` \| `"Connecting"` \| `"Connected"` \| `"Failed"`) | Reactive Vue `Ref` representing current connection state. |
| `connect` | `() => void` | Initiates connection attempt to the target Socket.IO server. |
| `retry` | `() => void` | Manually triggers reconnection attempt. |
| `disconnect` | `() => void` | Cleanly disconnects the socket and cancels pending retries. |
| `emit` | `(event: string, ...args: any[]) => boolean` | Emits an event with arbitrary payload data. Returns `true` if dispatched. |
| `on` | `(event: string, listener: (...args: any[]) => void) => () => void` | Registers an event listener; returns an unregister function. |
| `off` | `(event: string, listener: (...args: any[]) => void) => void` | Removes an active event listener from the underlying socket. |
| `client` | `SocketIOClient` | Direct reference to underlying `SocketIOClient` instance. |

### `UseSocketIOOptions`

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `autoConnect` | `boolean` | `true` | Connect automatically on mount. |
| `retryOnDisconnect` | `boolean` | `true` | When `true`, Socket.IO's internal manager handles reconnections. |
| `retryAttempts` | `number` | `5` | Maximum reconnection attempts forwarded to Socket.IO. |
| `retryDelay` | `number` | `3000` | Delay in ms forwarded to Socket.IO manager. |
| `socketOptions` | `Partial<ManagerOptions & SocketOptions>` | `undefined` | Low-level configuration passed to `socket.io-client`. |
| `onConnect` | `() => void` | `undefined` | Callback fired on successful connection. |
| `onDisconnect` | `(reason: string) => void` | `undefined` | Callback fired on disconnect. |
| `onConnectError` | `(error: Error) => void` | `undefined` | Callback fired on connection error. |
| `onStatusChange` | `(status: ConnectionStatus) => void` | `undefined` | Callback fired on status transition. |

---

## Next Steps

- Check out the runnable interactive example: [`examples/vue-socketio`](../../examples/vue-socketio/README)
- Explore Core Architecture: [Architecture Overview](../guides/architecture)
- Back to [Documentation Index](/)
