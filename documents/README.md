# Wireflow Documentation

<p align="center">
  <strong>Production-ready, type-safe real-time connection management for WebSocket & Socket.IO.</strong><br>
  With first-class reactive bindings for <strong>React 18+</strong> and <strong>Vue 3</strong>.
</p>

---

## 📖 Welcome to Wireflow asdas

**Wireflow** is a modular, high-performance real-time connection management ecosystem for modern TypeScript applications. It eliminates the traditional headaches of real-time communication:

- 🔄 **Deterministic State Machine**: Replaces raw integer socket states (`0, 1, 2, 3`) with human-readable UI states: `"Idle"`, `"Connecting"`, `"Connected"`, and `"Failed"`.
- 🛡️ **Race Condition & Strict Mode Immunity**: Immune to React 18+ Strict Mode double mounting, preventing duplicate socket instantiations and orphaned timers.
- ⚡ **Zero-Bloat Modular Architecture**: Zero cross-package pollution. If you use native WebSocket in React, you will never download Vue or `socket.io-client`.
- 🔁 **Managed Reconnection Engine**: Stateful retry scheduler with configurable backoff, retry ceilings, and manual cancellation.
- 🌐 **SSR-Friendly**: Safe for Next.js (App Router `"use client"`), Nuxt 3, and Vite.

---

## 📦 Packages Directory (Click to View)

Explore detailed documentation, API surfaces, and usage guides for each package:

### 🧩 Framework Adapters

| Package | Framework | Transport | Documentation |
| :--- | :--- | :--- | :--- |
| **[`@wireflowapp/react-websocket`](/packages/react-websocket)** | React 18 & 19 | Native WebSocket | [View React WebSocket Guide](/packages/react-websocket) ↗ |
| **[`@wireflowapp/react-socketio`](/packages/react-socketio)** | React 18 & 19 | Socket.IO | [View React Socket.IO Guide](/packages/react-socketio) ↗ |
| **[`@wireflowapp/vue-websocket`](/packages/vue-websocket)** | Vue 3 | Native WebSocket | [View Vue WebSocket Guide](/packages/vue-websocket) ↗ |
| **[`@wireflowapp/vue-socketio`](/packages/vue-socketio)** | Vue 3 | Socket.IO | [View Vue Socket.IO Guide](/packages/vue-socketio) ↗ |

### ⚙️ Core Engines (Framework-Agnostic)

| Package | Description | Documentation |
| :--- | :--- | :--- |
| **[`@wireflowapp/core`](/packages/core)** | Core lifecycle types, `RetryManager`, and global `WireFlowManager` | [View Core Guide](/packages/core) ↗ |
| **[`@wireflowapp/websocket-core`](/packages/websocket-core)** | Standalone native WebSocket client engine and instance manager | [View WebSocket Core Guide](/packages/websocket-core) ↗ |
| **[`@wireflowapp/socketio-core`](/packages/socketio-core)** | Standalone Socket.IO client wrapper and instance manager | [View Socket.IO Core Guide](/packages/socketio-core) ↗ |

---

## 🧭 Architecture & Design

Wireflow uses a clean three-tiered layered architecture:

```
                            ┌─────────────────────────┐
                            │    @wireflowapp/core    │
                            │  - ConnectionStatus     │
                            │  - RetryManager         │
                            │  - WireFlowManager      │
                            └────────────┬────────────┘
                                         │
                   ┌─────────────────────┴─────────────────────┐
                   ▼                                           ▼
        ┌─────────────────────┐                     ┌─────────────────────┐
        │@wireflowapp/        │                     │@wireflowapp/        │
        │websocket-core       │                     │socketio-core        │
        └──────────┬──────────┘                     └──────────┬──────────┘
                   │                                           │
         ┌─────────┴─────────┐                       ┌─────────┴─────────┐
         ▼                   ▼                       ▼                   ▼
┌──────────────────┐┌──────────────────┐    ┌──────────────────┐┌──────────────────┐
│  @wireflowapp/   ││  @wireflowapp/   │    │  @wireflowapp/   ││  @wireflowapp/   │
│  react-websocket ││  vue-websocket   │    │  react-socketio  ││  vue-socketio    │
└──────────────────┘└──────────────────┘    └──────────────────┘└──────────────────┘
```

Read the full architectural guide: [Monorepo Architecture & Design Guide](./guides/architecture).

---

## 🔄 Universal Connection State Machine

All 7 packages adhere to the identical 4-state lifecycle:

```
  ┌────────┐          connect()          ┌────────────┐
  │  Idle  ├────────────────────────────►│ Connecting │
  └───▲────┘                             └──────┬─────┘
      │                                         │
 disconnect()                      success ┌────┴────┐ failure
      │                                    ▼         ▼
      │                              ┌──────────┐  ┌────────┐
      └──────────────────────────────┤Connected │  │ Failed │
                                     └──────────┘  └───▲────┘
                                          │            │
                                          └────────────┘
                                    unexpected disconnect (retrying)
```

- **`"Idle"`**: Socket has not been started, or was intentionally closed with `disconnect()`.
- **`"Connecting"`**: Active initial connection or retry attempt is underway.
- **`"Connected"`**: Connection is established and actively streaming.
- **`"Failed"`**: Connection attempts have exhausted the configured `retryAttempts` limit.

---

## ⚡ Quick Matrix Comparison

| Feature | `@wireflowapp/react-websocket` | `@wireflowapp/react-socketio` | `@wireflowapp/vue-websocket` | `@wireflowapp/vue-socketio` |
| :--- | :---: | :---: | :---: | :---: |
| **Framework** | React 18 / 19 | React 18 / 19 | Vue 3 Composition | Vue 3 Composition |
| **Transport** | Native WebSocket | `socket.io-client` | Native WebSocket | `socket.io-client` |
| **Primary Hook / Composable** | `useWebSocket()` | `useSocketIO()` | `useWebSocket()` | `useSocketIO()` |
| **Reactive Status Type** | `ConnectionStatus` | `ConnectionStatus` | `Ref<ConnectionStatus>` | `Ref<ConnectionStatus>` |
| **Sending API** | `send(data)` | `emit(event, ...args)` | `send(data)` | `emit(event, ...args)` |
| **Event Subscriptions** | Callbacks (`onMessage`) | `on(event, handler)` | Callbacks (`onMessage`) | `on(event, handler)` |
| **Auto Cleanup** | React `useEffect` teardown | React `useEffect` teardown | Vue `onUnmounted` | Vue `onUnmounted` |
| **Direct Client Access** | `.client` (`WebSocketClient`) | `.client` (`SocketIOClient`) | `.client` (`WebSocketClient`) | `.client` (`SocketIOClient`) |

---

## 🚀 Interactive Examples

Try out full working implementations of all 4 adapters connected to a live dual-protocol mock server:

- **[Interactive Examples Guide](./guides/examples)**
  - Native WebSocket server on `ws://localhost:8080`
  - Socket.IO server on `http://localhost:3000`
  - React & Vue runnable Vite projects
