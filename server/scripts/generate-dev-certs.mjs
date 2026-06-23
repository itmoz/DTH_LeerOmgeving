import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { fileURLToPath } from "url";
import selfsigned from "selfsigned";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const certDir = path.join(__dirname, "..", "certs");
const keyPath = path.join(certDir, "dev-key.pem");
const certPath = path.join(certDir, "dev-cert.pem");

const certAttributes = [{ name: "commonName", value: "localhost" }];
const certOptions = {
  keySize: 4096,
  days: 825,
  algorithm: "sha256",
  extensions: [
    {
      name: "subjectAltName",
      altNames: [
        { type: 2, value: "localhost" },
        { type: 2, value: "127.0.0.1" },
        { type: 7, ip: "127.0.0.1" },
      ],
    },
  ],
};

function writeCertificates(key, cert) {
  if (!fs.existsSync(certDir)) {
    fs.mkdirSync(certDir, { recursive: true });
  }

  fs.writeFileSync(keyPath, key, { mode: 0o600 });
  fs.writeFileSync(certPath, cert, { mode: 0o644 });
}

function generateWithOpenSsl() {
  const gitOpenSsl = "C:\\Program Files\\Git\\usr\\bin\\openssl.exe";
  const opensslBin = fs.existsSync(gitOpenSsl) ? `"${gitOpenSsl}"` : "openssl";

  const opensslCmd = [
    `${opensslBin} req -x509`,
    "-newkey rsa:4096",
    `-keyout "${keyPath}"`,
    `-out "${certPath}"`,
    "-days 825",
    "-nodes",
    '-subj "/CN=localhost/O=DTH Leeromgeving Dev/C=NL"',
  ].join(" ");

  execSync(opensslCmd, { stdio: "pipe" });
}

function generateWithNode() {
  const generated = selfsigned.generate(certAttributes, certOptions);
  writeCertificates(generated.private, generated.cert);
}

if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
  console.log("Development certificates already exist:");
  console.log(`  ${keyPath}`);
  console.log(`  ${certPath}`);
  process.exit(0);
}

try {
  try {
    generateWithOpenSsl();
    console.log("Development TLS certificates created with OpenSSL.");
  } catch {
    generateWithNode();
    console.log("Development TLS certificates created with Node (selfsigned).");
  }

  console.log(`  ${keyPath}`);
  console.log(`  ${certPath}`);
  console.log("Browsers will show a warning for self-signed certs — expected in development.");
} catch (error) {
  console.error("\nCould not generate certificates:", error.message);
  process.exit(1);
}
