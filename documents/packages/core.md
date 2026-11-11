[← Back to Documentation Landing Page](/)

# `@wireflowapp/core`

> Core connection primitives, deterministic state management, retry policies, and centralized configuration for Wireflow.

[![npm version](https://img.shields.io/npm/v/@wireflowapp/core.svg)](https://www.npmjs.com/package/@wireflowapp/core)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](../../LICENSE)

`@wireflowapp/core` is the foundational, zero-dependency layer of the Wireflow ecosystem. It establishes the shared connection lifecycle state machine, the resilient `RetryManager`, and the application-wide `WireFlowManager`.

---

## Installation

```bash
# Using pnpm
pnpm add @wireflowapp/core

# Using npm
npm install @wireflowapp/core

# Using yarn
yarn add @wireflowapp/core
```

---

## Key Modules

### 1. Connection Lifecycle (`ConnectionStatus`)

All Wireflow transports and framework adapters share a single, deterministic 4-state lifecycle:

```ts
export type ConnectionStatus = "Idle" | "Connecting" | "Connected" | "Failed";
```

| Status | Meaning | Network Activity |
| :--- | :--- | :--- |
| `"Idle"` | Uninitialized or cleanly disconnected by the user. | None |
| `"Connecting"` | Establishing an initial connection or undergoing a scheduled retry attempt. | Active connection attempt |
| `"Connected"` | Connection is active, open, and ready to send/receive messages. | Active socket stream |
| `"Failed"` | Connection failed or unexpectedly dropped, and all configured retry attempts have been exhausted. | None (awaiting manual `connect()` or `retry()`) |

---

### 2. `RetryManager`

An independent, robust stateful retry engine that calculates linear/exponential retry schedules, manages active timers, avoids duplicate timer leaks, and cleanly supports cancellation.

#### Key Features:
- **Timer Safety**: Safely resets and aborts pending `setTimeout` timers on demand.
- **Race Condition Immunity**: Guards against simultaneous multiple reconnection triggers.
- **Exhaustion Handling**: Invokes failure callbacks precisely when `attemptCount >= retryAttempts`.

#### API Example:

```ts
import { RetryManager } from "@wireflowapp/core";

const retrier = new RetryManager({
  retryAttempts: 5,
  retryDelay: 3000,
});

retrier.schedule(
  () => {
    console.log(`Executing retry attempt #${retrier.attemptCount}...`);
    // Connect attempt logic here
  },
  () => {
    console.warn("All 5 retry attempts exhausted. Marking status as Failed.");
  }
);

// Cancel anytime on manual user disconnect
retrier.reset();
```

---

### 3. `WireFlowManager`

A centralized configuration singleton allowing applications to specify universal defaults once, rather than passing options across every hook or component.

#### Configuration Priority:
1. **Hook / Client Options**: Overrides everything on a per-connection basis.
2. **`WireFlowManager` Defaults**: Application-wide configured defaults.
3. **Library Defaults**: `retryAttempts: 5`, `retryDelay: 3000`, `autoConnect: true`, `retryOnDisconnect: true`.

#### API Example:

```ts
import { WireFlowManager } from "@wireflowapp/core";

// Set global defaults at application bootstrap (e.g. index.ts, main.ts, or App.tsx)
WireFlowManager.setDefault(
  new WireFlowManager({
    retryAttempts: 8,
    retryDelay: 2000,
    autoConnect: true,
    retryOnDisconnect: true,
  })
);

// Query resolved config anywhere
const resolved = WireFlowManager.resolve({ retryAttempts: 3 });
// -> { retryAttempts: 3, retryDelay: 2000, autoConnect: true, retryOnDisconnect: true }
```

---

## TypeScript API Reference

### `WireFlowConfig`

```ts
export interface WireFlowConfig {
  /**
   * Number of retry attempts after the initial failure.
   * Total max attempts = retryAttempts + 1.
   * @default 5
   */
  retryAttempts?: number;

  /**
   * Delay in milliseconds between retry attempts.
   * @default 3000
   */
  retryDelay?: number;

  /**
   * Whether to automatically connect upon creation or mount.
   * @default true
   */
  autoConnect?: boolean;

  /**
   * Whether to automatically schedule retries when an established connection drops unexpectedly.
   * @default true
   */
  retryOnDisconnect?: boolean;
}
```

### `ConnectionResult`

```ts
export interface ConnectionResult {
  readonly status: ConnectionStatus;
  readonly isReconnecting?: boolean;
  readonly isReconnectFailed?: boolean;
  readonly isReconnected?: boolean;
  connect: () => void;
  retry: () => void;
  disconnect: () => void;
}
```

---

## Next Steps

- Explore the Native WebSocket Engine: [`@wireflowapp/websocket-core`](./websocket-core)
- Explore the Socket.IO Engine: [`@wireflowapp/socketio-core`](./socketio-core)
- Back to [Documentation Index](/)
