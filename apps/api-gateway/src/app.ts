import express from "express";

export function createApp() {
  const app = express();

  app.get("/health", (_request, response) => {
    response.status(200).json({ status: "ok", service: "api-gateway" });
  });

  return app;
}
