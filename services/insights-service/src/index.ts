import { createApp } from "./app";

const port = Number(process.env.PORT ?? 4006);
const app = createApp();

app.listen(port, () => {
  console.log(`insights-service listening on port ${port}`);
});
