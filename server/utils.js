// Maximum payload size: 10KB to prevent DoS attacks
const MAX_PAYLOAD_SIZE = 10 * 1024;

export function parseBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    let size = 0;

    req.on("data", chunk => {
      size += chunk.length;

      // Prevent payload from exceeding size limit
      if (size > MAX_PAYLOAD_SIZE) {
        req.destroy();
        reject(new Error(`Payload too large. Maximum size is ${MAX_PAYLOAD_SIZE} bytes`));
        return;
      }

      data += chunk;
    });

    req.on("end", () => {
      try {
        const parsed = JSON.parse(data || "{}");
        resolve(parsed);
      } catch (err) {
        console.error("JSON parse error:", err);
        reject(new Error("Invalid JSON in request body"));
      }
    });

    req.on("error", reject);
  });
}