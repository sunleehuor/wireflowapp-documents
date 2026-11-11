[← Back to Documentation Landing Page](../README.md)

# Wireflow Monorepo Architecture & Design Guide

This guide details the architectural decisions, topological structure, dependency graph, and design philosophies that power the Wireflow monorepo.

---

## High-Level Topology

```
                         ┌─────────────────────────────┐
                         │      @wireflowapp/core      │
                         │    - ConnectionStatus       │
                         │    - RetryManager           │
                         │    - WireFlowManager        │
                         └──────────────┬──────────────┘
                                        │
                 ┌──────────────────────┴──────────────────────┐
                 ▼                                             ▼
  ┌─────────────────────────────┐               ┌─────────────────────────────┐
  │  @wireflowapp/websocket-core│               │   @wireflowapp/socketio-core│
  │  - WebSocketClient          │               │   - SocketIOClient          │
  │  - Native Browser/Node WS   │               │   - socket.io-client engine │
  └──────────────┬──────────────┘               └──────────────┬──────────────┘
                 │                                             │
         ┌───────┴───────┐                             ┌───────┴───────┐
         ▼               ▼                             ▼               ▼
  ┌──────────────┐┌──────────────┐              ┌──────────────┐┌──────────────┐
  │@wireflowapp/ ││@wireflowapp/ │              │@wireflowapp/ ││@wireflowapp/ │
  │react-        ││vue-          │              │react-        ││vue-          │
  │websocket     ││websocket     │              │socketio      ││socketio      │
  └──────────────┘└──────────────┘              └──────────────┘└──────────────┘
```

---

## Core Architectural Principles

### 1. Zero Cross-Pollution
Framework-agnostic logic lives strictly in `packages/core`, `packages/websocket-core`, and `packages/socketio-core`.
- A React application consuming `@wireflowapp/react-websocket` will **never** pull in Vue or `socket.io-client`.
- Sockets and connection state management can be ported across frameworks with identical lifecycle mechanics.

### 2. Deterministic State Machine
Real-time connections follow a rigorous 4-state finite state machine:
- `"Idle"`: Uninitialized or cleanly closed by user.
- `"Connecting"`: Connection in flight or retrying.
- `"Connected"`: Fully open and ready for bi-directional streaming.
- `"Failed"`: Fatal error or retry exhaustion.

### 3. Dual-Transport Reconnection Strategy
- **Native WebSocket**: Driven by `@wireflowapp/core`'s stateful `RetryManager` with active timer tracking and cleanup.
- **Socket.IO**: Delegates directly to Socket.IO's battle-tested internal reconnection manager (`reconnectionAttempts`, `reconnectionDelay`) while synchronizing state transitions back to Wireflow's normalized `status`.

---

## Build Pipeline & Artifacts

Every package in the monorepo is compiled using `tsup` into dual formats:
- **ESM (`dist/index.mjs`)**: For modern bundlers (Vite, Rollup, Webpack 5, Next.js).
- **CJS (`dist/index.js`)**: For legacy Node.js CommonJS pipelines.
- **Type Declarations (`dist/index.d.ts`, `dist/index.d.mts`)**: Full TypeScript declarations with strict sourcemap alignment.
