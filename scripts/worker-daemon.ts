/**
 * Slots Studio — Standalone Production Background Worker Daemon (TypeScript Reference)
 *
 * Runs as a decoupled, resilient background service:
 * - Continuous FIFO queue polling (PostgreSQL atomic locking)
 * - Horizontal multi-worker safe (zero duplicate claims)
 * - Automatic stale job scavenging (< 5m threshold)
 * - Graceful shutdown on SIGINT / SIGTERM with in-flight draining
 * - Single-pass mode (--once) for serverless crons / CI
 * - Exponential backoff on database connection faults
 */

import "./worker-daemon.mjs";
