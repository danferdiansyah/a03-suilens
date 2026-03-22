import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import { startConsumer } from "./consumer";

const app = new Elysia()
  .use(cors())
  .use(swagger({
    documentation: {
      info: { title: "Notification Service API", version: "1.0.0", description: "API for notifications and real-time WebSocket updates" },
    },
  }))
  .get("/health", () => ({ status: "ok", service: "notification-service" }))
  .listen(3003);

startConsumer().catch(console.error);

console.log(`Notification Service running on port ${app.server?.port}`);
