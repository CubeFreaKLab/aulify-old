import { createApp } from "./app";

const port = Number(process.env.PORT ?? 4004);
const app = createApp();

app.listen(port, () => {
  console.log(`tasks-service listening on port ${port}`);
});
