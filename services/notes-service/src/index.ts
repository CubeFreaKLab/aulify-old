import { createApp } from "./app";

const port = Number(process.env.PORT ?? 4003);
const app = createApp();

app.listen(port, () => {
  console.log(`notes-service listening on port ${port}`);
});
