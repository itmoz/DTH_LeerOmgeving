import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const defaultCertDir = path.join(__dirname, "certs");

export function getTlsPaths() {
  return {
    keyPath: process.env.TLS_KEY_PATH || path.join(defaultCertDir, "dev-key.pem"),
    certPath: process.env.TLS_CERT_PATH || path.join(defaultCertDir, "dev-cert.pem"),
  };
}

export function shouldUseTls() {
  if (process.env.USE_TLS === "false") return false;
  if (process.env.USE_TLS === "true") return true;

  const { keyPath, certPath } = getTlsPaths();
  return fs.existsSync(keyPath) && fs.existsSync(certPath);
}

export function loadTlsCredentials() {
  const { keyPath, certPath } = getTlsPaths();

  if (!fs.existsSync(keyPath) || !fs.existsSync(certPath)) {
    throw new Error(
      `TLS certificates not found. Run "npm run certs:generate" or set TLS_KEY_PATH and TLS_CERT_PATH.`
    );
  }

  return {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath),
  };
}

export function getDefaultFrontendOrigins(useTls) {
  if (useTls) {
    return "https://127.0.0.1:5173,https://localhost:5173";
  }
  return "http://127.0.0.1:5173,http://localhost:5173";
}
