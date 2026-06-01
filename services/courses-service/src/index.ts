import { createApp } from "./app";

const port = Number(process.env.PORT ?? 4002);
const app = createApp();

app.listen(port, () => {
  console.log(`courses-service listening on port ${port}`);
});
