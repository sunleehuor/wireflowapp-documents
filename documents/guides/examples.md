[← Back to Documentation Landing Page](../README.md)

# Wireflow Interactive Examples Guide

Wireflow includes 4 fully functional interactive example applications built with Vite, paired with a dual-protocol test backend.

---

## Example Applications Directory

| Directory | Framework | Transport | Documentation |
| :--- | :--- | :--- | :--- |
| [`examples/react-websocket`](../../examples/react-websocket) | React 18 | Native WebSocket | [React WebSocket Guide](../../examples/react-websocket/README.md) |
| [`examples/react-socketio`](../../examples/react-socketio) | React 18 | Socket.IO | [React Socket.IO Guide](../../examples/react-socketio/README.md) |
| [`examples/vue-websocket`](../../examples/vue-websocket) | Vue 3 | Native WebSocket | [Vue WebSocket Guide](../../examples/vue-websocket/README.md) |
| [`examples/vue-socketio`](../../examples/vue-socketio) | Vue 3 | Socket.IO | [Vue Socket.IO Guide](../../examples/vue-socketio/README.md) |

---

## Dual-Protocol Mock Server (`examples/server.mjs`)

The mock server runs two real-time services concurrently:
1. **Native WebSocket Server** on port `8080` (`ws://localhost:8080`)
   - Echoes incoming text payloads.
   - Dispatches a welcome greeting upon connection.
2. **Socket.IO Server** on port `3000` (`http://localhost:3000`)
   - Handles `chat_message` events and broadcasts responses.
   - Responds to `ping` with `pong`.

### Launching the Mock Server

From the monorepo root:

```bash
pnpm dev:server
```

---

## Running the Examples

Open a new terminal window to run any example app:

```bash
# React Native WebSocket
pnpm dev:react-ws

# React Socket.IO
pnpm dev:react-io

# Vue 3 Native WebSocket
pnpm dev:vue-ws

# Vue 3 Socket.IO
pnpm dev:vue-io
```
