import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import { startConsumer } from "./consumer";

export const wsClients = new Set<any>();

const app = new Elysia()
  .use(cors())
  .use(swagger({
    documentation: {
      info: { title: "Notification Service API", version: "1.0.0", description: "API for notifications and real-time WebSocket updates" },
    },
  }))
  .get("/health", () => ({ status: "ok", service: "notification-service" }))
  .ws("/ws", {
    open(ws) {
      wsClients.add(ws);
      console.log(`WebSocket client connected. Total: ${wsClients.size}`);
    },
    close(ws) {
      wsClients.delete(ws);
      console.log(`WebSocket client disconnected. Total: ${wsClients.size}`);
    },
    message(ws, message) {
      // No-op: server only broadcasts
    },
  })
  .listen(3003);

startConsumer().catch(console.error);

console.log(`Notification Service running on port ${app.server?.port}`);
