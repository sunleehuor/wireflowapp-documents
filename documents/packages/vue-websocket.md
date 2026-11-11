[← Back to Documentation Landing Page](/)

# `@wireflowapp/vue-websocket`

> Native WebSocket composable (`useWebSocket`) for Vue 3 Composition API with reactive `Ref<ConnectionStatus>` and lifecycle management.

[![npm version](https://img.shields.io/npm/v/@wireflowapp/vue-websocket.svg)](https://www.npmjs.com/package/@wireflowapp/vue-websocket)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](../../LICENSE)

`@wireflowapp/vue-websocket` integrates native WebSocket connections into Vue 3 applications. It exposes a reactive `status: Ref<ConnectionStatus>` that unwraps cleanly in `<template>` blocks and automatically tears down connections upon component unmount via Vue's `onUnmounted` hook.

---

## Installation

```bash
# Using pnpm
pnpm add @wireflowapp/vue-websocket @wireflowapp/websocket-core @wireflowapp/core vue

# Using npm
npm install @wireflowapp/vue-websocket @wireflowapp/websocket-core @wireflowapp/core vue

# Using yarn
yarn add @wireflowapp/vue-websocket @wireflowapp/websocket-core @wireflowapp/core vue
```

---

## Quick Start Example (`<script setup>`)

```vue
<script setup lang="ts">
import { ref } from "vue";
import { useWebSocket } from "@wireflowapp/vue-websocket";

const messages = ref<string[]>([]);
const messageInput = ref("");

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
  "ws://localhost:8080",
  {
    autoConnect: true,
    retryAttempts: 5,
    retryDelay: 3000,
    onMessage: (event) => {
      messages.value.push(String(event.data));
    },
    onStatusChange: (newStatus) => {
      console.log("WebSocket status changed to:", newStatus);
    },
  }
);

function handleSend() {
  if (messageInput.value.trim()) {
    send(messageInput.value);
    messageInput.value = "";
  }
}
</script>

<template>
  <div>
    <h2>Vue WebSocket Example</h2>
    <p>Status: <strong>{{ status }}</strong></p>
    <p v-if="isReconnecting">Reconnecting to WebSocket...</p>
    <p v-if="isReconnectFailed" style="color: red;">Reconnection failed.</p>
    <p v-if="isReconnected" style="color: green;">Reconnected successfully!</p>

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

    <!-- Message List -->
    <ul>
      <li v-for="(msg, index) in messages" :key="index">{{ msg }}</li>
    </ul>
  </div>
</template>
```

---

## Vue Reactivity & Lifecycle Integration

- **Reactive State**: `status` is a first-class Vue 3 `Ref<ConnectionStatus>`. It works seamlessly with `computed()`, `watch()`, and `watchEffect()`.
- **Automatic Lifecycle Cleanup**: When the component unmounts, Vue's `onUnmounted` hook automatically calls `client.dispose()`, closing the native WebSocket and canceling pending retry timers to eliminate memory leaks.

---

## API Reference

### Composable Signature

```ts
function useWebSocket(
  url: string,
  options?: UseWebSocketOptions
): UseWebSocketResult
```

### `UseWebSocketResult`

| Property | Type | Description |
| :--- | :--- | :--- |
| `status` | `Ref<ConnectionStatus>` (`"Idle"` \| `"Connecting"` \| `"Connected"` \| `"Failed"`) | Reactive Vue `Ref` representing current connection state. |
| `isReconnecting` | `Ref<boolean>` | Reactive `Ref<boolean>`: `true` when reconnect attempts are active following a drop or manual `retry()`. |
| `isReconnectFailed` | `Ref<boolean>` | Reactive `Ref<boolean>`: `true` when all reconnect attempts have exhausted and connection reached `"Failed"`. |
| `isReconnected` | `Ref<boolean>` | Reactive `Ref<boolean>`: `true` when connection succeeds after a previous disconnect/retry. |
| `connect` | `() => void` | Initiates connection attempt to the target URL. |
| `retry` | `() => void` | Manually triggers reconnection attempt. |
| `disconnect` | `() => void` | Gracefully closes socket and cancels scheduled retry timers. |
| `send` | `(data: WebSocketDataType) => boolean` | Dispatches data payload over active connection. Returns `true` if sent. |
| `client` | `WebSocketClient` | Direct reference to underlying `WebSocketClient` instance. |

### `UseWebSocketOptions`

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `autoConnect` | `boolean` | `true` | Connect automatically on mount. |
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

- Check out the runnable interactive example: [`examples/vue-websocket`](../../examples/vue-websocket/README)
- Explore Vue 3 Socket.IO: [`@wireflowapp/vue-socketio`](./vue-socketio)
- Back to [Documentation Index](/)
