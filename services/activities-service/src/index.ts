import { createApp } from "./app";

const port = Number(process.env.PORT ?? 4005);
const app = createApp();

app.listen(port, () => {
  console.log(`activities-service listening on port ${port}`);
});
