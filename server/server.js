import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const serverDir = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(serverDir, ".env") });

import http from "http";
import https from "https";
import { createRequestHandler } from "./requestHandler.js";
import {
  getDefaultFrontendOrigins,
  loadTlsCredentials,
  shouldUseTls,
} from "./tls.js";

const hostname = process.env.HOST_NAME || "127.0.0.1";
const port = Number(process.env.PORT || 3000);
const useTls = shouldUseTls();

process.env.COOKIE_SECURE = process.env.COOKIE_SECURE ?? (useTls ? "true" : "false");

const allowedOrigins = (
  process.env.FRONTEND_ORIGIN || getDefaultFrontendOrigins(useTls)
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const handleRequest = createRequestHandler(allowedOrigins);

function startHttpRedirectServer() {
  const redirectPort = Number(process.env.HTTP_REDIRECT_PORT || 3001);

  const redirectServer = http.createServer((req, res) => {
    const hostHeader = req.headers.host || `${hostname}:${port}`;
    const hostWithoutPort = hostHeader.split(":")[0];
    const target = `https://${hostWithoutPort}:${port}${req.url || "/"}`;

    res.writeHead(301, { Location: target });
    res.end();
  });

  redirectServer.listen(redirectPort, hostname, () => {
    console.log(`HTTP redirect active at http://${hostname}:${redirectPort} -> https://${hostname}:${port}`);
  });
}

if (useTls) {
  const credentials = loadTlsCredentials();
  const server = https.createServer(credentials, handleRequest);

  server.listen(port, hostname, () => {
    console.log(`Server running at https://${hostname}:${port} (TLS enabled)`);
  });

  if (process.env.HTTP_REDIRECT !== "false") {
    startHttpRedirectServer();
  }
} else {
  console.warn(
    "WARNING: TLS is disabled. Run \"npm run certs:generate\" and restart, or set USE_TLS=true."
  );

  const server = http.createServer(handleRequest);

  server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port} (TLS disabled)`);
  });
}
