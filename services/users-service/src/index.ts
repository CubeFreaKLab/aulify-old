import { createApp } from "./app";

const port = Number(process.env.PORT ?? 4001);
const app = createApp();

app.listen(port, () => {
  console.log(`users-service listening on port ${port}`);
});
