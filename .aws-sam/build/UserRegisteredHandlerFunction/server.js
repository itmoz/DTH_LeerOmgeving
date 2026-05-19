import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";

const hostname = process.env.HOST_NAME || "127.0.0.1";
const port = process.env.PORT || 3000;

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}`);
});